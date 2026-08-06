import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// bootstrapApplication replaces the old platformBrowserDynamic().bootstrapModule(AppModule)
// call — there's no root NgModule at all in a standalone app.
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
