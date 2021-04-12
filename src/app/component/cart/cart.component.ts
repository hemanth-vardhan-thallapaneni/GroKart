import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import {DataService } from '../../services/data.service';
import * as _ from 'lodash';
import { MatDialogRef } from '@angular/material/dialog';
import lax from 'lax.js';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations:[
      // Trigger animation cards array
      trigger('cardAnimation', [
        // Transition from any state to any state
        transition('* => *', [
          // Initially the all cards are not visible
          query(':enter', style({ opacity: 0 }), { optional: true }),
  
          // Each card will appear sequentially with the delay of 300ms
          query(':enter', stagger('300ms', [
            animate('.5s ease-in', keyframes([
              style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
              style({ opacity: .5, transform: 'translateY(-20px) scale(1.1)', offset: 0.3 }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
            ]))]), { optional: true }),
  
          // Cards will disappear sequentially with the delay of 300ms
          query(':leave', stagger('300ms', [
            animate('500ms ease-out', keyframes([
              style({ opacity: 1, transform: 'scale(1.1)', offset: 0 }),
              style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
              style({ opacity: 0, transform: 'scale(0)', offset: 1 }),
            ]))]), { optional: true })
        ]),
      ]),
  
  ]
})
export class CartComponent implements OnInit, AfterViewInit {

  constructor( private dataservice:DataService,public dialogRef: MatDialogRef<CartComponent>,) {
  
   }
  show_product:boolean = true;
  products = []
  total_price;
  ngOnInit(): void {
    let response 
    this.dataservice.cart_items.subscribe(res=>{
      let length = res.length
      if(length > 0){
        this.show_product= false;
        response = res
      }
      else{
        this.show_product = true
      }
     
    })
    setTimeout(() => {
      if(response){
        
        this.show_product = false
        this.products = [...response]
      }
      else{
       
      }
      this.calculate_total(this.products)
       
    }, 500);

    
  } 
  ngAfterViewInit(){
        lax.setup()
        lax.addDriver('scrollY',()=>{
          return window.scrollY
        });
        // lax.addElements()
  }
  close(){
    this.dialogRef.close();
  }
  add_init(product){
    this.dataservice.add_init_data(product)
    this.calculate_total(this.products)
  }
  add_remove_item(product,action){
      this.dataservice.add_remove_data(product,action)
      this.calculate_total(this.products)
      console.log('dataa',this.dataservice)
  }
  calculate_total(products){
    let each_price = [];
    let total = 0;
    console.log('prrr',products)
   _.forEach(products,(value,key)=>{
    let price =  value['price'] * value['count']
     each_price.push(price)  
      
   })
   for(let i = 0;i < each_price.length; i++){
     total += each_price[i];
   }
    this.total_price = total;
  }
 


}
