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
  itensPorPagina: number = 1;
  totalPaginas: number = 1;

  constructor(
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.carregarMovimentacoes();
    this.carregarAgendamentos(); // Novo método
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

  // Atualiza os itens exibidos com base na página atual
  mostrarPagina() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.movimentacoesVisiveis = this.movimentacoes.slice(inicio, fim);
  }

  // Navegação entre páginas
  mudarPagina(numeroPagina: number) {
    if (numeroPagina >= 1 && numeroPagina <= this.totalPaginas) {
      this.paginaAtual = numeroPagina;
      this.mostrarPagina();
    }
  }

  async carregarAgendamentos() {
    try {
      const url = `${environment.apiUrl}/services/agendamento.php`;
      const response = await fetch(url);
      this.agendamentos = await response.json() || [];
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  }

  onAgendamentoChange() {
    const agendamento = this.agendamentos.find(a => a.id === this.idAgendamentoSelecionado);
    if (agendamento) {
      this.veiculo = agendamento.veiculo; // Preenche o veículo do agendamento
      this.observacoes = agendamento.observacoes; // Preenche as observações do agendamento
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
