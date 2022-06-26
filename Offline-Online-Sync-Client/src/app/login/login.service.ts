import { Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //public loggedIn: Subject<boolean>;


  constructor(
    private _httpClient: InternalHttpService,
    private _authService : AuthService,
   // private toastr: ToastrService,
    private http: HttpClient
  ) { 
  //  this.loggedIn = new Subject();
   // this.getLogin();
  }


   //post login data to service 
   postLogin(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.callLogin(data, URLConstants.loginAPI, 'POST').subscribe(
        res => {
          console.log('res inside login service :: ', res)
          this._authService.loggedIn.next(true);
     // this.toastr.success(res && res.user && res.user.name ? `Welcome ${res.user.name}` : 'Logged in!');
          resolve(res)
        },
        err => 
        {
          this._authService.loggedIn.next(false);
         // err.error ? this.toastr.error(err.error.errorMessage) : this.toastr.error('An unknown error has occured.');
          reject(err)
        }
       
      );
    });
  }


  //testing 
  //withCredentials indicates whether or not cross-site Access-Control 
  //requests should be made using credentials
  doLogin(email: string, password: string) {
    this.http.post(environment.api_url + 'login', {
      email: email,
      password: password
    }, {
      withCredentials: true
    }).subscribe((resp: any) => {
      console.log('res after log in :: ', resp)
      this._authService.loggedIn.next(true);
      alert('Welcome !!')
     // this.toastr.success(resp && resp.user && resp.user.name ? `Welcome ${resp.user.name}` : 'Logged in!');
    }, (errorResp) => {
      this._authService.loggedIn.next(false);
      alert(errorResp)
     // errorResp.error ? this.toastr.error(errorResp.error.errorMessage) : this.toastr.error('An unknown error has occured.');
    });
  }

  getLogin() {
    this.http.get(environment.api_url + 'login', {
      withCredentials: true // <=========== important!
    }).subscribe((resp: any) => {
      console.log('inside getLogin :: ',resp)
      this._authService.loggedIn.next(resp.loggedIn);
    }, (errorResp) => {
      alert('Oops, something went wrong getting the logged in status : '+ errorResp);
      //this.toastr.error('Oops, something went wrong getting the logged in status')
    })
  }

  logout() {
    this.http.post(environment.api_url + 'logout', {}, {
      withCredentials: true
    }).subscribe(() => {
      this._authService.loggedIn.next(false);
    });
  }



  //testing
  
}
