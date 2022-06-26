import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
// import { AuthService } from './auth.service';
// import { AccountBalanceService } from './account-balance.service';
// import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LoginComponent implements OnInit {

  // // Testinggggggg

  // // email = 'max@gmail.com';
  // // password = '1234';
  // email;
  // password;
  // loggedIn;
  // accountBalance;

  // constructor(private authService: AuthService,
  //   private balanceService: AccountBalanceService,
  //   private _router: Router
  //   ) {
  //   this.authService.loggedIn.subscribe(loggedIn => {
  //     this.loggedIn = loggedIn;
  //   });
  //   this.balanceService.accountBalance.subscribe(balance => {
  //     this.accountBalance = balance;
  //   });
  // }

  //   ngOnInit(): void {

  // }

  // doLogin() {
  //   this.authService.doLogin(this.email, this.password);
  // }

  // doLogout() {
  //   this.authService.logout();
  // }

  // getBalance() {
  //   this.balanceService.getAccountBalance();
  // }




  // //Testingggggggg

  customerForm: FormGroup;
  submitted: boolean = false;
  loggedIn: boolean; //test
  accountBalance; //test



  constructor(
    private _loginService: LoginService,
    public formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    // private toastr: ToastrService,

    //test
   // private balanceService: AccountBalanceService,

  ) {
    //test
    this._authService.loggedIn.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });

   // this.balanceService.accountBalance.subscribe(balance => {
    //  this.accountBalance = balance;
    //});
  }

  ngOnInit(): void {
    this.createForm();
  }



  public createForm() {
    this.customerForm = this.formBuilder.group({
      customer_email: ['', Validators.required],
      customer_password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get fetch() {
    return this.customerForm.controls;
  }

  public submitForm() {
    this.submitted = true;
    var reqObj = {
      email: '',
      password: ''
    };

    if (
      this.customerForm.controls.customer_email.valid &&
      this.customerForm.controls.customer_password.valid
    ) {
      console.log('form valid ', this.customerForm);
      reqObj.email = this.customerForm.controls.customer_email.value;
      reqObj.password = this.customerForm.controls.customer_password.value;

      this.postLogin(reqObj);
     //  this.doLogin( reqObj.email, reqObj.password)

    } else {
      console.log('form invalid');
      console.log('form ', this.customerForm);
    }
    console.log('this.submitted :: ', this.submitted);
    this.submitted = false;
  }

  onCancel() {
    console.log('Form Cancel clicked');
    this.customerForm.reset();
    this.customerForm.markAsPristine;
    this.customerForm.markAsUntouched;

    this.submitted = false;
  }



  postLogin(formData) {
    this._loginService.postLogin(formData).then(
      (res: any) => {
        console.log('res ::', res);
       // this.toastr.success(res && res.user && res.user.name ? `Welcome ${res.user.name}` : 'Logged in!');
        this._router.navigateByUrl('/landing'); //here auth guard will come

        // if (res.error) {
        //   alert(res.message);
        // }
        // else {
        //   if (res.passwordMismatch ==  true) {
        //     console.log('psd mismatch')
        //     alert(res.message)    //not working
        //   }
        //   else if (res.passwordMismatch == false) {
        //     console.log('pwd matched')
        //     this._router.navigateByUrl('/landing');
        //   }
        //   else if (res.passwordMismatch == undefined) {
        //     console.log('remainign')
        //     alert(res.message);
        //     this._router.navigateByUrl('/register');
        //   }

        // }
        this.customerForm.reset();
      },
      (err: Object) => {
        console.log('err from backend service: ', err);
      })
      .catch((err: Object) => {
      });
  }

  //test
  doLogin(email, password) {
    this._loginService.doLogin(email, password);
  }

  doLogout() {
    this._loginService.logout();
  }

  getBalance() {
  //  this.balanceService.getAccountBalance();
  }
  //test



  // load register component
  register() {
    this._router.navigateByUrl('/register');
  }


}
