import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { LoginService } from '../_service/login.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})

export class ExamComponent implements OnInit {
  exams = [];
  fileData: File = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  fileName: string = "Chose file";
  constructor(private http: AuthHttp,private loginService:LoginService) { }

  ngOnInit() {
    this.getAllExam();
  }

  getAllExam() {
    this.http.get('http://localhost:8080/api/exams').toPromise()
      .then(response => {
        this.exams = response.json();
        console.log(response.json());
      })
      .catch(err => {
        console.log(err);
      })
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.fileName = this.fileData.name;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.http.post('http://localhost:8080/api/exams', formData).toPromise()
      .then(response => {
        if (response.status == 200) {
          alert('Thêm thành công');
          this.getAllExam();
        }
        else alert("Lỗi " + response.status);
      })
      .catch(error => {
        console.log(error);
      })
  }

  deleteExam(examId) {
    this.http.delete('http://localhost:8080/api/exam/' + examId).toPromise()
      .then(response => {
        if (response.status == 200) {
          this.getAllExam();
          alert('Xóa thành công');
        }
        else alert(response.status);
      })
      .catch(err => {
        console.log(err);
      })
  }

  logOut(){
    this.loginService.logout();
  }

}
