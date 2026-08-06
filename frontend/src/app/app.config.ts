import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

// ApplicationConfig is the standalone-app replacement for
// AppModule's `providers` array. provideRouter/provideHttpClient are
// "provider functions" — tree-shakable, so unused router/http
// features aren't bundled if not imported.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // withInterceptors registers our functional JWT interceptor;
    // multiple interceptors would just be added to this array, in
    // the order they should run.
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
