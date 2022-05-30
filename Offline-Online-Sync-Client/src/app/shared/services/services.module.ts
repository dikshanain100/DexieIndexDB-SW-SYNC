import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InternalHttpService} from './internal-http.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[InternalHttpService]
})

export class ServicesModule { }
