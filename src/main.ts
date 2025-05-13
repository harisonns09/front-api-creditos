import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ConsultaCreditosComponent } from './app/consulta-creditos/consulta-creditos.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Configura o HttpClient diretamente
  ]
}).catch(err => console.error(err));

bootstrapApplication(ConsultaCreditosComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(ReactiveFormsModule)
  ]
});
