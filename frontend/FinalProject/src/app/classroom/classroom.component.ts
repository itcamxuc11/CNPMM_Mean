import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit {
  public classrooms = [];
  public detailClass;
  constructor(private http: AuthHttp) {

  }

  ngOnInit() {
    this.http.get('http://localhost:8080/api/classroom').toPromise()
      .then(response => {
        this.classrooms = response.json();
      }).catch()
  }

  deleteClassroom(id) {
    this.http.delete('http://localhost:8080/api/classroom/' + id).toPromise()
    .then(reponse =>{
      if(reponse.status == 200) alert("Xoa thanh cong");
      else alert(status + ' error');
    })
    .catch(err => {
      alert(err);
    })
  }

  getDetail(id){
    this.detailClass = this.classrooms.find(element =>{
      return element._id == id;
    })
  }

  updateClassroom(id, enddateEl){
    var enddate = enddateEl.value;
    this.http.put(`http://localhost:8080/api/classroom/` + id, {enddate: enddate}).toPromise()
    .then(response =>{
      if(response.status = 200) alert('Class updated');
      else alert(response.status +' error');
    })
    .catch(err=>{
      alert(err);
    })
  }


  addClassroom(nameEl, enddateEl){
    var enddate = enddateEl.value;
    var name = nameEl.value;
    var startdate = new Date();
    console.log(startdate);
    this.http.post(`http://localhost:8080/api/classroom`, {name:name, startdate:startdate, enddate: enddate}).toPromise()
    .then(response =>{
      if(response.status = 200) alert('Class created');
      else alert(response.status +' error');
    })
    .catch(err=>{
      alert(err);
    })
  }
}
