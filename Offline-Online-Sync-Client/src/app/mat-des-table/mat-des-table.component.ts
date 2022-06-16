import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OfflineService } from '..//shared/services/offline.service';
import { DexieService } from '../shared/services/dexie.service';
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


  constructor(
    private _matDesTableService: MatDesTableService,
    private readonly offlineService: OfflineService,
    private _cdr: ChangeDetectorRef,
    private _dexieService: DexieService
  ) { }

  ngOnInit(): void {
    var isOnline = this.offlineService.isOnline;

    if (isOnline) {
      let data = {};
      this._matDesTableService.getDetails(data).then(
        (res: any) => {
          console.log('res :: ', res);
          this.fillTable(res);
          this.addTableToIndexDB(res);
        },
        (err: Object) => {
          console.log('err : ', err);
        })
        .catch((err: Object) => {
        });
    } else {
     //   this.getAllCustomerData();
    }
  }

  ngAfterViewInit() {
    this.displayedColumns = ['API', 'Description', 'Link', 'Category'];
  }


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



  //Dynamically adding table to index db
  public addTableToIndexDB(response) {
    let tableName = "matDesc";
    let tableSchema = "++_id, value"

    this._dexieService.updateSchema(tableName, tableSchema).then(
      (res: any) => {
        //fill data in indexdb 
        this.addToIndexDB(response, tableName);
      },
      (err: Object) => {
        console.log('err when table is not added to DB: ', err);
      })
      .catch((err: Object) => {
      });

  }



  //Adding data to index db
  private async addToIndexDB(data: any, tableName) {
    console.log(" this._dexieService :: ", this._dexieService);
    let testData = { k: "v" };
    this._dexieService.dbInstance[tableName].add(testData)
      .then(async () => {
        const allItems: any[] = await this._dexieService.dbInstance["matDesc"].toArray();
        console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error when adding to index db: ' + (e.stack || e));
      });
  }




}
