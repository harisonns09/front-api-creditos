import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditoService } from '../services/credito.service'; // ajuste o path
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    ) { }

    ngOnInit(): void {
        const numero = this.route.snapshot.paramMap.get('numeroCredito');
        if (numero) {
            this.creditoService.buscarPorNumeroCredito(numero).subscribe((data) => {
                this.credito = data;
            });
        }
    }

    imprimirNotaFiscal(numeroCredito: string): void {
        this.creditoService.imprimirNotaFiscal(numeroCredito).subscribe((blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `nota_fiscal_${numeroCredito}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url); // limpa o objeto da memória
        }, error => {
            console.error('Erro ao gerar nota fiscal:', error);
            // Aqui você pode exibir uma mensagem para o usuário, se quiser
        });
    }

    voltar() {
        this.router.navigate(['/consulta']);
    }
}