import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// A functional route guard (Angular 15+ style, replacing class-based
// CanActivate). Returning `true` lets navigation proceed; returning
// a UrlTree (from router.createUrlTree / router.parseUrl) redirects
// instead — Angular's router understands both return types.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
