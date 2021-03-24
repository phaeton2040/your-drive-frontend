import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;
  const httpPostSpy = jasmine.createSpy().and.returnValue( of({ UserConfirmed: true }) );

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: { post: httpPostSpy }}
    ]
  }));

  beforeEach(() => {
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should do HTTP requests', (done) => {
    service.post('/auth/sign-in', { username: 'test@test.com', password: 'qwer1234' })
      .subscribe(() => {
        expect(httpPostSpy).toHaveBeenCalled();
        done();
      });
  });
});
