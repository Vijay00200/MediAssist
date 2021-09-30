import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ApiModule } from '../services/services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private tokenClient: ApiModule.TokenClient
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    request = this.addTokenHeader(request, this.authService.getToken()!);
    return next.handle(request).pipe(
      catchError((error) => {
        console.log('Interceptor catherr');
        if (
          error instanceof HttpErrorResponse &&
          !request.url.includes('Auth/login')
        ) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log('try to get refresh token');
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.tryRefreshingTokens().pipe(
        filter((resp) => resp),
        take(1),
        switchMap((resp) => {
          const accessToken = this.authService.getToken();
          this.refreshTokenSubject.next(accessToken);
          return next.handle(this.addTokenHeader(request, accessToken!));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logOut();
          return throwError(err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
