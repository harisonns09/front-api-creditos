import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1 class="title">Sistema de Consulta</h1>
      <p class="subtitle">Acesse informações de créditos vinculados à NFS-e de forma simples e rápida.</p>
      <a routerLink="/consulta" class="btn">Consultar Créditos</a>
    </div>
  `,
  styles: [`
    .container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0 20px;
    }

    .title {
      font-size: 2.5rem;
      margin-bottom: 10px;
      color: #333;
    }

    .subtitle {
      font-size: 1.2rem;
      margin-bottom: 30px;
      color: #555;
    }

    .btn {
      background-color: #007bff;
      color: white;
      padding: 14px 28px;
      font-size: 1.1rem;
      border: none;
      border-radius: 8px;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }

    .btn:hover {
      background-color: #0056b3;
    }
  `]
})
export class IndexComponent {}
