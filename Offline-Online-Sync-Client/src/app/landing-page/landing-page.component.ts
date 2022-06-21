import { Component, OnInit } from '@angular/core';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private _landingPageService: LandingPageService,
  ) { }

  ngOnInit(): void {
    console.log('hhh')
  }



  
  logout() {
    let data = {};
    this._landingPageService.logout(data).then(
      (res: any) => {
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        //   this.router.navigate(["/main"]));
    
      },
      (err: Object) => {
        console.log('err from backend service: ', err);
      })
      .catch((err: Object) => {
      });
  }


}
