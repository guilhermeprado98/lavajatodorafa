import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { ModalController } from '@ionic/angular';
import { EsqueciSenhaModalComponent } from '../esqueci-senha-modal/esqueci-senha-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  senha: string = '';
  mostrarSenha = false;


  constructor(private router: Router,private modalController: ModalController) { }


  ngOnInit() {

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

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  async abrirModalEsqueciSenha() {
    const modal = await this.modalController.create({
      component: EsqueciSenhaModalComponent, // Criar esse componente de modal
    });

    return await modal.present();
  }


}
