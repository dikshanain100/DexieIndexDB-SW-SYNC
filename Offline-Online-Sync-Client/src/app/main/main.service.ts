import { Injectable } from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';
import { OfflineService } from '../shared/services/offline.service';
import Dexie from 'dexie'; // wrapper for IndexedDB

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private _httpClient: InternalHttpService, private readonly offlineService: OfflineService) {
    this.createIndexedDatabase();
    this.createDoneTodosDatabase();
    this.registerToEvents(offlineService);
    this.listenToEvents(offlineService);
  }




  //////////////////////////////////////////////// GENERAL CODE + ONLINE ///////////////////////////////////////////////////////////////


  //add the todos >> Online + Offline
  addTodo(todo: Object) {
    // save into the indexedDB if the connection is lost
    if (!this.offlineService.isOnline) {
      this.addToIndexedDb(todo);
    } else {
      //post request to mongodb
      let data = {
        title: todo["title"],
        content: todo["content"],
      }

      return new Promise((resolve, reject) => {
        this._httpClient.call(data, URLConstants.todosAPI, 'POST').subscribe(
          res => {
            resolve(res)
          },
          err => reject(err)
        );
      });

    }
  }



  // delete the todos >> Online + Offline
  deleteTodo(todoId: string) {
    let todo = {
      _id: todoId
    }

    if (!this.offlineService.isOnline) {
      this.addToDeleteDatabase(todo);

    } else {
      return new Promise((resolve, reject) => {
        this._httpClient.call(todo, URLConstants.todoAPI + '/' + todo["_id"], 'DELETE').subscribe(
          res => {
            resolve(res)
          },
          err => reject(err)
        );
      });

    }
  }


  //get all todos from the mongodb
  getAllTodos(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.call(data, URLConstants.todosAPI, 'GET').subscribe(
        res => {
          resolve(res)
        },
        err => reject(err)
      );
    });
  }


  ////////////////////////////////////////////////   OFFLINE   //////////////////////////////////////////////////////////////////

  //add todo to the indexedDB on offline mode
  private async addToIndexedDb(todo: any) {
    this.db.indexdb_todos.add(todo)
      .then(async () => {
        const allItems: any[] = await this.db["indexdb_todos"].toArray();
        console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }



  //add to delete database if offline
  private async addToDeleteDatabase(todo: any) {
    this.donedb.indexdb_todos.add(todo)
      .then(async () => {
        const allItems: any[] = await this.donedb["indexdb_todos"].toArray();
        console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }


  /////////////////////////////////////////////////////// INDEX DB ////////////////////////////////////////////////////////////////////////
  private db: any;
  private donedb: any;

  //create the indexedDB to store offline data(to be added)
  private createIndexedDatabase() {
    this.db = new Dexie("AddDatabase");
    this.db.version(1).stores({
      indexdb_todos: "title,content"
    });
    this.db.open().catch(function (err) {
      console.error(err.stack || err);
    });
  }



  //create the indexedDB to store offline data(to be deleted)
  private createDoneTodosDatabase() {
    this.donedb = new Dexie("DeleteDatabase");
    this.donedb.version(1).stores({
      indexdb_todos: "_id"
    });
    this.donedb.open().catch(function (err) {
      console.error(err.stack || err);
    });
  }


  private registerToEvents(offlineService: OfflineService) {
    offlineService.connectionChanged.subscribe(online => {
      console.log(online);
      if (online) {
        console.log('went online');
        console.log('sending all stored items');

        //pass the items to the backend if the connetion is enabled
        this.sendItemsFromIndexedDb();
      } else {
        console.log('went offline, storing in indexdb');
      }
    });
  }



  private listenToEvents(offlineService: OfflineService) {
    offlineService.connectionChanged.subscribe(online => {
      console.log(online);
      if (online) {
        console.log('went online');
        console.log('sending all stored item ids');
        //send _ids for bulk delete
        this.sendItemsToDelete();
      } else {
        console.log('went offline, storing ids to delete later, in indexdb');
      }
    });

  }

  //send the todos to the backend to be added inside the mongodb
  private async sendItemsFromIndexedDb() {
    const allItems: any[] = await this.db.indexdb_todos.toArray();

    //bulk update to mongodb
    this.bulkTodo(allItems).then(
      (res: any) => {
        this.db.indexdb_todos.clear();
      },
      (err: Object) => {
        console.log('err : ', err);
      })
      .catch((err: Object) => {
      });
  }



  //send the todos to the backend to be deleted in mongodb
  private async sendItemsToDelete() {
    console.log("sending items for bulk delete");
    const allItems: any[] = await this.donedb.indexdb_todos.toArray();

    this.bulkDelete(allItems).then(
      (res: any) => {
        this.donedb.indexdb_todos.clear();
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
