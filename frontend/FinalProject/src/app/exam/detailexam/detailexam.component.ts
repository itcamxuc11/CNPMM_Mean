import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { LoginService } from '../../_service/login.service';
import * as CanvasJS from './canvasjs.min';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-detailexam',
  templateUrl: './detailexam.component.html',
  styleUrls: ['detailexam.component.css']
})
export class DetailexamComponent implements OnInit {

  examId: String;
  classrooms = [];
  relatives = [];

  constructor(private http: AuthHttp, private route: ActivatedRoute,  private loginService:LoginService) { }
  ngOnInit() {
    this.route.paramMap.subscribe((paraMap: ParamMap) => {
      if (paraMap.has('examId')) {
        this.examId = paraMap.get('examId');
        this.getDetail();
        this.drawChart();
      }
    });
  }

  getDetail() {
    this.http.get('http://localhost:8080/api/exam/detail/' + this.examId).toPromise()
      .then(res => {
        if (res.status == 200) this.relatives = res.json();;
      })
  }

  drawChart() {
    this.http.get("http://localhost:8080/api/test/result/" + this.examId).toPromise()
      .then(res => {
        if (res.status == 200) {
          var d0=0, d1=0, d2=0, d3=0, d4=0, d5=0, d6=0, d7=0, d8=0, d9=0, d10=0;
          var data = res.json();
          data.forEach(element => {
            switch (element.score) {
              case 0: d0++; break;
              case 1: d1++; break;
              case 2: d2++; break;
              case 3: d3++; break;
              case 4: d4++; break;
              case 5: d5++; break;
              case 6: d6++; break;
              case 7: d7++; break;
              case 8: d8++; break;
              case 9: d9++; break;
              case 10: d10++; break;
            }
          });
          let dataPoints = [
            { y: d0 },
            { y: d1 },
            { y: d2 },
            { y: d3 },
            { y: d4 },
            { y: d5 },
            { y: d6 },
            { y: d7 },
            { y: d8 },
            { y: d9 },
            { y: d10 },
          ];
          let chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
              text: "Scores chart"
            },
            data: [{
              type: "column",
              dataPoints: dataPoints
            }]
          });
          chart.render();
        }
      })
  }

  getAllClass() {
    this.http.get('http://localhost:8080/api/classroom').toPromise()
      .then(res => {
        if (res.status == 200) {
          this.classrooms = res.json();
          console.log(this.classrooms);
        }
      })
  }

  addRelative(classEl, titleEl, timesEl, startEl, endEl) {
    var classId = classEl.value;
    var title = titleEl.value;
    var times = timesEl.value;
    var start = startEl.value;
    var end = endEl.value;
    this.http.post('http://localhost:8080/api/exam/detail/' + this.examId,
      {
        classId: classId,
        title: title,
        times: times,
        start: start,
        end: end
      }).toPromise()
      .then(res => {
        if (res.status == 200) {
          alert('Thêm thành công');
          this.getDetail();
        }
      })
  }

  deleteRelative(classId) {
    this.http.delete('http://localhost:8080/api/exam/detail/' + this.examId + '/' + classId).toPromise()
      .then(res => {
        if (res.status == 200) {
          alert("Xóa thành công");
          this.getDetail();
        }
      })
  }

  logOut(){
    this.loginService.logout();
  }
  
}
