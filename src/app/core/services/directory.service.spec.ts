import { TestBed } from '@angular/core/testing';

import { DirectoryService } from './directory.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

describe('DirectoryService', () => {
  let service: DirectoryService;
  const apiPostSpy = jasmine.createSpy().and.returnValue(of([
    { name: 'testDir1' },
    { name: 'testDir2' }
  ]));

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: ApiService, useValue: {
          post: apiPostSpy
        }
      },
      {
        provide: AuthService,
        useValue: {
          isAuthenticated: () => of(true)
        }
      }
    ]
  }));

  beforeEach(() => {
    service = TestBed.inject(DirectoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('go forward', (done) => {
    service.list = jasmine.createSpy();
    service.goForward('app');

    service.history$.subscribe(history => {
      expect(history.length).toBe(1);
      expect(service.list).toHaveBeenCalled();

      done();
    });
  });

  it('go back', (done) => {
    service.list = jasmine.createSpy();
    service.goForward('app');
    service.goForward('src');
    service.goForward('components');

    service.goBack(1);

    service.history$.subscribe(history => {
      expect(history.length).toBe(2);
      expect(service.list).toHaveBeenCalled();

      done();
    });
  });

  it('list', (done) => {
    service.list();
    service.items$.subscribe(items => {
      expect(items.length).toBe(2);
      done();
    });
  });

  it('create', (done) => {
    service.list = jasmine.createSpy();

    service.goForward('src');
    service.goForward('app');
    service.goForward('components');
    service.create('home');

    service.items$.subscribe(() => {
      expect(apiPostSpy).toHaveBeenCalledWith('/directory/create', {
        directory: 'home',
        path: 'src/app/components'
      });
      expect(service.list).toHaveBeenCalled();
      done();
    });
  });
});
