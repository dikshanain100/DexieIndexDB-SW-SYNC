import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OfflineService } from '../offline.service';
import { MatDesTableService } from './mat-des-table.service';

@Component({
  selector: 'app-mat-des-table',
  templateUrl: './mat-des-table.component.html',
  styleUrls: ['./mat-des-table.component.scss']
})
export class MatDesTableComponent implements OnInit {

  displayedColumns = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  storageName = 'publicAPI';
  user1 = 'User1';

  constructor(
    private _matDesTableService: MatDesTableService,
    private readonly offlineService: OfflineService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
     var isOnline = this.offlineService.isOnline;
     console.log('isOnline :: ', isOnline);

    if (isOnline) {
      let data = {};
      this._matDesTableService.getDetails(data).then(
        (res: any) => {
          this.fillTable(res);
        },
        (err: Object) => {
          console.log('err : ', err);
        })
        .catch((err: Object) => {
        });
    } else {
    //  this.getAllCustomerData();
    }
  }

  ngAfterViewInit() {
    this.displayedColumns = ['API', 'Description', 'Link', 'Category'];
  }

  // add data to indexed db
  // public addInIndexDB(user, dataReceived) {
  //   this._local.add(user, dataReceived, this.storageName).then((res) => {
  //     if (res) {
  //       console.log('Record added successfully !!');
  //     } else {
  //       console.log('Could not add record in index db!!');
  //     }
  //   });
  // }

  // add data to table in UI
  public fillTable(dataReceived) {
    this.dataSource = new MatTableDataSource(dataReceived.entries);
    this.dataSource.paginator = this.paginator;
  }

  // get data from indexed db
  // public getAllCustomerData() {
  //   this._local.getAll(this.storageName).then((res) => {
  //     if (res) {
  //       console.log('data received from indexed db ', res);
  //       this.dataSource = new MatTableDataSource(res[0].entries);
  //       this.dataSource.paginator = this.paginator;
  //     } else {
  //       console.log('Could not get record from index db!!');
  //     }
  //   });
  // }

  //load by default records >> multiple records to check performance
  // public loadRecords() {
  //   let data = {};
  //   this._matDesTableService.getDetails(data).then(
  //     (res: any) => {
  //       for (let i = 1; i < 11; i++) {
  //         this._local.add(i, res, this.storageName);
  //       }
  //     },
  //     (err: Object) => {
  //       console.log('err : ', err);
  //     })
  //     .catch((err: Object) => {
  //     });
  // }

}
