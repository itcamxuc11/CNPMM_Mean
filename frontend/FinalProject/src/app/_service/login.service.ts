import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';

declare const FB: any;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(private router: Router, private http: AuthHttp, private authService: AuthService) {
  }


  signInWithGoogle() {
    return new Promise((resolve, reject) => {
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialUser => {
        if (socialUser) {
          return this.http.post(`http://localhost:8080/auth/google`, { access_token: socialUser.authToken })
            .toPromise()
            .then(response => {
              if (response.status == 200) {
                var user = response.json();
                localStorage.setItem('name', user.name);
                localStorage.setItem('id', user.id);
                localStorage.setItem('id_token', user.token);
                localStorage.setItem('role', user.role);
                if (user.role == 1) this.router.navigateByUrl('/profile');
                else this.router.navigateByUrl('/admin/classroom');
              }
            })
            .catch(() => reject());

        } else {
          reject();
        }
      })
    })
  }

  signInWithFB() {
    return new Promise((resolve, reject) => {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(socialUser => {
        if (socialUser) {
          return this.http.post(`http://localhost:8080/auth/facebook`, { access_token: socialUser.authToken })
            .toPromise()
            .then(response => {
              if (response.status == 200) {
                var user = response.json();
                localStorage.setItem('name', user.name);
                localStorage.setItem('id', user.id);
                localStorage.setItem('id_token', user.token);
                localStorage.setItem('role', user.role);
                if (user.role == 1) this.router.navigateByUrl('/profile');
                else this.router.navigateByUrl('/admin/classroom');
              }
            })
            .catch(() => reject());
        } else {
          reject();
        }
      })
    })
  }

  logout() {
    localStorage.removeItem('id_token');
    this.router.navigateByUrl('/login');
  }

  isLoggedIn() {
    var token = localStorage.getItem("id_token");
    if (token) return true;
    return false;
  }

}
