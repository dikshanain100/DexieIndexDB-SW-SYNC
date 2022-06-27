import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { AccountBalanceService } from './account-balance.service';
import { LoginService } from './login.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    AuthService,
    LoginService,
    AccountBalanceService
  ],
})
export class LoginModule { }
