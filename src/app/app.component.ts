import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { Component } from '@angular/core';
import { ConsultaCreditosComponent } from './consulta-creditos/consulta-creditos.component'; // ajuste o caminho se estiver em outra pasta

// @Component({
//   selector: 'app-root',
//   imports: [ConsultaCreditosComponent],
//   standalone: true,
//   // imports: [ConsultaCreditosComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'frontend-creditos';
// }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="header">
      <div class="logo">Sistema de Créditos</div>
    </header>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header {
      background-color: #007bff;
      color: white;
      padding: 15px 30px;
      font-size: 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .main-content {
      padding: 20px;
    }

    .logo {
      font-weight: bold;
    }
  `]
})
export class AppComponent {}
