import { NgModule } from '@angular/core';
import {Routes, RouterModule} from "@angular/router";

const routes: Routes = [
  // { 
  //   path: '', 
  //   loadChildren: './main/main.module#MainModule' 
  // },
  { 
    path: 'main', 
    loadChildren: './main/main.module#MainModule' 
  },
  {
    path: 'formTable',
    // loadChildren: () => import('./form-table/form-table.module').then(m => m.FormTableModule)
    loadChildren: './form-table/form-table.module#FormTableModule'
  },
  {
    path: 'matTable',
    loadChildren: './mat-des-table/mat-des-table.module#MatDesTableModule'
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
