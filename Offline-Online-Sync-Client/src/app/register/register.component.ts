import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  customerForm: FormGroup;
  submitted: boolean = false;



  constructor(
    private _registerService: RegisterService,
    public formBuilder: FormBuilder,
    private _router: Router
  ) { }
  ngOnInit(): void {
    this.createForm();
  }


  
  public createForm() {
    this.customerForm = this.formBuilder.group({
      customer_username: ['', Validators.required],
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
      custUsername: '',
      custEmail: '',
      custPassword : ''
    };

    if (
      this.customerForm.controls.customer_username.valid &&
      this.customerForm.controls.customer_email.valid && 
      this.customerForm.controls.customer_password.valid
    ) {
      console.log('form valid ', this.customerForm);
      reqObj.custUsername = this.customerForm.controls.customer_username.value;
      reqObj.custEmail = this.customerForm.controls.customer_email.value;
      reqObj.custPassword = this.customerForm.controls.customer_password.value;

     this.postRegister(reqObj);
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


  postRegister(formData) {
    this._registerService.postRegister(formData).then(
      (res: any) => {
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        //   this.router.navigate(["/main"]));
        this.customerForm.reset();
      },
      (err: Object) => {
        console.log('err from backend service: ', err);
      })
      .catch((err: Object) => {
      });
  }


  login(){
    this._router.navigateByUrl('/login')
  }



}
