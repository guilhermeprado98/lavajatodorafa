import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { ModalController,LoadingController  } from '@ionic/angular';

@Component({
  selector: 'app-esqueci-senha-modal',
  templateUrl: './esqueci-senha-modal.component.html',
  styleUrls: ['./esqueci-senha-modal.component.scss'],
})
export class EsqueciSenhaModalComponent {
  email: string = '';
  codigo: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';
  etapa: number = 1;
  carregando: boolean = false;
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false

  constructor(private modalController: ModalController, private loadingCtrl: LoadingController) {}

  async enviarCodigo() {
    if (!this.email) {
      Swal.fire('Por favor, insira um e-mail!', '', 'warning');
      return;
    }

    this.carregando = true; // Impede múltiplos cliques

    const loading = await this.loadingCtrl.create({
      message: 'Enviando código...',
      spinner: 'crescent', // Estilo do spinner
    });

    await loading.present();

    fetch(`${environment.apiUrl}/services/recuperar-senha.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.sucesso) {
          Swal.fire('Código enviado com sucesso!', 'Verifique seu e-mail.', 'success');
          this.etapa = 2; // Avança para a próxima etapa
        } else {
          Swal.fire('Erro', 'Não encontramos esse e-mail em nosso sistema.', 'error');
        }
      })
      .catch(() => {
        Swal.fire('Erro', 'Ocorreu um erro ao tentar recuperar a senha.', 'error');
      })
      .finally(() => {
        loading.dismiss(); // Fecha o loading
        this.carregando = false; // Permite clicar novamente
      });
  }

  toggleSenhaVisibilidade() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmarSenhaVisibilidade() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }



  validarCodigo() {
    if (!this.codigo) {
      Swal.fire('Por favor, insira o código!', '', 'warning');
      return;
    }

    fetch(`${environment.apiUrl}/services/validar-codigo.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email, codigo: this.codigo }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.sucesso) {
          Swal.fire('Código validado!', 'Agora você pode definir sua nova senha.', 'success');
          this.etapa = 3; // Avança para a etapa de redefinição de senha
        } else {
          Swal.fire('Erro', 'Código inválido!', 'error');
        }
      })
      .catch(() => {
        Swal.fire('Erro', 'Erro ao validar o código.', 'error');
      });
  }

  definirNovaSenha() {
    if (!this.novaSenha || !this.confirmarSenha) {
      Swal.fire('Por favor, preencha todos os campos!', '', 'warning');
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      Swal.fire('As senhas não coincidem!', '', 'error');
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
      .catch(() => {
        Swal.fire('Erro', 'Erro ao alterar a senha.', 'error');
      });
  }

  fecharModal() {
    this.modalController.dismiss();
  }
}
