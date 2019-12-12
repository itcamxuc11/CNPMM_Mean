import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: AuthHttp) { }

  getAllUser(){
    return this.http.get('http://localhost:8080/api/user').toPromise();
  }
}
