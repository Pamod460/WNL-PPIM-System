import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {AuthorizationManager} from '../service/auth/authorizationmanager';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: jasmine.SpyObj<Router>;
  let auth: jasmine.SpyObj<AuthorizationManager>;
  const route = {} as ActivatedRouteSnapshot;
  const state = (url: string) => ({url} as RouterStateSnapshot);

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    auth = jasmine.createSpyObj('AuthorizationManager', ['getToken']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {provide: Router, useValue: router},
        {provide: AuthorizationManager, useValue: auth},
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('sends a visitor with no token to the login page', () => {
    auth.getToken.and.returnValue('');
    expect(guard.canActivate(route, state('/main/employee'))).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {queryParams: {redirectUrl: '/main/employee'}});
  });

  it('lets a logged-in user through', () => {
    auth.getToken.and.returnValue('header.payload.signature');
    expect(guard.canActivate(route, state('/main/employee'))).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('always allows the login page', () => {
    auth.getToken.and.returnValue('');
    expect(guard.canActivate(route, state('/login'))).toBeTrue();
  });
});
