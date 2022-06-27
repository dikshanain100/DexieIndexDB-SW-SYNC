import {Injectable} from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(
    private _httpClient: InternalHttpService,
  ) {
    this.getLogin();
  }


  getLogin() {
    let data ={};
    return new Promise((resolve, reject) => {
      this._httpClient.callLogin(data, URLConstants.loginAPI, 'GET').subscribe(
        res => {
          console.log('inside getLogin fun :: ', res['loggedIn']);
          sessionStorage.setItem('loggedIn', res['loggedIn']);
          resolve(res)
        },
        err => {
          alert('Oops, something went wrong getting the logged in status '+ err);
          reject(err)
        }
      );
    });
  }



}


//Note: Don't use 'loggedIn' as observable(as given in https://github.com/bersling/express-session-angular-ngx).
//Instead store it sessionStorage/localStorage..else either put a delay 
//OR follow https://github.com/auth0-samples/auth0-angular-samples/issues/181