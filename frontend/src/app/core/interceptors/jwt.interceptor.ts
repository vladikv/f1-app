import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Since Angular 15, interceptors can be plain functions instead of
// injectable classes implementing HttpInterceptor. This one runs on
// every outgoing HttpClient request: if we have a JWT, it clones the
// request (requests are immutable) and attaches the Authorization
// header before letting it continue down the chain via next(req).
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authenticatedRequest);
};
