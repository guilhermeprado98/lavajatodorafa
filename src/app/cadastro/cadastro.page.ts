import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment'; // Add this import

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  celular: string = '';
  tipo: string = '';

  constructor(private router: Router) {}

  cadastrar() {
    if (this.senha !== this.confirmarSenha) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'As senhas não coincidem.',
        customClass: {
          popup: 'swal-custom-popup',
        },
      });
      return;
    }
    const dados = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      celular: this.celular,
      tipo: this.tipo,
    };

    fetch(`${environment.apiUrl}/services/usuarios.php`, { // Update the URL to use environment.apiUrl
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    })
      .then(response => response.json())
      .then(res => {
        if (res.sucesso) {
          Swal.fire({
            icon: 'success',
            title: 'Cadastro realizado com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/login']);
        } else {
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
      .catch(err => {
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

  formatPhone(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 0) {
      input = `(${input.substring(0, 2)}) ${input.substring(2, 7)}-${input.substring(7, 11)}`;
    }
    event.target.value = input;
  }
}
