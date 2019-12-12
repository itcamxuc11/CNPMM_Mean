import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoginService } from '../_service/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public userId : String;
  public exams = [];
  public classrooms = [];
  public results = [];
  constructor(private http: AuthHttp,private loginService:LoginService) { }

  ngOnInit() {
        this.userId = localStorage.getItem('id');
        this.getAllInfo();
        var s = document.createElement('script');
        s.type = "text/javascript";
        s.src = "../../assets/js/calendar.js";
        var node = document.getElementsByTagName('body');
        node[0].appendChild(s);
  }

  getAllInfo() {
    this.http.get('http://localhost:8080/api/users/' + this.userId).toPromise()
      .then(res => {
        if (res.status == 200) {
          this.classrooms = res.json().main.classList;
          this.results = res.json().history;
          this.classrooms.forEach(element => {
            element.exams.forEach(ex => {
              this.exams.push({classname:element.name, exam: ex});
            });
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  logOut(){
    this.loginService.logout();
  }
  
}
