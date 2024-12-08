import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-service',
  templateUrl: './manage-service.component.html',
  styleUrls: ['./manage-service.component.scss'],
})
export class ManageServiceComponent {
  @Input() operacao: 'add' | 'edit' | 'delete' = 'add';
  @Input() servico: any = { id: '', nome: '', preco: '' };

  constructor(private modalController: ModalController) { }

  // Fecha o modal
  fecharModal() {
    this.modalController.dismiss();
  }

  formatPrice() {
    if (this.servico.preco) {
      this.servico.preco = parseFloat(this.servico.preco).toFixed(2);
    }
  }

  async salvar() {
    try {
      let url = '';
      let method = '';
      let body = null;

      if (this.operacao === 'add') {
        url = `${environment.apiUrl}/services/servicos.php`;
        method = 'POST';
        body = JSON.stringify({
          operacao: this.operacao,
          nome: this.servico.nome,
          descricao: this.servico.descricao,
          preco: this.servico.preco,
        });
      }

      if (this.operacao === 'edit') {
        url = `${environment.apiUrl}/services/servicos.php`;
        method = 'POST';
        body = JSON.stringify({
          operacao: this.operacao,
          id: this.servico.id, // Apenas para edição
          nome: this.servico.nome,
          descricao: this.servico.descricao,
          preco: this.servico.preco,
        });
      }

      if (this.operacao === 'delete') {
        url = `${environment.apiUrl}/services/servicos.php`;
        method = 'POST';
        body = JSON.stringify({
          operacao: this.operacao,
          id: this.servico.id,
        });
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const resultado = await response.json();

      console.log('Resultado da Operação:', resultado);

      if (resultado?.sucesso) {
        Swal.fire('Operação realizada com sucesso!', '', 'success');
        this.modalController.dismiss({ resultado: true });
      } else {
        console.error('Erro ao realizar operação.');
        Swal.fire('Erro ao realizar operação.', '', 'error');
        this.modalController.dismiss({ resultado: false });
      }
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
      Swal.fire('Erro ao chamar a API.', '', 'error');
      this.modalController.dismiss({ resultado: false });
    }
  }
}
