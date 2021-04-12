import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {
  
  usersRef: AngularFireList<any>;      // Reference to users list, Its an Observable
  userRef: AngularFireObject<any>;     // Reference to user object, Its an Observable too
  cart_products = [];
  cart_items = new BehaviorSubject<any[]>([]);

  userId:string;
  constructor(private router: Router,private http:HttpClient,private firestore: AngularFirestore,private afAuth:AngularFireAuth) { 
    
  }
  ngOnInit(){
        
  }
  getProductsData(){
    return this.http.get('../../assets/JSON/products.json')
  }
  add_init_data(product){
   let id = localStorage.getItem('user_id')
    let pro_count = 1;
    product.count = pro_count;
    this.cart_products.push(product)
    this.cart_items.next(this.cart_products)
         this.firestore.collection('cart').doc<any>(id).set({cart_items:this.cart_products},{merge:true})
      .then(_ =>{
            console.log('inserted')
      })
   
  }

  add_remove_data(product,action){
    let id = localStorage.getItem('user_id')
      let isItem = _.find(this.cart_products, (o) => {
        if (o.name == product.name) {
         
          return true
        }
        else {
        
          return false;
        }
      });
      if (!isItem || product == undefined) {
        
        this.cart_products.push(product);
        this.cart_items.next(this.cart_products)
      }
      else if (isItem) {
        if (action == 'add') {
          product.count += 1;
          // this.cart_products.push(product)
        let index ;
        index = _.findIndex(this.cart_products, {name:product['name']});
        this.cart_products.splice(index, 1, product);  
        }
        else {
          product.count -= 1;
          if (product.count <= 0) {
            _.remove(this.cart_products, function(n) {
              return n['count'] <= 0;
            });
          } 
        }
        this.cart_items.next(this.cart_products)
        this.firestore.collection('cart').doc<any>(id).set({cart_items:this.cart_products,},{ merge: true })
        //   .then(_ =>{
        //         console.log('inserted')
        //   })
        // if(sessionStorage.getItem('current_user')){
        // 
        // }
      }
  
    
  

  
  }
  
}
