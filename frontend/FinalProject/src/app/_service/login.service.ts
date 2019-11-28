import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

declare const FB: any;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(private http: AuthHttp, private authService: AuthService) {
  }


  signInWithGoogle() {
    return new Promise((resolve, reject) => {
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialUser => {
        if (socialUser) {
          return this.http.post(`http://localhost:8080/auth/google`, { access_token: socialUser.authToken })
            .toPromise()
            .then(response => {
              var token = response.headers.get('x-auth-token');
              if (token) {
                localStorage.setItem('id_token', token);
                console.log(token);
              }
              resolve(response.json());
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
              var token = response.headers.get('x-auth-token');
              if (token) {
                localStorage.setItem('id_token', token);
                console.log(token);
              }
              resolve(response.json());
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
  }

  isLoggedIn() {
    var token = localStorage.getItem("id_token");
    if (token) return true;
    return false;
  }

}
