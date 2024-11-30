import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  logout() {
    // Realiza ações necessárias para limpar dados do usuário (opcional)
    localStorage.clear(); // Exemplo: limpar token ou informações de sessão
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}
