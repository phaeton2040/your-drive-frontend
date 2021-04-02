import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DirectoryItemInterface } from '../interfaces/directory/directory-item.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { concatMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  private items: BehaviorSubject<DirectoryItemInterface[]> = new BehaviorSubject<DirectoryItemInterface[]>([]);

  public get items$(): Observable<DirectoryItemInterface[]> {
    return this.items.asObservable();
  }

  private history: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  public get history$(): Observable<string[]> {
    return this.history.asObservable();
  }

  constructor(private api: ApiService,
              private auth: AuthService) {
    this.auth.isAuthenticated()
      .pipe(
        filter(isAuthenticated => !isAuthenticated)
      )
      .subscribe(() => {
        this.history.next([]);
        this.items.next([]);
      });
  }

  public list(): void {
    this.api.post<DirectoryItemInterface[]>('/directory/list', { directory: this.path })
      .subscribe(result => {
        this.items.next(result);
      });
  }

  public create(name: string): void {
    this.api.post('/directory/create', {
      directory: name,
      path: this.path
    }).pipe(
      concatMap((res) => {
        this.list();

        return of(res);
      })
    ).subscribe();
  }

  public get current(): string {
    return this.history.value[this.history.value.length - 1];
  }

  public get path(): string {
    return this.history.value.join('/');
  }

  public goForward(directory: string): void {
    const history = this.history.value;

    history.push(directory);

    this.history.next(history);
    this.list();
  }

  public goBack(index: number): void {
    const history = this.history.value;

    this.history.next(history.slice(0, index + 1));
    this.list();
  }
}
