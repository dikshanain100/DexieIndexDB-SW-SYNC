import { Injectable } from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  constructor(  
    private _httpClient: InternalHttpService
    ) { }


  //post login data to service 
   logout(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.call(data, URLConstants.logoutAPI, 'POST').subscribe(
        res => {
          resolve(res)
        },
        err => reject(err)
      );
    });
  }

}
