import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessTokenKey: string = 'access_token';
  private refreshTokenKey: string = 'refresh_token';

  constructor() {}

  setToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getToken(type: 'access' | 'refresh'): string | null {
    const key = type === 'access' ? this.accessTokenKey : this.refreshTokenKey;
    return localStorage.getItem(key);
  }

  hasToken(type: 'access' | 'refresh'): boolean {
    return this.getToken(type) !== null;
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
