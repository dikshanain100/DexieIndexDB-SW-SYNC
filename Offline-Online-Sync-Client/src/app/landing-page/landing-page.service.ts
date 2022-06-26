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


    //check session validity
    sessionValidity(data){
      return new Promise((resolve, reject) => {
        this._httpClient.call(data, URLConstants.landingAPI, 'GET').subscribe(
          res => {
            resolve(res)
          },
          err => reject(err)
        );
      });
    }

  //post login data to service 
   logout(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.callLogout(data, URLConstants.logoutAPI, 'POST').subscribe(
        res => {
          this._authService.loggedIn.next(false);

          this._authService.loggedIn.subscribe(loggedIn => {
           console.log(loggedIn);
          });


          resolve(res)
        },
        err => reject(err)
      );
    });
  }

//testing
  // logout() {
  //   this.http.post(environment.api_url + 'logout', {}, {
  //     withCredentials: true
  //   }).subscribe(() => {
  //     this.loggedIn.next(false);
  //   });
  // }

}
