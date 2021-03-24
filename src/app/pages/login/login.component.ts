import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit, OnDestroy {

  userForm: { username?: string, password?: string } = {};
  error$: Observable<string>;

  private authSub: Subscription;

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.error$ = this.auth.error$;
    this.authSub = this.auth.isAuthenticated()
      .subscribe((isAuthenticated) => {
        if (!isAuthenticated) {
          return;
        }

        this.router.navigate(['home']);
      });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.auth.clearError();
  }

  login(): void {
    this.auth.signIn(this.userForm.username, this.userForm.password);
  }
}
