import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditoService } from '../services/credito.service'; // ajuste o path
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-detalhes-credito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalhes-credito.component.html',
  styleUrls: ['./detalhes-credito.component.css'],
})
export class DetalhesCreditoComponent implements OnInit {
  credito: any;

  constructor(
    private route: ActivatedRoute,
    private creditoService: CreditoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const numero = this.route.snapshot.paramMap.get('numeroCredito');
    if (numero) {
      this.creditoService.buscarPorNumeroCredito(numero).subscribe((data) => {
        this.credito = data;
      });
    }
  }

  voltar() {
    this.router.navigate(['/consulta']);
  }
}