import { Injectable } from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private _httpClient: InternalHttpService,
  ) { }


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

  
}
