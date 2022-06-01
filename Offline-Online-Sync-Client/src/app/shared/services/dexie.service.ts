import { Injectable } from '@angular/core';
import Dexie from 'dexie'; // wrapper for IndexedDB
import { OfflineService } from '../services/offline.service';
import { InternalHttpService } from '../../shared/services/internal-http.service';
import { URLConstants } from '../../shared/URLConstants';


@Injectable({
  providedIn: 'root'
})
export class DexieService {

  private db: any;
  private donedb: any;

  constructor(
    private _offlineService: OfflineService,
    private _httpClient: InternalHttpService,
  ) {

  }


  get addDbInstance() {
    return this.db;
  }


  get deleteDbInstance() {
    return this.donedb;
  }


  load(){
    this.createIndexedDatabase();
    this.registerToEvents();
    this.listenToEvents();
  }



  private createIndexedDatabase() {
    //create the indexedDB to store offline data(to be added)
    this.db = new Dexie("AddDatabase");
    this.db.version(1).stores({
      indexdb_todos: "title,content"
    });
    this.db.open().catch(function (err) {
      console.error(err.stack || err);
    });

    //create the indexedDB to store offline data(to be deleted)
    this.donedb = new Dexie("DeleteDatabase");
    this.donedb.version(1).stores({
      indexdb_todos: "_id"
    });
    this.donedb.open().catch(function (err) {
      console.error(err.stack || err);
    });

  }



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
    const allItems: any[] = await this.addDbInstance.indexdb_todos.toArray();

    //bulk update to mongodb
    this.bulkTodo(allItems).then(
      (res: any) => {
        this.addDbInstance.indexdb_todos.clear();
      },
      (err: Object) => {
        console.log('err : ', err);
      })
      .catch((err: Object) => {
      });
  }



  //send the todos to the backend to be deleted in mongodb
  public async sendItemsToDelete() {
    console.log("sending items for bulk delete");
    const allItems: any[] = await this.deleteDbInstance.indexdb_todos.toArray();

    this.bulkDelete(allItems).then(
      (res: any) => {
        this.deleteDbInstance.indexdb_todos.clear();
      },
      (err: Object) => {
        console.log('err : ', err);
      })
      .catch((err: Object) => {
      });

  }


  // Send items to backend for addition once application comes online again
  public bulkTodo(todos: any) {
    let data = JSON.stringify(todos);
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
    let data = JSON.stringify(todos);
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
