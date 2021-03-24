import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

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

  register(): void {
    this.auth.signUp(this.userForm.username, this.userForm.password);
  }
}
