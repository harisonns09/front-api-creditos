import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta-creditos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1 class="title">Consulta de Créditos</h1>

      <button (click)="voltar()" style="margin-bottom: 20px; background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
        ← Voltar
      </button>

      <form [formGroup]="form" (ngSubmit)="buscar()" class="form">
        <input type="text" formControlName="numeroNfse" placeholder="Número da NFS-e" class="input" />
        <input type="text" formControlName="numeroCredito" placeholder="Número do Crédito" class="input" />

        <div *ngIf="form.errors?.['apenasUmObrigatorio'] && (form.dirty || form.touched)" class="form-error">
          Por favor, preencha <strong>somente um</strong> dos campos.
        </div>

        <button type="submit" [disabled]="form.invalid || carregando" class="btn">
          {{ carregando ? 'Buscando...' : 'Buscar' }}
        </button>
      </form>

      <div *ngIf="!carregando && creditos.length === 0 && resultadoVazio" class="resultado-vazio">
        Nenhum resultado encontrado.
      </div>

      <div *ngIf="creditos.length > 0" class="tabela-container">
        <table class="tabela">
          <thead>
            <tr>
              <th>Número Crédito</th>
              <th>Número NFS-e</th>
              <th>Data Constituição</th>
              <th>Valor ISSQN</th>
              <th>Tipo Crédito</th>
              <th>Simples Nacional</th>
              <th>Alíquota</th>
              <th>Valor Faturado</th>
              <th>Valor Dedução</th>
              <th>Base de Cálculo</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of creditos">
              <td>{{ c.numeroCredito }}</td>
              <td>{{ c.numeroNfse }}</td>
              <td>{{ c.dataConstituicao }}</td>
              <td>R$ {{ c.valorIssqn | number:'1.2-2' }}</td>
              <td>{{ c.tipoCredito }}</td>
              <td>{{ c.simplesNacional }}</td>
              <td>{{ c.aliquota | number:'1.2-2' }}%</td>
              <td>R$ {{ c.valorFaturado | number:'1.2-2' }}</td>
              <td>R$ {{ c.valorDeducao | number:'1.2-2' }}</td>
              <td>R$ {{ c.baseCalculo | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .title {
      text-align: center;
      margin-bottom: 30px;
      font-size: 2rem;
      color: #333;
    }

    .form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .input {
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
    }

    .form-error {
      color: #d9534f;
      grid-column: span 2;
      font-size: 0.95rem;
    }

    .btn {
      grid-column: span 2;
      background-color: #007bff;
      color: white;
      padding: 12px;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }

    .btn:hover {
      background-color: #0056b3;
    }

    .btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .resultado-vazio {
      margin-top: 20px;
      color: #d9534f;
      text-align: center;
      font-weight: bold;
    }

    .tabela-container {
      overflow-x: auto;
      margin-top: 30px;
    }

    .tabela {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .tabela th,
    .tabela td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }

    .tabela thead {
      background-color: #343a40;
      color: white;
    }

    @media (max-width: 768px) {
      .form {
        grid-template-columns: 1fr;
      }

      .btn {
        grid-column: 1;
      }

      .form-error {
        grid-column: 1;
      }
    }
  `]
})
export class ConsultaCreditosComponent implements OnInit {
  form: FormGroup;
  creditos: any[] = [];
  carregando = false;
  resultadoVazio = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        numeroNfse: [''],
        numeroCredito: [''],
      },
      {
        validators: [this.exatamenteUmPreenchido()],
      }
    );
  }

  ngOnInit(): void {}

  exatamenteUmPreenchido() {
    return (group: FormGroup) => {
      const nfse = group.get('numeroNfse')?.value?.trim();
      const credito = group.get('numeroCredito')?.value?.trim();

      if ((nfse && credito) || (!nfse && !credito)) {
        return { apenasUmObrigatorio: true };
      }
      return null;
    };
  }

  buscar(): void {
    if (this.form.invalid) return;

    const { numeroNfse, numeroCredito } = this.form.value;
    this.creditos = [];
    this.resultadoVazio = false;
    this.carregando = true;

    if (numeroCredito) {
      this.http.get<any>(`http://localhost:8080/api/creditos/credito/${numeroCredito}`).subscribe({
        next: (c) => {
          this.creditos = c ? [c] : [];
          this.resultadoVazio = !c;
        },
        error: () => this.resultadoVazio = true,
        complete: () => this.carregando = false
      });
    } else if (numeroNfse) {
      this.http.get<any[]>(`http://localhost:8080/api/creditos/${numeroNfse}`).subscribe({
        next: (cs) => {
          this.creditos = cs;
          this.resultadoVazio = cs.length === 0;
        },
        error: () => this.resultadoVazio = true,
        complete: () => this.carregando = false
      });
    }
  }

  voltar() {
    this.router.navigate(['/']);
  }


}