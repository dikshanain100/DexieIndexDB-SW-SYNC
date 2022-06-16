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
    //private _dbStores: DBStores
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
    console.log('inside createIndexedDatabase ');
    if (!this.db) {
      console.log('first time open')
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
  }

  // COMMENT IT IF YOU WANT TO CHECK NORMAL BEHAVIOUR OF INDEX DB
  // // Open database dynamically:
  async addNewTables(_tableName, _tableSchema) {
    console.log('_tableName :: ', _tableName);
    console.log('_tableSchema ::: ', _tableSchema);
    console.log('this.db ', this.db)



    // this.db = new Dexie('database');   /////adding this resolves version error but now had to manually delete 
    //db to see newly added value and everytime some value is added, db version is upgraded
    //bcz new instance is craeted and hence schema exist is false
    if (!(await Dexie.exists(this.db.name))) {
      console.log("Db does not exist");
      this.db.version(1).stores({});
    }
    console.log('this.db before opening :: ', this.db);
    await this.db.open();
    console.log("Could open DB")

    // Add a table with some indexes:    
    console.log('_tableName :: ', _tableName);
    console.log('_tableSchema :: ', _tableSchema);
    this.db = await this.changeSchema(this.db, { [_tableName]: _tableSchema });
    console.log("Db after updating schema : ", this.db)

    //set value in localstorage
    localStorage.setItem('dbInstance', this.db);


  }

  // COMMENT IT IF YOU WANT TO CHECK NORMAL BEHAVIOUR OF INDEX DB
  // DYNAMICALLY ADD TABLE TO INDEX DB
  async changeSchema(db, schemaChanges) {
    db.close();
    const newDb = new Dexie(db.name);
    newDb.on('blocked', () => false); // Silence console warning of blocked event.

    // Workaround: If DB is empty from tables, it needs to be recreated
    if (db.tables.length === 0) {
      await db.delete();
      newDb.version(1).stores(schemaChanges);
      return await newDb.open();
    }

    // Extract current schema in dexie format ::
    const currentSchema = db.tables.reduce((result, { name, schema }) => {
      result[name] = [
        schema.primKey.src,
        ...schema.indexes.map(idx => idx.src)
      ].join(',');
      return result;
    }, {});

    console.log("Version before upgrade : " + db.verno);
    console.log("Current Schema: ", currentSchema);

    // Tell Dexie about current schema:
    newDb.version(db.verno).stores(currentSchema);


    // Tell Dexie about next schema:
    //update version only if new schema is added
    var schemaExist = db.hasOwnProperty(Object.keys(schemaChanges)[0]);
    console.log('schemaExist :: ', schemaExist);
    if (!schemaExist) {
      newDb.version(db.verno + 1).stores(schemaChanges);
    }


    // Upgrade it:
    return await newDb.open();
  }


  /////////////////////////////////////////////



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
