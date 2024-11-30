import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  senha: string = '';

  constructor(private router: Router) {}

  login() {
    const credenciais = { email: this.email, senha: this.senha };

    fetch('http://localhost/lavajatodorafa-backend/api/services/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credenciais),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res) => {
        if (res.sucesso) {
          Swal.fire({
            icon: 'success',
            title: 'Login realizado com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/home']);
        } else {
          console.log('res',res);
          Swal.fire({
            icon: 'error',
            title: 'Erro de conexão',
            text: res.mensagem,
            customClass: {
              popup: 'swal-custom-popup',
            },
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro de conexão',
          text: err.message || 'Algo deu errado. Tente novamente mais tarde.',
          customClass: {
            popup: 'swal-custom-popup',
          },
        });
      });
  }
}
