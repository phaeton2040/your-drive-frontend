import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DirectoryService } from '../../core/services/directory.service';
import { DirectoryItemInterface } from '../../core/interfaces/directory/directory-item.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user$: Observable<any>;
  items$: Observable<DirectoryItemInterface[]>;
  history$: Observable<string[]>;

  constructor(private auth: AuthService,
              private router: Router,
              private directory: DirectoryService) { }

  ngOnInit(): void {
    this.user$ = this.auth.user$;
    this.items$ = this.directory.items$;
    this.history$ = this.directory.history$;
    this.directory.list();
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['login']);
  }

  goBack(event, index: number): void {
    event.stopPropagation();
    event.preventDefault();

    this.directory.goBack(index);
  }

  next(event, directory: string): void {
    event.stopPropagation();
    event.preventDefault();

    this.directory.goForward(directory);
  }

  createDirectory(): void {
    let directoryName = prompt('Enter directory name');

    directoryName = directoryName.replace(/[^a-zA-Z0-9 ]/g, '');

    if (directoryName) {
      this.directory.create(directoryName);
    }
  }
}
