import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incluir-creditos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Incluir Crédito</h2>

      <button (click)="voltar()" class="btn-voltar">← Voltar</button>

      <form [formGroup]="form" (ngSubmit)="incluir()">
        <ng-container *ngIf="step === 1">
          <div class="form-card">
            <div class="form-group">
              <label for="dataConstituicao">Data de Constituição</label>
              <input id="dataConstituicao" type="date" formControlName="dataConstituicao" />
              <small *ngIf="campoInvalido('dataConstituicao')">Campo obrigatório</small>
            </div>

            <div class="form-group checkbox-group">
              <input type="checkbox" id="simplesNacional" formControlName="simplesNacional" />
              <label for="simplesNacional">Simples Nacional</label>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="step === 2">
          <div class="form-card">
            <div class="form-grid">
              <div class="form-group">
                <label for="aliquota">Alíquota (%)</label>
                <input id="aliquota" type="number" formControlName="aliquota" />
                <small *ngIf="campoInvalido('aliquota')">Campo obrigatório</small>
              </div>

              <div class="form-group">
                <label for="valorFaturado">Valor Faturado</label>
                <input id="valorFaturado" formControlName="valorFaturado" />
                <small *ngIf="campoInvalido('valorFaturado')">Campo obrigatório</small>
              </div>

              <div class="form-group">
                <label for="valorDeducao">Valor Dedução</label>
                <input id="valorDeducao" formControlName="valorDeducao" />
                <small *ngIf="campoInvalido('valorDeducao')">Campo obrigatório</small>
              </div>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="step === 3">
          <div class="form-card">
            <div class="form-grid">
              <div class="form-group">
                <label for="baseCalculo">Base de Cálculo</label>
                <input id="baseCalculo" formControlName="baseCalculo" readonly />
              </div>

              <div class="form-group">
                <label for="valorIssqn">Valor ISSQN</label>
                <input id="valorIssqn" formControlName="valorIssqn" readonly />
              </div>
            </div>
          </div>
        </ng-container>

        <div class="form-actions">
          <button type="button" (click)="prevStep()" *ngIf="step > 1">Voltar</button>
          <button type="button" (click)="nextStep()" *ngIf="step < 3">Próximo</button>
          <button type="submit" *ngIf="step === 3">Salvar</button>
        </div>
      </form>

      <!-- <pre>{{ form.value | json }}</pre> -->
    </div>

  `,
  styles: [`
    :host {
      display: block;
      padding: 16px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9fafb;
      min-height: 100vh;
    }

    .form-container {
      max-width: 600px;
      margin: 32px auto;
      padding: 24px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    h2 {
      text-align: center;
      margin-bottom: 24px;
      font-size: 1.8rem;
      color: #333;
    }

    .form-card {
      background-color: #f9f9f9;
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 24px;
      border: 1px solid #ddd;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .form-group label {
      margin-bottom: 6px;
      font-weight: 600;
    }

    .form-group input {
      padding: 10px;
      font-size: 16px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    .form-group input:read-only {
      background-color: #e9e9e9;
    }

    .form-group small {
      color: red;
      font-size: 12px;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
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

    @media (min-width: 500px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
    }

    button {
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      background-color: #1976d2;
      color: white;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #125a9c;
    }
    
  `]
})
export class IncluirCreditosComponent {
  form: FormGroup;
  step = 1;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      
      dataConstituicao: ['', Validators.required],
      valorIssqn: [null, [Validators.required, Validators.min(0)]],
      tipoCredito: ['ISS'],
      simplesNacional: [false],
      aliquota: [null, [Validators.required, Validators.min(0)]],
      valorFaturado: [null, [Validators.required, Validators.min(0)]],
      valorDeducao: [null, [Validators.required, Validators.min(0)]],
      baseCalculo: [null, Validators.required]
    });

    this.form.get('valorFaturado')?.valueChanges.subscribe(() => this.atualizarBaseCalculo());
    this.form.get('valorDeducao')?.valueChanges.subscribe(() => this.atualizarBaseCalculo());
    this.form.get('aliquota')?.valueChanges.subscribe(() => this.atualizarISS());
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.touched && control.invalid);
  }

  validStep(step: number): boolean {
    if (step === 1) {
      return !!this.form.get('dataConstituicao')?.valid;
    } else if (step === 2) {
      return !!(
        this.form.get('aliquota')?.valid &&
        this.form.get('valorFaturado')?.valid &&
        this.form.get('valorDeducao')?.valid
      );
    }
    return true;
  }

  nextStep(): void {
    if (this.validStep(this.step)) {
      this.step++;
    } else {
      this.markStepTouched(this.step);
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  markStepTouched(step: number): void {
    const stepFields: Record<number, string[]> = {
      1: ['dataConstituicao'],
      2: ['aliquota', 'valorFaturado', 'valorDeducao'],
      3: []
    };

    stepFields[step].forEach(field => this.form.get(field)?.markAsTouched());
  }

  incluir(): void {
    console.log('Tentando enviar...');
    console.log(this.form.valid); // no método incluir()
    if (this.form.invalid) {
      this.markStepTouched(this.step);
      return;
    }

    const payload = {
      ...this.form.value,
      valorFaturado: this.parseMoeda(this.form.get('valorFaturado')?.value),
      valorDeducao: this.parseMoeda(this.form.get('valorDeducao')?.value),
      baseCalculo: this.form.get('baseCalculo')?.value,
      valorIssqn: this.form.get('valorIssqn')?.value
    };

    console.log(this.form.valid); // no método incluir()

    this.http.post('http://localhost:8080/api/creditos', payload).subscribe({
      next: () => {
        alert('Crédito incluído com sucesso!');
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Erro ao incluir crédito.');
      }
    });
  }

  atualizarBaseCalculo(): void {
    const bruto = this.parseMoeda(this.form.get('valorFaturado')?.value);
    const deducao = this.parseMoeda(this.form.get('valorDeducao')?.value);
    const baseCalculo = bruto - deducao;

    this.form.get('baseCalculo')?.setValue(baseCalculo, { emitEvent: false });
    this.atualizarISS();
  }

  atualizarISS(): void {
    const base = this.form.get('baseCalculo')?.value || 0;
    const aliquota = this.form.get('aliquota')?.value || 0;
    const valorIssqn = base * (aliquota / 100);
    const valorFormatado = parseFloat(valorIssqn.toFixed(2));

    this.form.get('valorIssqn')?.setValue(valorFormatado, { emitEvent: false });
  }

  private parseMoeda(valor: string | number): number {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;

    const limpo = valor.replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
