import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';
import { map, filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {

  private loggedIn : boolean;

  constructor(
    private _authService: AuthService,
  ) {
  }
  
  // waitForHandleAuthCallbackToComplete(): Observable<boolean> {
  //   return this._authService.loggedIn.pipe(
  //     filter(complete => complete),
  //     take(1),
  //   );
  // }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
      setTimeout(()=>{
        this._authService.loggedIn.subscribe(loggedIn => {
        
          console.log('login value inside auth guard :: 111::: ', this.loggedIn)
            this.loggedIn = loggedIn;
          });
    
      },5000)
  
     
      return this.loggedIn;

  }




  
  
}
