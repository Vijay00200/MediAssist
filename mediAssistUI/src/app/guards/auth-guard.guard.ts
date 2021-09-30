import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate() {
    if (this.authService.getToken()) {
      // if (this.authService.isTokenExpired())
      //   this.authService.tryRefreshingTokens().subscribe();
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
