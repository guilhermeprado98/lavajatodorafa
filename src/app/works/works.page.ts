import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ManageServiceComponent } from '../pages/works/modals/manage-service/manage-service.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-works',
  templateUrl: './works.page.html',
  styleUrls: ['./works.page.scss'],
})
export class WorksPage implements OnInit {
  servicos: any[] = [];
  tipoUsuario: string = '';
  itensPorPagina = 2;
  paginaAtual = 0;
  servicosPaginados: any[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    const dadosUsuarios = localStorage.getItem('usuario');
    if (dadosUsuarios) {
      try {
        const usuarios = JSON.parse(dadosUsuarios);
        this.tipoUsuario = usuarios.tipo;
        console.log('Tipo de usuário carregado:', this.tipoUsuario);
      } catch (error) {
        console.error('Erro ao processar dados do localStorage:', error);
        this.tipoUsuario = 'cliente';
      }
    } else {
      this.tipoUsuario = 'cliente';
    }

    this.carregarServicos();
  }

  carregarServicos() {
    fetch(`${environment.apiUrl}/services/servicos.php`)
      .then(response => response.json())
      .then(data => {
        this.servicos = data;
        this.atualizarListaPaginada(); // Atualiza a lista paginada APÓS os dados serem carregados
      })
      .catch(error => {
        console.error('Erro ao carregar serviços:', error);
      });
  }

  async abrirModalAdicionarServico() {
    const modal = await this.modalController.create({
      component: ManageServiceComponent,
      componentProps: {
        operacao: 'add',
        servico: {},
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result?.data?.resultado) {
        this.carregarServicos();
      }
    });

    return await modal.present();
  }

  async abrirModalEditarServico(servico: any) {
    const modal = await this.modalController.create({
      component: ManageServiceComponent,
      componentProps: {
        operacao: 'edit',
        servico,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result?.data?.resultado) {
        this.carregarServicos();
      }
    });

    return await modal.present();
  }

  async abrirModalRemoverServico(servico: any) {
    const modal = await this.modalController.create({
      component: ManageServiceComponent,
      componentProps: {
        operacao: 'delete',
        servico,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result?.data?.resultado) {
        this.carregarServicos();
      }
    });

    return await modal.present();
  }

  atualizarListaPaginada() {
    const inicio = this.paginaAtual * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.servicosPaginados = this.servicos.slice(inicio, fim);
  }

  mudarPagina(pagina: number) {
    if (pagina >= 0 && pagina < Math.ceil(this.servicos.length / this.itensPorPagina)) {
      this.paginaAtual = pagina;
      this.atualizarListaPaginada();
    }
  }

  temMaisPaginas() {
    return this.paginaAtual < Math.ceil(this.servicos.length / this.itensPorPagina) - 1;
  }
}
