import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {
  nome: string = '';
  email: string = '';
  senha: string = '';
  celular: string = '';
  tipo: string = '';

  constructor(private router: Router) {}

  cadastrar() {
    const dados = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      celular: this.celular,
      tipo: this.tipo,
    };

    fetch('http://localhost/lavajatodorafa-backend/api/services/usuarios.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    })
      .then(response => response.json())
      .then(res => {
        if (res.sucesso) {
          alert('Usuário cadastrado com sucesso!');
          this.router.navigate(['/login']);
        } else {
          alert('Erro ao cadastrar: ' + res.mensagem);
        }
      })
      .catch(err => {
        console.error('Erro ao conectar:', err);
      });
  }

  formatPhone(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 0) {
      input = `(${input.substring(0, 2)}) ${input.substring(2, 7)}-${input.substring(7, 11)}`;
    }
    event.target.value = input;
  }
}
