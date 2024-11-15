import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,  // Mantén tus configuraciones del archivo app.config.ts
    provideHttpClient(withFetch())  // Agrega la configuración de HttpClient con fetch
  ]
})
  .catch((err) => console.error(err));
