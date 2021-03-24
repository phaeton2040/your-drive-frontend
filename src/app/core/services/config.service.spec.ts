import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { LocalForageService } from 'ngx-localforage';
import { of } from 'rxjs';

describe('ConfigService', () => {
  let service: ConfigService;
  const setItemSpy = jasmine.createSpy().and.returnValue( of(null) );
  const getItemSpy = jasmine.createSpy().and.returnValue( of('test') );
  const removeItemSpy = jasmine.createSpy().and.returnValue( of(null) );
  const configSpy = jasmine.createSpy();

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: LocalForageService, useValue: {
          setItem: setItemSpy,
          getItem: getItemSpy,
          removeItem: removeItemSpy,
          config: configSpy
        }
      }
    ]
  }));

  beforeEach(() => {
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(configSpy).toHaveBeenCalled();
  });

  it('getItem', (done) => {
    service.getItem('test')
      .subscribe(() => {
        expect(getItemSpy).toHaveBeenCalledWith('test');
        done();
      });
  });

  it('setItem', (done) => {
    service.setItem('test', 'test')
      .subscribe(() => {
        expect(setItemSpy).toHaveBeenCalledWith('test', 'test');
        done();
      });
  });

  it('removeItem', (done) => {
    service.removeItem('test')
      .subscribe(() => {
        expect(removeItemSpy).toHaveBeenCalledWith('test');
        done();
      });
  });
});
