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

    const isAuthenticated = this.authorizationManager.isUserAuthenticated();

    if (isAuthenticated) return true;

    this.router.navigate(["/login"], { queryParams: { redirectUrl: state.url } });
    return false;
  }
}
