import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: Subject<boolean>;
  testValue = 'diksha';

  
  constructor(
    private http: HttpClient,
    // private toastr: ToastrService
  ) {
    this.loggedIn = new Subject();
    console.log('this.loggedIn ::  inside auth service const  :: ', this.loggedIn);
    this.getLogin();
  }


//  doLogin(email: string, password: string) {
//     this.http.post(environment.api_url + 'login', {
//       email: email,
//       password: password
//     }, {
//       withCredentials: true
//     }).subscribe((resp: any) => {
//       console.log('res after log in :: ', resp)
//       this.loggedIn.next(true);
//       this.toastr.success(resp && resp.user && resp.user.name ? `Welcome ${resp.user.name}` : 'Logged in!');
//     }, (errorResp) => {
//       this.loggedIn.next(false);
//       errorResp.error ? this.toastr.error(errorResp.error.errorMessage) : this.toastr.error('An unknown error has occured.');
//     });
//   }

  getLogin() {
    this.http.get(environment.api_url + 'login', {
      withCredentials: true // <=========== important!
    }).subscribe((resp: any) => {
      console.log('inside getLogin :: ',resp)
      this.loggedIn.next(resp.loggedIn);
    }, (errorResp) => {
     // this.toastr.error('Oops, something went wrong getting the logged in status')
    })
  }

  // logout() {
  //   this.http.post(environment.api_url + 'logout', {}, {
  //     withCredentials: true
  //   }).subscribe(() => {
  //     this.loggedIn.next(false);
  //   });
  // }



}
