import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private apiUrl = 'http://localhost/lavajatodorafa-backend/api/';

  constructor(private http: HttpClient) {}

  listarServicos() {
    return this.http.get(`${this.apiUrl}servicos/listar.php`);
  }

  adicionarServico(servico: any) {
    return this.http.post(`${this.apiUrl}servicos/adicionar.php`, servico);
  }
}
