import { Injectable } from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service' ;
import { URLConstants } from '../shared/URLConstants';

@Injectable({
  providedIn: 'root'
})
export class MatDesTableService {
  APIEndpoint: string = '';

  constructor(private _httpClient: InternalHttpService) { }
  
    getDetails(data){
      return new Promise((resolve, reject) => {
        this._httpClient.call(data, URLConstants.publicEnteriesAPI, 'GET').subscribe(
          res => resolve(res['data']),
          err => reject(err)
        );
      });
  
    }

}
