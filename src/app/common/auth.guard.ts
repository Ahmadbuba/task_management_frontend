import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService); // Inject AuthService here
  const router = inject(Router); // Inject Router here

  if (authService.hasToken('access')) {
    return true;
  } else {
    router.navigate(['/authenticate']);
    return false;
  }
};
