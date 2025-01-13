import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { ManageServiceAgendaComponent } from '../pages/agenda/modals/manage-service/manage-service.component';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage {
  agendamentos: any[] = [];
  agendamentosPaginados: any[] = [];
  mostrarForm: boolean = false;
  tipoUsuario: string = '';
  itensPorPagina = 10;
  paginaAtual = 0;


  novoAgendamento = {
    nome_cliente: '',
    veiculo: '',
    data_horario: '',
    observacoes: '',
    placa: '',
  };

  constructor(private http: HttpClient,private modalController: ModalController) {

  const dadosUsuarios = localStorage.getItem('usuario');
  if (dadosUsuarios) {
    try {
      const usuarios = JSON.parse(dadosUsuarios);
      this.tipoUsuario = usuarios.tipo || 'cliente';
    } catch (error) {
      this.tipoUsuario = 'cliente';
    }
  } else {
    this.tipoUsuario = 'cliente';
  }
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.http.get(`${environment.apiUrl}/services/agendamento.php`).subscribe(
      (res: any) => {
        // Se for um cliente, filtra apenas os agendamentos do próprio cliente
        if (this.tipoUsuario === 'cliente') {
          const dadosUsuarios = localStorage.getItem('usuario');
          const usuario = dadosUsuarios ? JSON.parse(dadosUsuarios) : null;

          this.agendamentos = res.filter((agendamento: any) => agendamento.cliente_id === usuario.id); // Ajuste conforme a lógica
        } else {
          // Se for admin, mostra todos os agendamentos
          this.agendamentos = res;
        }
        this.atualizarListaPaginada();
      },
      err => console.error('Erro ao carregar agendamentos:', err)
    );
  }


  toggleForm() {
    this.mostrarForm = !this.mostrarForm; // Alterna a visibilidade do formulário
  }

  async abrirModalAdicionarAgenda() {
    const modal = await this.modalController.create({
      component: ManageServiceAgendaComponent,
      componentProps: {
        operacao: 'add',
        servico: {},
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result?.data?.resultado) {
        this.carregarAgendamentos();
      }
    });

    return await modal.present();
  }

  editarAgendamento(agendamento: any) {
    // Exemplo de lógica de edição: popula os campos do formulário com os dados selecionados.
    this.novoAgendamento = { ...agendamento };
  }


  resetarFormulario() {
    this.novoAgendamento = {
      nome_cliente: '',
      veiculo: '',
      data_horario: '',
      observacoes: '',
      placa: '',
    };
  }


  async abrirModalEditarAgenda(agendamento: any) {
    const modal = await this.modalController.create({
      component: ManageServiceAgendaComponent,
      componentProps: {
        operacao: 'edit',
        agendamento,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result?.data?.resultado) {
        this.carregarAgendamentos();
      }
    });

    return await modal.present();
  }

  async abrirModalRemoverAgenda(agendamento: any) {
    console.log('agendamento',agendamento);
    const modal = await this.modalController.create({
      component: ManageServiceAgendaComponent,
      componentProps: {
        operacao: 'delete',
        agendamento,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result?.data?.resultado) {
        this.carregarAgendamentos();
      }
    });

    return await modal.present();
  }


  atualizarListaPaginada() {
    const inicio = this.paginaAtual * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.agendamentosPaginados = this.agendamentos.slice(inicio, fim);
  }

  mudarPagina(pagina: number) {
    if (pagina >= 0 && pagina < Math.ceil(this.agendamentos.length / this.itensPorPagina)) {
      this.paginaAtual = pagina;
      this.atualizarListaPaginada();
    }
  }

  temMaisPaginas() {
    return this.paginaAtual < Math.ceil(this.agendamentos.length / this.itensPorPagina) - 1;
  }
}
