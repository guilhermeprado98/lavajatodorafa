import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddServiceComponent } from './modal/add-service.component';
import { environment } from '../../environments/environment'; // Import environment

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  servicos: any[] = [];
  tipoUsuario: string = ''; // 'admin' ou 'cliente'

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.tipoUsuario = localStorage.getItem('tipo') || 'cliente'; // Mock de autenticação
    this.carregarServicos();
  }

  carregarServicos() {
    fetch(`${environment.apiUrl}/services/listarServicos.php`)
      .then((response) => response.json())
      .then((data) => {
        this.servicos = data;
      })
      .catch((error) => console.error('Erro ao carregar serviços:', error));
  }

  async abrirModalAdicionarServico() {
    const modal = await this.modalController.create({
      component: AddServiceComponent,
    });
    modal.onDidDismiss().then(() => this.carregarServicos());
    return await modal.present();
  }
}
