import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  fbLogin() {
    this.userService.signInWithFB().then(() => {
    });  }

  googleLogin(){
    this.userService.signInWithGoogle().then(() => {

    });
  }
}
