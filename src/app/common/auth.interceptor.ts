import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, switchMap, take, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.tokenService.getToken('access');

    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // Skip intercepting refresh token requests to prevent recursion
    if (request.url.includes('authorize/token')) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Attempt token refresh
          return this.authService.refreshToken().pipe(
            take(1), // Ensures the observable completes after one emission
            switchMap((response) => {
              if (response) {
                // Retry the original request with the new token
                const clonedRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.accessToken}`,
                  },
                });
                return next.handle(clonedRequest);
              } else {
                // Handle refresh token failure (e.g., log out the user)
                this.tokenService.clearTokens();
                this.router.navigate(['/authenticate']);
                return throwError(error);
              }
            }),
            catchError(() => {
              // Log out the user if refresh token fails
              this.tokenService.clearTokens();
              this.router.navigate(['/authenticate']);
              return throwError(error);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
