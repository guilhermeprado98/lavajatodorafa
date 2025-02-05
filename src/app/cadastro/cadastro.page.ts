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
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;

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
      tipo: 'cliente',
      operacao: 'add',
    };
    console.log('dados',JSON.stringify(dados));
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
          console.log('res',res);
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
            title: 'Erro ao cadastrar usuário',
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
          title: 'Erro ao cadastrar usuário',
          text: err.message || 'Algo deu errado. Tente novamente mais tarde.',
          customClass: {
            popup: 'swal-custom-popup',
          },
        });
      });
  }

  formatPhone(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (input.length > 11) {
      input = input.substring(0, 11); // Limita a 11 dígitos
    }

    let formatted = '';
    if (input.length > 0) {
      formatted = `(${input.substring(0, 2)}) `;
      if (input.length >= 7) {
        formatted += `${input.substring(2, 7)}-${input.substring(7, 11)}`;
      } else {
        formatted += input.substring(2);
      }
    }

    this.celular = formatted; // Atualiza o modelo corretamente
  }

  toggleSenha(tipo: string) {
    if (tipo === 'senha') {
      this.mostrarSenha = !this.mostrarSenha;
    } else if (tipo === 'confirmarSenha') {
      this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
    }
  }
}
