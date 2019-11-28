import { Injectable }       from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Route
}                           from '@angular/router';
import { LoginService } from '../_service/login.service';

@Injectable()
export class AnonymousGuard implements CanActivate {

    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkLogin();
    }

    checkLogin(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('id_token');
            var token = localStorage.getItem('id_token');
            if(token!==null){
                console.log(token);
                this.router.navigate(['/']);
                reject(false);
            } 
            else resolve(true);
        });
    }
}