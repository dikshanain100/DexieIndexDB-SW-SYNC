import { Injectable } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { LoginService } from '../login/login.service';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  constructor(  
    private _httpClient: InternalHttpService,
    private _authService: AuthService,
    ) { }


  //post login data to service 
   logout(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.callLogout(data, URLConstants.logoutAPI, 'POST').subscribe(
        res => {
       //   this._authService.loggedIn.next(false);
          sessionStorage.setItem('loggedIn', 'false');

          resolve(res)
        },
        err => reject(err)
      );
    });
  }



}
