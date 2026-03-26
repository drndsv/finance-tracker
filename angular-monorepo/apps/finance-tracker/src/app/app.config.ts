import '@angular/common/locales/global/ru';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEventPlugins } from '@taiga-ui/event-plugins';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideEventPlugins(),
  ],
};
