import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  senha: string = '';

  constructor(private router: Router) {}


  ngOnInit() {
    // Limpa o localStorage ao acessar a página de login
    localStorage.removeItem('usuario');
  }

  login() {
    const credenciais = { email: this.email, senha: this.senha };

    fetch(`${environment.apiUrl}/services/login.php`, {
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
          // Armazenando dados do usuário no localStorage
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          Swal.fire({
            icon: 'success',
            title: 'Login realizado com sucesso!',
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            this.router.navigate(['/home']).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 50); // 3 segundos
            });
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro no login',
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
