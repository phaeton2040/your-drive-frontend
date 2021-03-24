import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DirectoryItemInterface } from '../interfaces/directory/directory-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';

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

  public list(directory: string): void {
    const history = this.history.value;

    history.push(directory);
    this.history.next(history);

    this.api.post<DirectoryItemInterface[]>('/list', { directory: this.prefix })
      .subscribe(result => {
        this.items.next(result);
      });
  }

  private get prefix(): string {
    return this.history.value.join('/');
  }

  goBack(index: number): void {
    const history = this.history.value;
    const directory = history[index];

    this.history.next(history.slice(0, index));
    this.list(directory);
  }
}
