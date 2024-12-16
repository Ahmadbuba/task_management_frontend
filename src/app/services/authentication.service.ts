import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from 'src/environment';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
  role: string;
  active: boolean;
  creationDate: Date | null;
  lastModifiedDate: Date | null;
  createdBy: string | null;
  lastModifiedBy: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  issuer: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.baseUrl}user-management/register`,
      payload
    );
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}authorize/login`, payload)
      .pipe(
        map((response) => {
          this.setToken(response.accessToken, response.refreshToken);
          return response;
        })
      );
  }

  logout(): void {
    this.tokenService.clearTokens();
  }

  refreshToken(): Observable<LoginResponse | null> {
    const refreshToken = this.tokenService.getToken('refresh');
    if (!refreshToken) {
      return of(null); // No refresh token found
    }

    const payload = { refreshToken };
    return this.http
      .post<LoginResponse>(`${this.baseUrl}authorize/token`, payload)
      .pipe(
        map((response) => {
          this.tokenService.setToken(
            response.accessToken,
            response.refreshToken
          );
          return response;
        }),
        catchError((error) => {
          // Handle refresh token failure (e.g., log out the user)
          console.error('Refresh token failed:', error);
          this.tokenService.clearTokens();
          return of(null);
        })
      );
  }

  hasToken(type: 'access' | 'refresh'): boolean {
    return this.tokenService.getToken(type) !== null;
  }

  private setToken(accessToken: string, refreshToken: string): void {
    this.tokenService.setToken(accessToken, refreshToken);
  }
}
