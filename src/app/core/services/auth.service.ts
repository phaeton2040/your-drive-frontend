import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, concatMap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { ConfigService } from './config.service';
import { ApiService } from './api.service';
import { SigninResponseInterface } from '../interfaces/auth/signin-response.interface';
import { GetUserInterface } from '../interfaces/auth/get-user.interface';
import { SignupResponseInterface } from '../interfaces/auth/signup-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public get token$(): Observable<string> {
    return this.token.asObservable();
  }

  private error: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public get error$(): Observable<string> {
    return this.error.asObservable();
  }

  private user: BehaviorSubject<{ [ key: string ]: any }> = new BehaviorSubject<{ [ key: string ]: any }>(null);

  public get user$(): Observable<{ [ key: string ]: any }> {
    return this.user.asObservable();
  }

  constructor(private api: ApiService, private config: ConfigService) {
    this.config.getItem('token')
      .subscribe((value: string) => {
        if (!value) {
          return;
        }

        this.token.next(value);
      });
    this.config.getItem('user')
      .subscribe((userData) => {
        if (!userData) {
          return;
        }

        this.user.next(this.formatUser(userData));
      });
  }

  isAuthenticated(): Observable<boolean> {
    return combineLatest([
      this.user$,
      this.token$
    ]).pipe(map(([ user, token ]) => {
        return !!token && !!user;
      })
    );
  }

  signUp(username: string, password: string): void {
    const signUpRequest$ = this.api.post<SignupResponseInterface>('/auth/sign-up', { username, password });
    const signInRequest$ = this.api.post<SigninResponseInterface>('/auth/sign-in', { username, password });

    signUpRequest$
      .pipe(
        concatMap(() => signInRequest$),
        concatMap((signInResponse) => this.settleAuthData(signInResponse)),
        catchError((response: HttpErrorResponse) => {
          return of({ error: response.error.message });
        })
      ).subscribe((userDataResponse) => {
      if (userDataResponse.error) {
        this.error.next(userDataResponse.error);
        return;
      }

      this.config.setItem('user', userDataResponse.UserAttributes);
      this.user.next(this.formatUser(userDataResponse.UserAttributes));
    });
  }

  signIn(username, password): void {
    const signInRequest$ = this.api.post('/auth/sign-in', { username, password });

    signInRequest$
      .pipe(
        concatMap((signInResponse: any) => this.settleAuthData(signInResponse)),
        catchError((response: HttpErrorResponse) => {
          return of({ error: response.error.message });
        })
      ).subscribe((userDataResponse: any) => {
      if (userDataResponse.error) {
        this.error.next(userDataResponse.error);
        return;
      }


      this.config.setItem('user', userDataResponse.UserAttributes);
      this.user.next(this.formatUser(userDataResponse.UserAttributes));
    });
  }

  signOut(): void {
    this.config.removeItem('token');
    this.config.removeItem('user');
    this.token.next(null);
    this.user.next(null);
  }

  clearError(): void {
    this.error.next(null);
  }

  private settleAuthData(response: { AccessToken: string }): Observable<any> {
    this.config.setItem('token', response.AccessToken);
    this.token.next(response.AccessToken);
    this.error.next(null);

    return this.api.post<GetUserInterface>('/auth/user', { token: response.AccessToken });
  }

  private formatUser(attrs: { Name: string, Value: string }[]): { [ key: string ]: any } {
    const user = {} as any;

    attrs.forEach(attr => {
      user[ attr.Name ] = attr.Value;
    });

    return user;
  }
}
