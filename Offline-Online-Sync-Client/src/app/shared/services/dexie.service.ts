import { Injectable } from '@angular/core';
import Dexie from 'dexie'; // wrapper for IndexedDB
import { OfflineService } from '../services/offline.service';
import { InternalHttpService } from '../../shared/services/internal-http.service';
import { URLConstants } from '../../shared/URLConstants';
// import { DBStores } from '../../shared/DBStores';

@Injectable({
  providedIn: 'root'
})
export class DexieService {

  private db: any;
  private donedb: any;

  constructor(
    private _offlineService: OfflineService,
    private _httpClient: InternalHttpService,
    // private _dbStores: DBStores
  ) {

  }



  get dbInstance() {
    return this.db;
  }



  load() {
    this.createIndexedDatabase();
    this.registerToEvents();
    this.listenToEvents();
  }



  private createIndexedDatabase() {
    //create the indexedDB to store offline data(to be added)
    this.db = new Dexie("DexieDatabase");
    this.db.version(1).stores({
      indexdb_todos_add: "title,content",
      indexdb_todos_delete: "_id"
    });


    this.db.open()
      .then(function (db) {
        console.log("Database is at version: " + db.verno);
        db.tables.forEach(function (table) {
          console.log("Found a table with name: " + table.name);
        });
      })
      .catch(function (err) {
        console.error(err.stack || err);
      });
  }

// COMMENT IT IF YOU WANT TO CHECK NORMAL BEHAVIOUR OF INDEX DB
  // // Open database dynamically:
  // async addNewTables(_tableName, _tableSchema) {
  //   // let db = new Dexie('DexieDatabase');
  //   this.db = new Dexie('DexieDatabase');
  //   if (!(await Dexie.exists(this.db.name))) {
  //     console.log("Db does not exist");
  //     this.db.version(1).stores({});
  //   }
  //   await this.db.open();
  //   console.log("Could open DB")
  //   console.log('db  :: ', this.db);



  //   // Add a table with some indexes:
  //   // db = await this.changeSchema(db, { friends: 'id, name' });
  //   this.db = await this.changeSchema(this.db, { [_tableName]: _tableSchema });
  //   console.log("Could enforce friends table with id and name ", this.db)

  //   // Add another index in the friends table
  //   // db = await this.changeSchema(db, { friends: 'id, name, age' });
  //   // console.log("Could add the age index")

  //   // Remove the age index again:
  //   // db = await this.changeSchema(db, { friends: 'id, name' })
  //   // console.log("Could remove age index")

  //   // Remove the friends table
  //   // db = await this.changeSchema(db, {friends: null});
  //   // console.log("Could delete friends table")

  // }

// COMMENT IT IF YOU WANT TO CHECK NORMAL BEHAVIOUR OF INDEX DB
  // DYNAMICALLY ADD TABLE TO INDEX DB
  // async changeSchema(db, schemaChanges) {
  //   this.db.close();
  //   const newDb = new Dexie(this.db.name);
  //   newDb.on('blocked', () => false); // Silence console warning of blocked event.

  //   // Workaround: If DB is empty from tables, it needs to be recreated
  //   if (this.db.tables.length === 0) {
  //     await this.db.delete();
  //     newDb.version(1).stores(schemaChanges);
  //     return await newDb.open();
  //   }

  //   // Extract current schema in dexie format:
  //   const currentSchema = this.db.tables.reduce((result, { name, schema }) => {
  //     result[name] = [
  //       schema.primKey.src,
  //       ...schema.indexes.map(idx => idx.src)
  //     ].join(',');
  //     return result;
  //   }, {});

  //   console.log("Version: " + this.db.verno);
  //   console.log("Current Schema: ", currentSchema);

  //   // Tell Dexie about current schema:
  //   newDb.version(this.db.verno).stores(currentSchema);
  //   // Tell Dexie about next schema:
  //   newDb.version(this.db.verno + 1).stores(schemaChanges).upgrade(tx => {});
  //   // Upgrade it:
  //   return await newDb.open();
  // }




  public registerToEvents() {
    this._offlineService.connectionChanged.subscribe(online => {
      if (online) {
        console.log('went online;sending all stored items');

        //pass the items to the backend if the connetion is enabled
        this.sendItemsFromIndexedDb();
      } else {
        console.log('went offline, storing in indexdb');
      }
    });
  }



  public listenToEvents() {
    this._offlineService.connectionChanged.subscribe(online => {
      if (online) {
        console.log('went online; sending all stored item ids');

        //send _ids for bulk delete
        this.sendItemsToDelete();
      } else {
        console.log('went offline, storing ids to delete later, in indexdb');
      }
    });

  }





  //send the todos to the backend to be added inside the mongodb
  public async sendItemsFromIndexedDb() {
    const allItems: any[] = await this.dbInstance.indexdb_todos_add.toArray();
    //bulk update to mongodb
    this.bulkTodo(allItems).then(
      (res: any) => {
        this.dbInstance.indexdb_todos_add.clear();
      },
      (err: Object) => {
        console.log('err : ', err);
      })
      .catch((err: Object) => {
      });
  }



  //send the todos to the backend to be deleted in mongodb
  public async sendItemsToDelete() {
    const allItems: any[] = await this.dbInstance.indexdb_todos_delete.toArray();
    this.bulkDelete(allItems).then(
      (res: any) => {
        this.dbInstance.indexdb_todos_delete.clear();
      },
      (err: Object) => {
        console.log('err : ', err);
      })
      .catch((err: Object) => {
      });

  }


  // Send items to backend for addition once application comes online again
  public bulkTodo(todos: any) {
    let data = todos;
    return new Promise((resolve, reject) => {
      this._httpClient.call(data, URLConstants.bulkAPI, 'POST').subscribe(
        res => {
          resolve(res)
        },
        err => reject(err)
      );
    });

  }


  // Since data has been added to mongodb after application came online; same needs to be removed from indexdb
  public bulkDelete(todos: any) {
    let data = todos;
    return new Promise((resolve, reject) => {
      this._httpClient.call(data, URLConstants.bulkDeleteAPI, 'DELETE').subscribe(
        res => {
          resolve(res)
        },
        err => reject(err)
      );

    })
  }






}
