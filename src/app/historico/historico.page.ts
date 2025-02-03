import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {
  tipoUsuario: string = '';
  clienteId: number | null = null;
  movimentacoes: any[] = [];
  movimentacoesFiltradas: any[] = [];
  historicoPaginado: any[] = [];
  paginaAtual: number = 0;
  itensPorPagina: number = 10;
  dataInicial: string = '';
  dataFinal: string = '';
  nomeClienteFiltro: string = '';

  async ngOnInit() {
    const usuario = localStorage.getItem('usuario');
    const usuarioParse = usuario ? JSON.parse(usuario) : null;

    if (usuarioParse) {
      this.tipoUsuario = usuarioParse.tipo;
      this.clienteId = usuarioParse.id;
    }

    await this.carregarHistorico();
  }

  limparFiltros() {
    this.nomeClienteFiltro = '';
    this.dataInicial = '';
    this.dataFinal = '';
    this.movimentacoesFiltradas = [...this.movimentacoes];
    this.paginaAtual = 0;
    this.atualizarPagina();
  }

  async carregarHistorico() {
    try {
      const response = await fetch(`${environment.apiUrl}/services/historico.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoUsuario: this.tipoUsuario,
          cliente_id: this.clienteId,
        }),
      });

      const resultado = await response.json();
      if (resultado.sucesso) {
        this.movimentacoes = resultado.movimentacoes;
        this.movimentacoesFiltradas = [...this.movimentacoes];
        this.paginaAtual = 0;
        this.atualizarPagina();
      } else {
        console.error('Erro ao carregar movimentações:', resultado.mensagem);
      }
    } catch (error) {
      console.error('Erro ao se comunicar com a API:', error);
    }
  }

  aplicarFiltros() {
    this.movimentacoesFiltradas = this.movimentacoes.filter((movimentacao) => {
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

    this.paginaAtual = 0;
    this.atualizarPagina();
  }

  atualizarPagina() {

    const inicio = this.paginaAtual * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.historicoPaginado = this.movimentacoesFiltradas.slice(inicio, fim);
  }

  temMaisPaginas(): boolean {
    return (this.paginaAtual + 1) * this.itensPorPagina < this.movimentacoesFiltradas.length;
  }

  mudarPagina(pagina: number) {
    if (pagina >= 0 && pagina * this.itensPorPagina < this.movimentacoesFiltradas.length) {
      this.paginaAtual = pagina;
      this.atualizarPagina();
    }
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

  removerHora(data: Date): Date {
    const novaData = new Date(data);
    novaData.setUTCHours(0, 0, 0, 0);
    return novaData;
  }

  stringParaData(data: string): Date {
    const partes = data.split('/');
    return new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  }
}
