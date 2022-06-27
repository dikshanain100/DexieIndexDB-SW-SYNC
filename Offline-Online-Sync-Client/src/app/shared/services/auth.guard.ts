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

  constructor() {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
      return  JSON.parse(sessionStorage.getItem('loggedIn'));

  }

  
}


