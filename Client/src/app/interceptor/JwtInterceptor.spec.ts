import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {JwtInterceptor} from './JwtInterceptor';
import {AuthorizationManager} from '../service/auth/authorizationmanager';

describe('JwtInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let auth: jasmine.SpyObj<AuthorizationManager>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    auth = jasmine.createSpyObj('AuthorizationManager', ['getToken', 'removeToken']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: Router, useValue: router},
        {provide: AuthorizationManager, useValue: auth},
      ]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('adds the bearer token when the user is logged in', () => {
    auth.getToken.and.returnValue('abc');
    http.get('/materials').subscribe();
    expect(backend.expectOne('/materials').request.headers.get('Authorization')).toBe('Bearer abc');
  });

  it('sends no Authorization header when logged out', () => {
    auth.getToken.and.returnValue('');
    http.get('/products/list').subscribe();
    expect(backend.expectOne('/products/list').request.headers.has('Authorization')).toBeFalse();
  });

  it('logs the user out on 401', () => {
    auth.getToken.and.returnValue('expired');
    http.get('/materials').subscribe({error: () => {}});
    backend.expectOne('/materials').flush({message: 'Token expired'}, {status: 401, statusText: 'Unauthorized'});
    expect(auth.removeToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('keeps the user on the page on 403 and passes the error on', () => {
    auth.getToken.and.returnValue('abc');
    let status = 0;
    http.delete('/materials/1').subscribe({error: e => status = e.status});
    backend.expectOne('/materials/1').flush(
      {data: {message: 'You do not have permission to perform this action.'}},
      {status: 403, statusText: 'Forbidden'});
    expect(status).toBe(403);
    expect(auth.removeToken).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
