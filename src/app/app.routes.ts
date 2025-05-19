// import { Routes } from '@angular/router';
// export const routes: Routes = [];

import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ConsultaCreditosComponent } from './consulta-creditos/consulta-creditos.component';
import { IncluirCreditosComponent } from './incluir-creditos/incluir-creditos.component';
import { DetalhesCreditoComponent } from './detalhes-credito/detalhes-credito.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'consulta', component: ConsultaCreditosComponent },
  { path: 'incluir', component: IncluirCreditosComponent },
  { path: 'creditos/:numeroCredito', component: DetalhesCreditoComponent }, // substitua com o nome correto do seu componente de detalhes
  { path: '**', redirectTo: '' },
  
];