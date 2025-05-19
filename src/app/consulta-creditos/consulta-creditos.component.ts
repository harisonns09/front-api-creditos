import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreditoService } from '../services/credito.service';

@Component({
  selector: 'app-consulta-creditos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1 class="title">Consulta de Créditos</h1>

      <button (click)="voltar()" class="btn-voltar">← Voltar</button>
      <button (click)="listarTodos()" class="btn-listar">Listar todos os créditos</button>

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
              <th></th> <!-- coluna para o radio -->
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
              <th>Ações</th> <!-- nova coluna -->
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of creditos" [class.selecionado]="creditoSelecionado?.numeroCredito === c.numeroCredito">
              <td>
                <input type="radio" name="creditoSelecionado" [value]="c" (change)="selecionarCredito(c)" />
              </td>
              <td>{{ c.numeroCredito }}</td>
              <td>{{ c.numeroNfse }}</td>
              <td>{{ c.dataConstituicao }}</td>
              <td>R$ {{ c.valorIssqn | number:'1.2-2' }}</td>
              <td>{{ c.tipoCredito }}</td>
              <td>{{ c.simplesNacional === true || c.simplesNacional === 'true' ? 'Sim' : 'Não' }}</td>
              <td>{{ c.aliquota | number:'1.2-2' }}%</td>
              <td>R$ {{ c.valorFaturado | number:'1.2-2' }}</td>
              <td>R$ {{ c.valorDeducao | number:'1.2-2' }}</td>
              <td>R$ {{ c.baseCalculo | number:'1.2-2' }}</td>
              <td>
                <button (click)="excluirCredito(c.numeroCredito)" class="btn-excluir">
                  Excluir
                </button>
              </td>
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
    }

    .btn:hover {
      background-color: #0056b3;
    }

    .btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-voltar,
    .btn-listar {
      margin: 0 10px 20px 0;
      background-color: #6c757d;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-excluir {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
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

    .selecionado {
      background-color: #e9f7ff;
      font-weight: bold;
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
  creditoSelecionado: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private creditoService: CreditoService,
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
    this.iniciarBusca();

    if (numeroCredito) {
      this.creditoService.buscarPorNumeroCredito(numeroCredito).subscribe({
        next: (c) => {
          this.creditos = c ? [c] : [];
          this.resultadoVazio = !c;
        },
        error: () => this.resultadoVazio = true,
        complete: () => this.carregando = false
      });
    } else {
      this.creditoService.buscarPorNumeroNfse(numeroNfse).subscribe({
        next: (cs) => {
          this.creditos = cs;
          this.resultadoVazio = cs.length === 0;
        },
        error: () => this.resultadoVazio = true,
        complete: () => this.carregando = false
      });
    }
  }

  listarTodos(): void {
    this.iniciarBusca();
    this.creditoService.listarTodos().subscribe({
      next: (cs) => {
        this.creditos = cs;
        this.resultadoVazio = cs.length === 0;
      },
      error: () => this.resultadoVazio = true,
      complete: () => this.carregando = false
    });
  }

  excluirCredito(numeroCredito: string): void {
    if (confirm(`Tem certeza que deseja excluir o crédito nº ${numeroCredito}?`)) {
      this.creditoService.deletarPorNumeroCredito(numeroCredito).subscribe({
        next: (mensagem) => {
          alert(mensagem);
          this.creditos = this.creditos.filter(c => c.numeroCredito !== numeroCredito);
          if (this.creditos.length === 0) this.resultadoVazio = true;
        },
        error: (erro) => {
          alert(`Erro ao excluir crédito: ${erro.error || 'Tente novamente mais tarde.'}`);
        }
      });
    }
  }

  private iniciarBusca(): void {
    this.creditos = [];
    this.resultadoVazio = false;
    this.carregando = true;
  }

  selecionarCredito(credito: any): void {
    this.creditoSelecionado = credito;
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
