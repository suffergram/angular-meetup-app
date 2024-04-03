import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private routes: Router,
    private location: Location
  ) {}

  tokenName: string = 'meetup_auth_token';
  baseUrl: string = `${environment.backendOrigin}/auth`;

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        map((res) => {
          if (res.token) {
            localStorage.setItem(this.tokenName, res.token);
          }
          return null;
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenName);
    if (['', '/my', '/users'].includes(this.location.path()))
      this.routes.navigate(['login']);
  }

  get user() {
    const userTokenData = this.token?.split('.')[1];

    if (userTokenData) {
      const jsonPayload = atob(userTokenData);
      return JSON.parse(jsonPayload);
    }

    return null;
  }

  get token() {
    return localStorage.getItem(this.tokenName);
  }

  register(data: Object) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/registration`, data)
      .pipe(
        map((res) => {
          if (res.token) {
            localStorage.setItem(this.tokenName, res.token);
          }
          return null;
        })
      );
  }
}
