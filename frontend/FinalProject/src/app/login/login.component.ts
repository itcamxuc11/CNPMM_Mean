import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_service/login.service';
import { AuthHttp } from 'angular2-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: AuthHttp, private userService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  fbLogin() {
    this.userService.signInWithFB().then((res) => {
      console.log(res);
    });  }

  googleLogin(){
    this.userService.signInWithGoogle().then((res) => {
      console.log(res);
    });
  }
  
  login(usernameEl, passwordEl){
    var username = usernameEl.value;
    var password = passwordEl.value;
    this.http.post("http://localhost:8080/auth/local",{username:username, password:password}).toPromise()
    .then(response=>{
      if (response.status == 200) {
        var user = response.json();
        console.log(user);
        localStorage.setItem('name',user.name);
        localStorage.setItem('id',user.id);
        localStorage.setItem('id_token',user.token);
        localStorage.setItem('role',user.role);
        if (user.role == 1) this.router.navigateByUrl('/profile');
        else this.router.navigateByUrl('/admin/classroom');
      }
    })
  }
}
