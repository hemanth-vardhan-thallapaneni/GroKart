import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
import { DataService } from '../../services/data.service';
import * as _ from 'lodash';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  counts = 0;
  isLoggedIn:boolean = false;
  user:string;
  constructor(public dialog: MatDialog, private dataservice: DataService,private authservice:AuthService) {
    this.authservice.isLoggedIn.subscribe(res=>{
      console.log('res',res)
      setTimeout(() => {
         this.isLoggedIn = res
         this.user = JSON.parse(localStorage.getItem('user'));
      }, 1000);
    })
 
  }

  ngOnInit(): void {
   
    let response;
    let email;
  
     
    this.dataservice.cart_items.subscribe(res => {
      response = res;
      let count = 0;
      this.counts = 0;

      _.forEach(res, function (value, key) {
        console.log('va', value['count'])
        let c = value['count']
        count += c

      })

      this.counts = count;

    });

  }
  click_cart() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minHeight = "100vh"
    dialogConfig.minWidth = "400px"
    dialogConfig.position = {
      top: '0',
      right: '0'
    };
    const dialogRef = this.dialog.open(CartComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

logout(){
  this.authservice.logout()
}

}
