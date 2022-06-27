import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountBalanceService } from '../login/account-balance.service';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  accountBalance;


  constructor(
    private _landingPageService: LandingPageService,
    private _router: Router,
    private balanceService: AccountBalanceService,
  ) { 
    this.balanceService.accountBalance.subscribe(balance => {
      this.accountBalance = balance;
    });
  }

  ngOnInit(): void {
  }


  getBalance() {
    this.balanceService.getAccountBalance();
  }



  logout() {
    let data = {};
    this._landingPageService.logout(data).then(
      (res: any) => {
        console.log('logout comp resp ::: ', res);
        sessionStorage.removeItem('loggedIn');
        this._router.navigate(["/login"]);

      },
      (err: Object) => {
        console.log('err from backend service: ', err);
      })
      .catch((err: Object) => {
      });
  }



}
