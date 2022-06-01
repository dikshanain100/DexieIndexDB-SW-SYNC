import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InternalHttpService} from './internal-http.service';
import { OfflineService } from './offline.service';
import { DexieService } from './dexie.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    InternalHttpService, 
    OfflineService,
    DexieService
  ]
})

export class ServicesModule { }
