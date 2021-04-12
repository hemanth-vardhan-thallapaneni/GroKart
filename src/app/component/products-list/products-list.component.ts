import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { count, map, startWith } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import * as _ from 'lodash';
import ColorThief from "colorthief";
import { animate, animation, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
// const ColorThief = require('colorthief');
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  animations:[
    // Trigger animation cards array
    trigger('cardAnimation', [
      // Transition from any state to any state
      transition('* => *', [
        // Initially the all cards are not visible
        query(':enter', style({ opacity: 0 }), { optional: true }),

        // Each card will appear sequentially with the delay of 300ms
        query(':enter', stagger('300ms', [
          animate('.3s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-10%)', offset: 0 }),
            // style({ opacity: .5, transform: 'translateY(-20px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))]), { optional: true }),

        // Cards will disappear sequentially with the delay of 300ms
        // query(':leave', animation('300ms', [
        //   animate('900ms ease-out', keyframes([
        //     style({ opacity: 1, }),
        //     // style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
        //     style({ opacity: 0, }),
        //   ]))]), { optional: true })
      ]),
    ]),

]
})

export class ProductsListComponent implements OnInit {

  myControl = new FormControl();
  items: string[] = [];
  filteredOptions: Observable<any[]>;

  products_list: any[] = []
  top_recommendations = [];
  add_initial = true;
  cart_items = [];
  category: string = 'Both'
  fruits: string[] = [];
  vegetables: string[] = [];
  both: string[] = [];
  show_all = [];
  data;
  search_pro = false;
  search = [];
  constructor(private dataservice: DataService,private authservice:AuthService) {
    this.authservice.user$.subscribe(res => {
        if(res.uid){
          this.authservice.cart_db$.subscribe(res=>{
                      this.dataservice.cart_items.next(res['cart_items'])
              }) 
        }
    })
   }

  ngOnInit(): void {
    if(!this.search.length){
        this.search_pro = false;
    }
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.show_all.slice())
    );
    


    let response;
    this.dataservice.getProductsData().subscribe(res => {

      response = res;

    })
    setTimeout(() => {
      this.data = response;
      this.fruits = response['products']['fruits']
      this.vegetables = response['products']['vegetables']
      this.top_recommendations = response['top_recommendations']
      this.items = [..._.map(this.top_recommendations, 'name'), ..._.map(this.fruits, 'name'), ..._.map(this.vegetables, 'name')]
   
      this.getPalette(this.fruits)
      this.getPalette(this.vegetables)
      this.getPalette(this.top_recommendations)
      this.select_category(this.category)
    }, 1000);

  }
  search_item(search) {
  
    if(search.value.name){
      this.search = [];
      this.search_pro =true
      let item_name = search.value.name;
      let item = {}
      console.log(this.show_all)
       item = _.find(this.show_all, function(o) { return o.name == item_name });
       
       this.search.push(item)
    }
  
  }
  empty_check(event){
   
    if(!event.target.value){
      
        this.search_pro = false;
    }

  }
  select_category(category) {
    if (category == 'Fruits') {
      this.show_all = this.data['products']['fruits']
      this.items = [..._.map(this.fruits, 'name')]
    }
    else if (category == 'Vegetables') {
      this.show_all = this.data['products']['vegetables']
      this.items = [..._.map(this.vegetables, 'name')]
    }
    else {

      let fruits = this.data['products']['fruits']
      let vegetables = this.data['products']['vegetables']
      this.show_all = [...fruits, ...vegetables]
    }
  }
  displayFn(user): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string){
    const filterValue = name.toLowerCase();

    return this.show_all.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  getPalette = (url) => {
    let imgs = [..._.map(url, 'img_src')]
    let length = url.length
    for (let i = 0; i <= length; i++) {
      new Promise((resolve, reject) => {
        if (!url) {
          reject();
        }
        let image = new Image();
        image.src = imgs[i];
        image.crossOrigin = 'Anonymous';

        image.onload = function () {
          const colorThief = new ColorThief();
          const color = colorThief.getColor(this, 10);
          let bgcolor = `rgb(${color},0.6)`
          url[i].color = bgcolor;
          const result = _.uniq(color, item => JSON.stringify(item));

          resolve(result);
        }


      });
    }

  }

  add_init(product) {
 
    this.dataservice.add_init_data(product)
    // product.IsHidden = !product.IsHidden;
    this.add_initial = false;

  }
  add_remove_item(product, action) {
   this.dataservice.add_remove_data(product,action);
   
  }


}
