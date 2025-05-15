import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consulta-creditos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align: center; margin-bottom: 20px;">Consulta de Créditos</h1>

      <form [formGroup]="form" (ngSubmit)="buscar()" style="display: grid; gap: 10px; grid-template-columns: 1fr 1fr;">
        <input type="text" formControlName="numeroNfse" placeholder="Número da NFS-e" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
        <input type="text" formControlName="numeroCredito" placeholder="Número do Crédito" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />

        <div *ngIf="form.errors?.['apenasUmObrigatorio'] && (form.dirty || form.touched)" style="color: red; grid-column: span 2;">
          Por favor, preencha <strong>somente um</strong> dos campos.
        </div>

        <button class="btn-primario" type="submit" [disabled]="form.invalid || carregando" style="grid-column: span 2; background-color: #007bff; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
          {{ carregando ? 'Buscando...' : 'Buscar' }}
        </button>
      </form>

      <div *ngIf="!carregando && creditos.length === 0 && resultadoVazio" style="margin-top: 20px; color: red; text-align: center;">
        Nenhum resultado encontrado.
      </div>

      <br/>
      
      <div *ngIf="creditos.length > 0" class="mt-6">
        <table class="table table-striped table-bordered table-hover table-responsive-sm">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Número Crédito</th>
              <th scope="col">Número NFS-e</th>
              <th scope="col">Data Constituição</th>
              <th scope="col">Valor ISSQN</th>
              <th scope="col">Tipo Crédito</th>
              <th scope="col">Simples Nacional</th>
              <th scope="col">Alíquota</th>
              <th scope="col">Valor Faturado</th>
              <th scope="col">Valor Dedução</th>
              <th scope="col">Base de Cálculo</th>
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
  `,
  styles: [`
    @media (max-width: 600px) {
      form {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class ConsultaCreditosComponent implements OnInit {
  form: FormGroup;
  creditos: any[] = [];
  carregando = false;
  resultadoVazio = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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

  apenasUmObrigatorio() {
    return (formGroup: FormGroup) => {
      const numeroNfse = formGroup.get('numeroNfse');
      const numeroCredito = formGroup.get('numeroCredito');

      if (numeroNfse?.value && numeroCredito?.value) {
        formGroup.setErrors({ apenasUmObrigatorio: true });
      } else {
        formGroup.setErrors(null);
      }
  };
  }

}