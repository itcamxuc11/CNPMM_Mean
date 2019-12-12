import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClassroomComponent } from './classroom/classroom.component';
import { ExamComponent } from './exam/exam.component';
import { AnonymousGuard } from './_guards/anonymous.guard';
import {DetailexamComponent} from './exam/detailexam/detailexam.component';
import {UserComponent} from './user/user.component';
import{ProfileComponent} from './profile/profile.component';
import { TestingComponent } from './testing/testing.component';

const routes: Routes = [
  {
    
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard]
  },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'admin/classroom',
    component: ClassroomComponent,
  },
  {
    path: 'admin/exam',
    component: ExamComponent,
  },
  {
    path: 'admin/exam/detail/:examId',
    component: DetailexamComponent,
  },
  {
    path: 'admin/student',
    component:UserComponent
  },
  {
    path: 'profile',
    component:ProfileComponent
  },
  {
    path: 'test/:relativeId',
    component: TestingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AnonymousGuard
  ]
})
export class AppRoutingModule { }
