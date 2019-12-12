import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { LoginService } from '../_service/login.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  public relativeId: String;
  public content: any;
  public score: number;
  public times = { minute: 15, second: 0 };
  public completed = {minute: 0, second: 0};
  private countDown: any;
  constructor(private http: AuthHttp,private loginService:LoginService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paraMap: ParamMap) => {
      if (paraMap.has('relativeId')) {
        this.relativeId = paraMap.get('relativeId');
        this.getContentExam();
        this.countDown = setInterval(() => {
          if (this.times.second == 0) {
            if (this.times.minute > 0) { this.times.minute--; this.times.second = 59 }
            else {
              this.submit();
            }
          }
          else this.times.second--;
        }, 1000)
      }
    });
  }

  getContentExam() {
    this.http.get('http://localhost:8080/api/test/' + this.relativeId).toPromise()
      .then(res => {
        if (res.status == 200) {
          this.content = res.json().main;
          localStorage.setItem('test-token', res.json().test_token);
          this.times.minute = this.content.times;
        }
      })
      .catch(err=>{
        if(err.status==403){
          alert('Bạn không thể thực hiện bài thi này vì đã đạt số lần làm bài tối đa');
          this.router.navigateByUrl('/profile');
        }
      })
  }

  getAnswerSheet(): String {
    var answerContent = document.getElementsByClassName('answorten');
    var answer = "";
    for (var i = 0; i < answerContent.length; i++) {
      var checked = <HTMLInputElement>answerContent[i].querySelector('input[type="radio"]:checked');
      if (checked) answer += checked.value;
      else answer += '*';
    }
    return answer;
  }

  radioChange(id) {
    var elment = document.getElementById(id);
    elment.classList.replace('btn-outline-primary','btn-primary');
  }

  submit(){
    var answer = this.getAnswerSheet();
    var testToken = localStorage.getItem('test-token');
    this.http.post('http://localhost:8080/api/test/marker',{examId:this.content.exam._id, answer: answer, testToken:testToken})
    .toPromise()
    .then(res=>{
      if(res.status==200){
        this.score = res.json();
        this.completed.second =60 - this.times.second;
        if(this.completed.second == 60){
          this.completed.second = 0;
          this.completed.minute = this.content.times - this.times.minute;
        }
        else {
          this.completed.minute = this.content.times - this.times.minute - 1;
        }
        window.scrollTo(0,0);
      }
    })
    clearInterval(this.countDown);
  }

  onSubmit(){
    var cf = confirm("Sau khi nộp bài, bạn sẽ không thể tiếp tục làm bài thi");
    if(cf==true){
      this.submit();
    }
  }

  logOut(){
    this.loginService.logout();
  }
}
