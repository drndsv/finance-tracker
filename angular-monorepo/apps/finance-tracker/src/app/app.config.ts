import '@angular/common/locales/global/ru';
import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideBrowserGlobalErrorListeners(), provideRouter(appRoutes), provideEventPlugins()],
};
