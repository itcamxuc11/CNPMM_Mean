import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ClassroomComponent} from './classroom/classroom.component'
import { AnonymousGuard } from './_guards/anonymous.guard';
import { from } from 'rxjs';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard]
  },
  {
    path: 'classroom',
    component: ClassroomComponent,
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
