import { Injectable, InjectionToken } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ApiModule } from './services';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiModule.AuthClient {
  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
    private tokenClient: ApiModule.TokenClient,
    protected httpClient: HttpClient
  ) {
    super(httpClient, environment.basePath);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  public saveToken(accessToken: string, refreshToken: string) {
    localStorage.setItem('jwt', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public isTokenExpired() {
    const token = this.getToken();
    if (token && token !== 'undefined')
      return this.jwtHelper?.isTokenExpired(token);

    return true;
  }

  tryRefreshingTokens() {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return of(false);
    }
    const credentials = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return this.tokenClient
      .refresh(credentials as ApiModule.TokenApiModel)
      .pipe(
        switchMap((response) => {
          response?.data.text().then(
            (resp) => {
              const token = JSON.parse(resp);
              this.saveToken(token?.accessToken, token?.refreshToken);
              return of(true);
            },
            (err) => {
              return of(false);
            }
          );
          return of(false);
        })
      );
  }

  public logOut() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['login']);
  }
}
