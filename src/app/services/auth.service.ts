import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { User } from './user'
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showNavBarEmitter: Observable<boolean> = this.loggedIn.asObservable();
  cart_db$: Observable<any>;
  userId: any;
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  
  ) {}
   async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          let user_data  = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
              return user_data
        } else {
          return of(null);
        }
      })
      
    )   
    this.user$.subscribe(res=>{
      if(res){
        console.log(res.uid)
        localStorage.setItem('user_id',res.uid)
        this.cart_db$ = this.afAuth.authState.pipe(
          switchMap(user => {
            if (user) {
             
              let cart_data =  this.afs.doc<any>(`cart/${res.uid}`).valueChanges();
              if(cart_data){
                return cart_data
              }
                 else{
                   return of(null)
                 }
            } else {
              return of(null);
            }
          })
          
        ) 
        
      }
  
     
    })
 
    localStorage.setItem('user',JSON.stringify(credential.user))
 
    return this.updateUserData(credential.user);
  }
  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data = { 
      uid: user.uid, 
      email: user.email, 
      name: user.displayName, 
    } 
    this.loggedIn.next(true);
    this.router.navigate(['Home']);
    return userRef.set(data, { merge: true })
  }
 
  async login(user) {

    
    if (user.Email !== '' && user.Password !== '' ) {
       await this.afAuth.signInWithEmailAndPassword(user.Email,user.Password)
       .then(res=>{
        this.loggedIn.next(true);
        this.cart_db$ = this.afs.doc<any>(`cart/${this,this.userId}`).valueChanges();
        this.user$ = this.afAuth.authState.pipe(
          switchMap(user => {
            if (user) {
              let user_data  = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                  return user_data
            } else {
              return of(null);
            }
          })
          
        )   
        this.user$.subscribe(res=>{
          if(res){
            console.log(res.uid)
            localStorage.setItem('user_id',res.uid)
            this.cart_db$ = this.afAuth.authState.pipe(
              switchMap(user => {
                if (user) {
                 
                  let cart_data =  this.afs.doc<any>(`cart/${res.uid}`).valueChanges();
                  if(cart_data){
                    return cart_data
                  }
                     else{
                       return of(null)
                     }
                } else {
                  return of(null);
                }
              })
              
            ) 
            
          }
      
         
        })
        this.router.navigate(["Home"]);

        localStorage.setItem('user',JSON.stringify(res.user))
       })
       this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          let user_data  = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
              return user_data
        } else {
          return of(null);
        }
      })
    ) 
      
    }
  }
  async register(user){
    console.log(user)
    await this.afAuth.createUserWithEmailAndPassword(user.Email,user.Password)
    .then(res=>{
      this.loggedIn.next(true);
      this.cart_db$ = this.afs.doc<any>(`cart/${this,this.userId}`).valueChanges();
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            let user_data  = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                return user_data
          } else {
            return of(null);
          }
        })
        
      )   
      this.user$.subscribe(res=>{
        if(res){
          console.log(res.uid)
          localStorage.setItem('user_id',res.uid)
          this.cart_db$ = this.afAuth.authState.pipe(
            switchMap(user => {
              if (user) {
               
                let cart_data =  this.afs.doc<any>(`cart/${res.uid}`).valueChanges();
                if(cart_data){
                  return cart_data
                }
                   else{
                     return of(null)
                   }
              } else {
                return of(null);
              }
            })
            
          ) 
          
        }
    
       
      })
      this.router.navigate(["Home"]);
          localStorage.setItem('user',JSON.stringify(res.user))
    })

    return this.updateUserData(user);
  }

  async logout() {
    await this.afAuth.signOut()
    this.loggedIn.next(false);
   
    localStorage.removeItem('user')
    sessionStorage.removeItem('current_user')
   setTimeout(() => {
    this.router.navigate(['Login']);
   }, 1000);
  

  }
}
