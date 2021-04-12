import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  Login = new FormGroup({
    Email: new FormControl(''),
    Password: new FormControl(''),

  });


  constructor(private router:Router,private authservice:AuthService) { }

  ngOnInit(): void {
  }

  google_signin(){
    this.authservice.googleSignin()
  }

  login_submit(){
    this.authservice.login(this.Login.value);
    // this.router.navigate(['Home']);
    // console.log('login',this.Login)
  }
}
