import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import {AuthorizationManager} from "../service/auth/authorizationmanager";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authorizationManager: AuthorizationManager, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.authorizationManager.getToken();

    if (jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || (error.status === 500 && error.error?.message?.includes("JWT expired"))) {
          // Token is invalid or expired
          this.authorizationManager.removeToken();
          this.router.navigate(['/login']); // Redirect to login page
        }
        // 403 = logged in but missing the privilege for this action: keep the user on the page,
        // the component shows error.error.data.message.
        return throwError(() => error);
      })
    );
  }
}
