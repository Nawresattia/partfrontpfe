import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LoadserviceService } from 'src/Services/loadservice.service';


export interface PeriodicElement {
  Id: number;
  nomchauffeur: String;
  prenomchauffeur: String;
  site:String;
  cin: String;
  tel:string;
  createdat:string;
  
}
@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.scss']
})
export class ChauffeurComponent implements OnInit,AfterViewInit {

  dymdm = new Date();
  All = [this.dymdm.getFullYear(), this.dymdm.getMonth() + 1, this.dymdm.getDate()].join('/');
  date = [this.All, this.dymdm.getHours(), this.dymdm.getMinutes()].join('-');

  displayedColumns: string[] = ['Id', 'nomchauffeur','prenomchauffeur', 'site','cin','tel','createdat',"actions"];
   dataSource; 

 

   
  constructor(public load:LoadserviceService, public dialog: MatDialog) { }
 
  ngOnInit(): void {
    this.getAll();
  }
  ngAfterViewInit(): void {
  }

  
  getAll(){
    this.load.get("AllChauffeur").then(
      (data:any) => {        
        //this.ELEMENT_DATA=data;
        console.log(data);
        this.dataSource = new MatTableDataSource<PeriodicElement>(data);
      }
  );}
    
  create(){
    this.dialog.open(CreateChauffeurDialog, {
      height: '95',
      width: '95',
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  delet(id) {
    console.log(id)
    if (confirm("Sure You want to delete this chauffeur!") == true) {
      this.load.post({ "chauffeurId": id }, "DeleteChauffeur").then(
        (data: any) => {
          console.log(data);
          if (data.key == "true") {
            this.load.openSnackBar("Delete Done");
            this.getAll()
          }
          else this.load.openSnackBar("Error")

        });
    } else { }

  }
  edit(id) {
    console.log(id)
    this.dialog.open(EditChauffeurDialog, {
      height: '95',
      width: '95',
      data: id,
    });

  }

}


@Component({
  selector: 'dialog-update-chauffeur',
  templateUrl: './edit-pop.html',
})

export class EditChauffeurDialog {
  nomchauffeur: any;
  prenomchauffeur: any;
  site:any;
  cin: any;
  tel: any;
  createdat:any;

 
  constructor(public dialogRef: MatDialogRef<EditChauffeurDialog>,
    @Inject(MAT_DIALOG_DATA) public data, public load: LoadserviceService) { }
  close() {
    this.dialogRef.close();
  }

   update() {
    console.log(this.data)
    let senddata =
    {
 
      "chauffeurId": this.data,
      "nomchauffeur": this.nomchauffeur,
      "prenomchauffeur": this.prenomchauffeur,
      "site": this.site,
      "cin": this.cin,
       "createdat":this.createdat,
      
    };
    if(this.data==null && this.nomchauffeur=="" && this.prenomchauffeur=="" && this.site=="" && this.cin=="" && this.createdat=="" )
    {this.load.openSnackBar("Please Update at least one input");}
   else {
    this.load.post(senddata, "UpdateUser").then(
      (data: any) => {
        console.log(data);
        if (data.key == "true") { this.load.openSnackBar("Updated Done"); }
        else this.load.openSnackBar("Error");

      });
   }
  }
}



@Component({
  selector: 'dialog-create-chauffeur',
  templateUrl: 'create-pop.html',
})
export class CreateChauffeurDialog {
  nomchauffeur: any="";
  prenomchauffeur: any="";
  site:any="";
  cin: any="";
  tel: any="";
  createdat:any="";

  constructor(public dialogRef: MatDialogRef<CreateChauffeurDialog>,
    
  public load: LoadserviceService) { }
  close() {
    this.dialogRef.close();
  }
  create(){
    let senddata =
    {
       "nomchauffeur": this.nomchauffeur,
      "prenomchauffeur": this.prenomchauffeur,
      "site": this.site,
      "cin": this.cin,
       "createdat":this.createdat,
      
    };
    if(this.nomchauffeur=="" || this.prenomchauffeur=="" || this.site=="" || this.cin=="" || this.createdat=="")
    {this.load.openSnackBar("Please Fill in all inputs");}
   else {
    this.load.post(senddata, "CreateChauffeur").then(
      (data: any) => {
        console.log(data);
        if (data.key == "true") { this.load.openSnackBar("Create Done"); }
        else this.load.openSnackBar("Error");

      });
   }
  }
}



