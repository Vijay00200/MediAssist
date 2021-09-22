import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private router: Router, private commonService: CommonService) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.commonService.isLoading.next(this.requests.length > 0);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requests.push(request);
    this.commonService.isLoading.next(true);

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
            this.removeRequest(request);
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            this.removeRequest(request);
            if (err.status === 401) {
              // redirect to the login route
              this.router.navigate(['login']);
              // or show a modal
            }
          }
        },
        () => {
          this.removeRequest(request);
        }
      )
    );
  }
}
