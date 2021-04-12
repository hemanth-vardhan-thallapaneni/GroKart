import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authservice:AuthService) { }
  Register = new FormGroup({
    Name: new FormControl(''),
    Email:new FormControl(''),
    Password: new FormControl(''),
  })

  ngOnInit(): void {
  }

  register_submit(){
        this.authservice.register(this.Register.value)
  }

  googe_signin(){
    this.authservice.googleSignin()
  }
}
