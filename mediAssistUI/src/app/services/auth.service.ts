import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {  Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private jwtHelper: JwtHelperService, private router:Router) {}

  public getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  public isAuthourized(): boolean {
    const token = this.getToken();
    if (token && token !== 'undefined')
      if (!this.jwtHelper?.isTokenExpired(token)) {
        return true;
      }
    return false;
  }

  public logOut() {
    localStorage.removeItem("jwt");
      this.router.navigate(['login']);
 }
}
