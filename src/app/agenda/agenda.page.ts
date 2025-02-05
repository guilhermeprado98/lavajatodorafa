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
  agendamentosFiltrados: any[] = [];
  mostrarForm: boolean = false;
  tipoUsuario: string = '';
  itensPorPagina = 10;
  paginaAtual = 0;
  dataInicial: string = '';
  dataFinal: string = '';
  nomeClienteFiltro: string = '';


  novoAgendamento = {
    nome_cliente: '',
    veiculo: '',
    data_horario: '',
    observacoes: '',
    placa: '',
  };

  constructor(private http: HttpClient, private modalController: ModalController) {

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


  limparFiltros() {
    this.nomeClienteFiltro = '';
    this.dataInicial = '';
    this.dataFinal = '';
    this.agendamentosFiltrados = [...this.agendamentos];
    this.paginaAtual = 0;
    this.atualizarPagina();
  }

  carregarAgendamentos() {
    this.http.get(`${environment.apiUrl}/services/agendamento.php`).subscribe(
      (res: any) => {


        if (this.tipoUsuario === 'cliente') {
          const dadosUsuarios = localStorage.getItem('usuario');
          const usuario = dadosUsuarios ? JSON.parse(dadosUsuarios) : null;


          this.agendamentos = res.filter((agendamento: any) => agendamento.cliente_id === usuario.id);
        } else {

          this.agendamentos = res;
        }
        this.atualizarListaPaginada();
      },
      err => console.error('Erro ao carregar agendamentos:', err)
    );
  }


  toggleForm() {
    this.mostrarForm = !this.mostrarForm;
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


  aplicarFiltros() {
    this.agendamentosFiltrados = this.agendamentos.filter((agendamento) => {

      const dataEntrada = this.removerHora(new Date(agendamento.data));
      const dataInicio = this.dataInicial ? this.removerHora(this.stringParaData(this.dataInicial)) : null;
      const dataFim = this.dataFinal ? this.removerHora(this.stringParaData(this.dataFinal)) : null;

      const filtroNome = this.nomeClienteFiltro
        ? agendamento.nome_cliente.toLowerCase().includes(this.nomeClienteFiltro.toLowerCase())
        : true;

      const filtroDataInicio = dataInicio ? dataEntrada >= dataInicio : true;
      const filtroDataFim = dataFim ? dataEntrada <= dataFim : true;

      return filtroNome && filtroDataInicio && filtroDataFim;
    });

    this.paginaAtual = 0;
    this.atualizarPagina();
  }

  atualizarPagina() {

    const inicio = this.paginaAtual * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.agendamentosPaginados = this.agendamentosFiltrados.slice(inicio, fim);
  }

  removerHora(data: Date): Date {
    const novaData = new Date(data);
    novaData.setUTCHours(0, 0, 0, 0);
    return novaData;
  }

  stringParaData(data: string): Date {
    const partes = data.split('/');
    return new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  }
  formatarDataAoDigitar(campo: 'dataInicial' | 'dataFinal', evento: any) {
    let valor = evento.target.value || '';
    valor = valor.replace(/\D/g, '');

    if (valor.length > 8) {
      valor = valor.substring(0, 8);
    }

    if (valor.length > 2 && valor.length <= 4) {
      valor = `${valor.substring(0, 2)}/${valor.substring(2)}`;
    } else if (valor.length > 4) {
      valor = `${valor.substring(0, 2)}/${valor.substring(2, 4)}/${valor.substring(4, 8)}`;
    }

    this[campo] = valor;
  }
}
