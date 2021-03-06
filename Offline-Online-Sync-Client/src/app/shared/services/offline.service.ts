import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


declare const window: any; //declare window object

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  private internalConnectionChanged = new Subject<boolean>();

  constructor(
  
  ) {
    //listen for the online/offline events
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }


  //return the connection state
  get connectionChanged() {
    return this.internalConnectionChanged.asObservable();
  }

  // to check network connection
  get isOnline() {
    return !!window.navigator.onLine;
  }

  private updateOnlineStatus() {
    this.internalConnectionChanged.next(window.navigator.onLine);
  }



}
