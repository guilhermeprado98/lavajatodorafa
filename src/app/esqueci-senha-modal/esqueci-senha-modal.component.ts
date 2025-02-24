import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-esqueci-senha-modal',
  templateUrl: './esqueci-senha-modal.component.html',
  styleUrls: ['./esqueci-senha-modal.component.scss'],
})
export class EsqueciSenhaModalComponent {
  email: string = '';
  codigo: string = '';
  novaSenha: string = '';
  codigoEnviado: boolean = false; // Variável para controlar a exibição do código

  constructor(private modalController: ModalController) {}

  enviarCodigo() {
    if (!this.email) {
      Swal.fire('Por favor, insira um e-mail!', '', 'warning');
      return;
    }

    fetch(`${environment.apiUrl}/services/recuperar-senha.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.sucesso) {
          Swal.fire('Código enviado com sucesso!', 'Verifique seu e-mail.', 'success');
          this.codigoEnviado = true; // Marca que o código foi enviado
        } else {
          Swal.fire('Erro', 'Não encontramos esse e-mail em nosso sistema.', 'error');
        }
      })
      .catch((error) => {
        Swal.fire('Erro', 'Ocorreu um erro ao tentar recuperar a senha.', 'error');
      });
  }

  validarCodigo() {
    // Lógica de validação do código
    if (this.codigo) {
      fetch(`${environment.apiUrl}/services/validar-codigo.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, codigo: this.codigo }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.sucesso) {
            Swal.fire('Código validado!', 'Agora você pode definir sua nova senha.', 'success');
          } else {
            Swal.fire('Erro', 'Código inválido!', 'error');
          }
        })
        .catch((error) => {
          Swal.fire('Erro', 'Erro ao validar o código.', 'error');
        });
    } else {
      Swal.fire('Por favor, insira o código!', '', 'warning');
    }
  }

  definirSenha() {
    if (!this.novaSenha) {
      Swal.fire('Por favor, insira uma nova senha!', '', 'warning');
      return;
    }

    fetch(`${environment.apiUrl}/services/definir-nova-senha.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email, novaSenha: this.novaSenha }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.sucesso) {
          Swal.fire('Senha alterada com sucesso!', '', 'success');
          this.fecharModal();
        } else {
          Swal.fire('Erro', 'Não foi possível alterar a senha.', 'error');
        }
      })
      .catch((error) => {
        Swal.fire('Erro', 'Erro ao alterar a senha.', 'error');
      });
  }

  fecharModal() {
    this.modalController.dismiss();
  }
}
