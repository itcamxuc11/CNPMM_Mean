import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { LoginService } from '../_service/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public students = [];
  constructor(private loginService:LoginService,private http: AuthHttp) { }

  ngOnInit() {
    this.getAllStudent();
  }

  getAllStudent(){
    this.http.get('http://localhost:8080/api/users').toPromise()
    .then(response=>{
      if(response.status==200) this.students = response.json();
      else console.log(status);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  createStudent(usernameEl, nameEl, passwordEl){
    var username = usernameEl.value;
    var name = nameEl.value;
    var password = passwordEl.value;
    this.http.post('http://localhost:8080/api/users'
    ,{username:username, name:name, password:password}).toPromise()
    .then(response=>{
      if(response.status==200){
        this.getAllStudent();
        alert('Thêm thành công');
      }
      else alert('error'+ response.status);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  deleteStudent(id){
    this.http.delete('http://localhost:8080/api/users/'+id).toPromise()
    .then(response=>{
      if(response.status==200){
        this.getAllStudent();
        alert('Xóa thành công');
      }
    })
    .catch(err=>{
      console.log(err);
    })
  }

  
  logOut(){
    this.loginService.logout();
  }
}
