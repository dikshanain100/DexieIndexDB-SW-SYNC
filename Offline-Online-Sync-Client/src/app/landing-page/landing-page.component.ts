import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private _landingPageService: LandingPageService,
    private _router : Router
  ) { }

  ngOnInit(): void {
   // this.checkSessionValidity();
  }


  checkSessionValidity(){
    let data = {};
    this._landingPageService.sessionValidity(data).then(
      (res: any) => {
        console.log('res : ', res)
    
      },
      (err: Object) => {
        console.log('err from backend service: ', err);
      })
      .catch((err: Object) => {
      });
  }

  
  logout() {
    let data = {};
    this._landingPageService.logout(data).then(
      (res: any) => {
        console.log('logout comp resp ::: ', res);
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>

      


           this._router.navigate(["/login"]);
    
      },
      (err: Object) => {
        console.log('err from backend service: ', err);
      })
      .catch((err: Object) => {
      });
  }





}
