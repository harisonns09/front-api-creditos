import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {
  private readonly baseUrl = `${environment.apiUrl}/api/creditos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  buscarPorNumeroCredito(numero: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/credito/${numero}`);
  }

  buscarPorNumeroNfse(numero: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${numero}`);
  }

  deletarPorNumeroCredito(numeroCredito: string) {
  return this.http.delete(`${this.baseUrl}/credito/${numeroCredito}`, { responseType: 'text' });
}
}
