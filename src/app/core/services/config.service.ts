import { Injectable } from '@angular/core';
import { LocalForageConfiguration, LocalForageService } from 'ngx-localforage';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private localforage: LocalForageService) {
    const config = {
      name: environment.appName,
      storeName: environment.storeName,
      driver: 'asyncStorage',
      version: 1
    };
    this.localforage.config(config as LocalForageConfiguration);
  }

  setItem(name, value): Observable<any> {
    return this.localforage.setItem(name, value);
  }

  getItem(name): Observable<any> {
    return this.localforage.getItem(name);
  }

  removeItem(name): Observable<any> {
    return this.localforage.removeItem(name);
  }
}
