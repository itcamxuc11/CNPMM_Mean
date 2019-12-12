import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http'

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppRoutingModule } from './app-routing.module';
import { LoginService } from './_service/login.service';
import { ClassroomComponent } from './classroom/classroom.component';
import { ExamComponent } from './exam/exam.component';
import { DetailexamComponent } from './exam/detailexam/detailexam.component';
import { UserService } from './_service/user.service';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';
import { TestingComponent } from './testing/testing.component';

export function getAuthHttp(http: Http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'x-access-token',
    noTokenScheme: true,
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => localStorage.getItem('id_token')),
  }), http);
}

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("369371652857-cvprecuj3gbt9lsmprbohbv1hu164l1a.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('835967343523988')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClassroomComponent,
    ExamComponent,
    DetailexamComponent,
    UserComponent,
    ProfileComponent,
    TestingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SocialLoginModule,
    AppRoutingModule,
  ],
  providers: [
    UserService,
    LoginService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
