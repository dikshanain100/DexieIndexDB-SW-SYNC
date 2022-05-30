import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { OfflineService } from './offline.service';
import Dexie from 'dexie'; // wrapper for IndexedDB
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute, Route } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private readonly offlineService: OfflineService, private httpClient: HttpClient, private router: Router) {

    this.createIndexedDatabase();
    this.createDoneTodosDatabase();
    this.registerToEvents(offlineService);
    this.listenToEvents(offlineService);
  }

  //////////////////////////////////////////////// GENERAL CODE + ONLINE ///////////////////////////////////////////////////////////////


  //add the todos >> Online + Offline
  addTodo(todo: Object) {
    //add the "done" property
    todo["done"] = false;

    // save into the indexedDB if the connection is lost
    if (!this.offlineService.isOnline) {
      this.addToIndexedDb(todo);
    } else {
      //post request to mongodb
      this.postTodo(todo).subscribe(res => {
        console.log(res);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/main"]));
      });
    }
  }



  // delete the todos >> Online + Offline
  deleteTodo(todoId: string) {
    let todo = {
      _id: todoId
    }

    if (!this.offlineService.isOnline) {
      console.log(todo);
      this.addToDeleteDatabase(todo);

    } else {
      this.removeTodo(todo).subscribe(res => {
        console.log(res);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/main"]));
      })

    }
  }



  //Http call to add todos values to mongodb >> Online
  public postTodo(itemObj: object) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    let obj = {
      title: itemObj["title"],
      content: itemObj["content"],
      done: false
    }

    //post an item
    return this.httpClient.post("http://localhost:8000/todos", JSON.stringify(obj), { headers: headers });
  }



  //Http call to delete todos values to mongodb >> Online
  removeTodo(todo: any) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient.request("delete",
      "http://localhost:8000/todo/" + todo["_id"],
      {
        headers: headers,
        body: JSON.stringify(todo)

      })
  }


  //get all todos from the mongodb
  getAllTodos() {
    return this.httpClient.get("http://localhost:8000/todos");
  }


  ////////////////////////////////////////////////   OFFLINE   //////////////////////////////////////////////////////////////////

  //add todo to the indexedDB on offline mode
  private async addToIndexedDb(todo: any) {
    this.db.todos.add(todo)
      .then(async () => {
        const allItems: any[] = await this.db["todos"].toArray();
        console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }



  // ---------- add to delete database if offline
  private async addToDeleteDatabase(todo: any) {
    this.donedb.todos.add(todo)
      .then(async () => {
        const allItems: any[] = await this.donedb["todos"].toArray();
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
    this.db = new Dexie("TestDatabase");
    this.db.version(1).stores({
      todos: "title,content,done"
    });
    this.db.open().catch(function (err) {
      console.error(err.stack || err);
    });
  }



  //create the indexedDB to store offline data(to be deleted)
  private createDoneTodosDatabase() {
    this.donedb = new Dexie("DoneTodosDatabase");
    this.donedb.version(1).stores({
      todos: "_id"
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
    console.log("sending items");
    const allItems: any[] = await this.db.todos.toArray();
    //bulk update to mongodb
    this.bulkTodo(allItems).subscribe(res => {
      console.log(res);
      this.db.todos.clear();
    })
  }



  //send the todos to the backend to be deleted in mongodb
  private async sendItemsToDelete() {
    console.log("sending items for bulk delete");
    const allItems: any[] = await this.donedb.todos.toArray();
    this.bulkDelete(allItems).subscribe(res => {
      console.log(res);
      this.donedb.todos.clear();
    });

  }


  // Send items to backend for addition once application comes online again
  public bulkTodo(todos: any) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    //post an item
    return this.httpClient.post("http://localhost:8000/bulk", JSON.stringify(todos), { headers: headers });
  }


  // Since data has been added to mongodb after application came online; same needs to be removed from indexdb
  public bulkDelete(todos: any) {
    console.log("sending for bulk delete", todos);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient.request("delete",
      "http://localhost:8000/bulkDelete/",
      {
        headers: headers,
        body: JSON.stringify(todos)

      })
  }





}




