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
  templateUrl: './consulta-creditos.component.html',
  styleUrls: ['./consulta-creditos.component.css']
})
export class ConsultaCreditosComponent implements OnInit {
  form: FormGroup;
  filtroForm: FormGroup;
  creditos: any[] = [];
  carregando = false;
  resultadoVazio = false;
  creditoSelecionado: any = null;
  mostrarFiltro = false;

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

    this.filtroForm = this.fb.group({
      valorMin: [''],
      valorMax: ['']
    });
  }

  ngOnInit(): void { }

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

  visualizarCredito(numeroCredito: string): void {
    this.router.navigate(['/creditos', numeroCredito]);
  }

  private iniciarBusca(): void {
    this.creditos = [];
    this.resultadoVazio = false;
    this.carregando = true;
  }

  selecionarCredito(credito: any): void {
    this.creditoSelecionado = credito;
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

  filtrarPorValorFaturado(): void {
    const { valorMin, valorMax } = this.filtroForm.value;
    this.iniciarBusca();

    this.creditoService.filtrarPorValorFaturado(valorMin, valorMax).subscribe({
      next: (cs) => {
        this.creditos = cs;
        this.resultadoVazio = cs.length === 0;
      },
      error: () => this.resultadoVazio = true,
      complete: () => this.carregando = false
    });
  }

  limparFiltro(): void {
    this.filtroForm.reset();
    this.listarTodos();
  }
}
