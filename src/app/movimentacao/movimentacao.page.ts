import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.page.html',
  styleUrls: ['./movimentacao.page.scss'],
})
export class MovimentacaoPage implements OnInit {
  movimentacoes: any[] = [];
  movimentacoesVisiveis: any[] = [];
  veiculo: string = '';
  observacoes: string = '';
  agendamentos: any[] = [];
  idAgendamentoSelecionado: number | null = null;
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 1;
  nomeClienteFiltro: string = '';
  dataInicial: string = '';
  dataFinal: string = '';
  movimentacoesFiltradas: any[] = [];

  constructor(
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.carregarMovimentacoes();
    this.carregarAgendamentos();
  }

  limparFiltros() {
    this.nomeClienteFiltro = '';
    this.dataInicial = '';
    this.dataFinal = '';
    this.mostrarPagina();
  }

  aplicarFiltros() {

    const movimentacoesFiltradas = this.movimentacoes.filter((movimentacao) => {
      const dataEntrada = this.removerHora(new Date(movimentacao.data_hora_entrada));

      const dataInicio = this.dataInicial ? this.removerHora(this.stringParaData(this.dataInicial)) : null;

      const dataFim = this.dataFinal ? this.removerHora(this.stringParaData(this.dataFinal)) : null;


      const filtroNome = this.nomeClienteFiltro
        ? movimentacao.nome_cliente.toLowerCase().includes(this.nomeClienteFiltro.toLowerCase())
        : true;

      const filtroDataInicio = dataInicio ? dataEntrada >= dataInicio : true;
      const filtroDataFim = dataFim ? dataEntrada <= dataFim : true;

      return filtroNome && filtroDataInicio && filtroDataFim;
    });

    this.movimentacoesVisiveis = movimentacoesFiltradas;
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

  async carregarMovimentacoes() {
    try {
      const url = `${environment.apiUrl}/services/movimentacoes.php`;
      const response = await fetch(url);
      this.movimentacoes = await response.json() || [];
      this.totalPaginas = Math.ceil(this.movimentacoes.length / this.itensPorPagina);
      this.mostrarPagina();
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  }


  mostrarPagina() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.movimentacoesVisiveis = this.movimentacoes.slice(inicio, fim);
  }


  mudarPagina(numeroPagina: number) {
    if (numeroPagina >= 1 && numeroPagina <= this.totalPaginas) {
      this.paginaAtual = numeroPagina;
      this.mostrarPagina();
    }
  }

  async carregarAgendamentos() {
    try {
      const response = await fetch(`${environment.apiUrl}/services/agendamento.php`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const resultado = await response.json();

      if (Array.isArray(resultado) && resultado.length > 0) {

        this.agendamentos = resultado.filter((agendamento: any) => agendamento.status !== 'concluido');
      } else {
        console.error('Erro ao carregar agendamentos: Nenhum agendamento encontrado');
      }
    } catch (error) {
      console.error('Erro ao se comunicar com a API:', error);
    }
  }


  onAgendamentoChange() {
    const agendamento = this.agendamentos.find(a => a.id === this.idAgendamentoSelecionado);
    if (agendamento) {
      this.veiculo = agendamento.veiculo;
      this.observacoes = agendamento.observacoes;
    } else {
      this.veiculo = '';
      this.observacoes = '';
    }
  }


  async registrarEntrada() {
    if (!this.veiculo || !this.idAgendamentoSelecionado) {
      this.mostrarToast('Informe o veículo e selecione um agendamento.', 'danger');
      return;
    }


    try {

      const dados = {
        operacao: 'entrada',
        veiculo: this.veiculo,
        observacoes: this.observacoes,
        id_agendamento: this.idAgendamentoSelecionado, // Novo dado enviado
      };
      const url = `${environment.apiUrl}/services/movimentacoes.php`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      const result = await response.json();
      if (result.sucesso) {
        Swal.fire({
          title: 'Sucesso!',
          text: result.mensagem,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            // Executar as ações ao clicar em "OK"
            this.veiculo = '';
            this.observacoes = '';
            this.idAgendamentoSelecionado = null;
            this.carregarMovimentacoes();
          }
        });
      } else {
        Swal.fire({
          title: 'Erro!',
          text: result.mensagem,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Erro ao registrar entrada:', error);
    }
  }

  async registrarSaida(id: number) {
    const result = await Swal.fire({
      title: 'Confirmar Saída',
      text: 'Tem certeza que deseja registrar a saída deste veículo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const dados = { operacao: 'saida', id };
        const url = `${environment.apiUrl}/services/movimentacoes.php`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });
        const result = await response.json();
        this.mostrarToast(result.mensagem, result.sucesso ? 'success' : 'danger');
        if (result.sucesso) {
          this.carregarMovimentacoes();
          setTimeout(() => {
            location.reload();
          }, 5);
        }
      } catch (error) {
        console.error('Erro ao registrar saída:', error);
      }
    }
  }

  async mostrarToast(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      color: cor,
    });
    toast.present();
  }
}
