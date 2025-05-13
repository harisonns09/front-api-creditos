import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { Component } from '@angular/core';
import { ConsultaCreditosComponent } from './consulta-creditos/consulta-creditos.component'; // ajuste o caminho se estiver em outra pasta

@Component({
  selector: 'app-root',
  imports: [ConsultaCreditosComponent],
  standalone: true,
  // imports: [ConsultaCreditosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-creditos';
}
