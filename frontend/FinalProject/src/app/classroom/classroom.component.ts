import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { LoginService } from '../_service/login.service';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit {
  public listOutClass =[];
  public listInClass = [];
  private listFull =[];
  public classrooms = [];
  public detailClass;
  constructor(private http: AuthHttp, private loginService:LoginService) {
  }

  ngOnInit() {
    this.getAllClassroom();
  }

  getAllClassroom(){
    this.http.get('http://localhost:8080/api/classroom').toPromise()
    .then(response => {
      this.classrooms = response.json();
    }).catch(err=>{
      console.log(err);
    })
  }

  deleteClassroom(id) {
    this.http.delete('http://localhost:8080/api/classroom/' + id).toPromise()
    .then(reponse =>{
      if(reponse.status == 200) {
        this.getAllClassroom();
        alert("Xóa thành công");
      }
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
    this.getListStudentFull(id);
  }

  updateClassroom(id, enddateEl){
    var enddate = enddateEl.value;
    this.http.put(`http://localhost:8080/api/classroom/` + id, {enddate: enddate}).toPromise()
    .then(response =>{
      if(response.status = 200){
        this.getAllClassroom();
        alert('Cập nhật thành công!');
      } 
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
    this.http.post(`http://localhost:8080/api/classroom`, {name:name, startdate:startdate, enddate: enddate}).toPromise()
    .then(response =>{
      if(response.status = 200) {
        this.getAllClassroom();
        alert('Class created');
      }
      else alert(response.status +' error');
    })
    .catch(err=>{
      alert(err);
    })
  }

  getListStudentFull(id){
    this.http.get('http://localhost:8080/api/users').toPromise()
    .then(response=>{
      this.listFull = response.json();
      this.getListStudentIn(id);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  getListStudentIn(classId){
    this.http.get('http://localhost:8080/api/classroom/detail/'+ classId).toPromise()
    .then(response=>{
      if(response.status ==200) {
        this.listInClass = response.json();
        this.getListStudentOut();
      }
    })
    .catch(err=>{
      console.log(err);
    })
  }

  getListStudentOut(){
    this.listOutClass = this.difference(this.listFull,this.listInClass);
  }

  addStudentToClass(classId,userId){
    this.http.post('http://localhost:8080/api/classroom/detail/'+ classId +'/'+userId,{})
    .toPromise()
    .then(reponse=>{
      if(reponse.status==200) {
        alert('Thêm thành công');
        this.getListStudentIn(classId);
        
      }
      else alert(reponse.status + ' error');
    })
    .catch(err=>{
      console.log(err);
    })
  }

    difference(a1, a2) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
      if(this.isInArray(a1[i],a2)==false) result.push(a1[i]);
    }
    return result;
  }

  isInArray(a, b){
    if(b.length==0) return false;
    for(var i=0;i<b.length;i++){
      if(a._id == b[i]._id) return true;
    }
    return false;
  }

  logOut(){
    this.loginService.logout();
  }
}
