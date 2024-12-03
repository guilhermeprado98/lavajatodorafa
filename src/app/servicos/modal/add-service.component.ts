import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
})
export class AddServiceComponent {
  constructor(private modalController: ModalController) {}

  nome = '';
  descricao = '';
  preco = '';

  fecharModal() {
    this.modalController.dismiss();
  }

  adicionarServico() {
    const novoServico = {
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
    };
    this.modalController.dismiss(novoServico);
  }
}
