import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: string;

  
  constructor(
    private http: HttpClient,
  ) {
    this.getLogin();
  }


//to implement internal http 
  getLogin() {
    this.http.get(environment.api_url + 'login', {
      withCredentials: true // <=========== important!
    }).subscribe((resp: any) => {
      sessionStorage.setItem('loggedIn', resp.loggedIn);
    }, (errorResp) => {
    alert('Oops, something went wrong getting the logged in status '+ errorResp);
    })
  }

}


//Note: Don't use 'loggedIn' as observable(as given in https://github.com/bersling/express-session-angular-ngx).
//Instead store it sessionStorage/localStorage..else either put a delay 
//OR follow https://github.com/auth0-samples/auth0-angular-samples/issues/181