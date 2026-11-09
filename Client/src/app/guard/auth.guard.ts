import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import {AuthorizationManager} from "../service/auth/authorizationmanager";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authorizationManager: AuthorizationManager) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const publicRoutes = ['/login', '/register', '/forgot-password'];
    if (publicRoutes.includes(state.url)) return true;

    // isUserAuthenticated() returns an Observable, which is always truthy, so it let
    // everyone through. Check the stored token instead.
    if (this.authorizationManager.getToken()) return true;

    this.router.navigate(["/login"], { queryParams: { redirectUrl: state.url } });
    return false;
  }
}
