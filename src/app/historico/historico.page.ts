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
  historicoPaginado: any[] = [];
  paginaAtual: number = 0;
  itensPorPagina: number = 10;

  async ngOnInit() {
    const usuario = localStorage.getItem('usuario');
    const usuarioParse = usuario ? JSON.parse(usuario) : null;


    if (usuarioParse) {
      this.tipoUsuario = usuarioParse.tipo;
      this.clienteId = usuarioParse.id;
    }

    await this.carregarHistorico();
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
      console.log('resultado',resultado);
      if (resultado.sucesso) {
        this.movimentacoes = resultado.movimentacoes;
        this.atualizarPagina(); // Atualiza os itens exibidos após carregar os dados
      } else {
        console.error('Erro ao carregar movimentações:', resultado.mensagem);
      }
    } catch (error) {
      console.error('Erro ao se comunicar com a API:', error);
    }
  }

  /**
   * Atualiza os itens exibidos com base na página atual.
   */
  atualizarPagina() {
    console.log('Movimentações antes da paginação:', this.movimentacoes);
  const inicio = this.paginaAtual * this.itensPorPagina;
  const fim = inicio + this.itensPorPagina;
  this.historicoPaginado = this.movimentacoes.slice(inicio, fim);
  console.log('Itens da página atual:', this.historicoPaginado);
  }

  /**
   * Verifica se existem mais páginas após a atual.
   * @returns boolean
   */
  temMaisPaginas(): boolean {
    return (this.paginaAtual + 1) * this.itensPorPagina < this.movimentacoes.length;
  }

  /**
   * Navega para outra página.
   * @param pagina Número da nova página
   */
  mudarPagina(pagina: number) {
    if (pagina >= 0 && pagina * this.itensPorPagina < this.movimentacoes.length) {
      this.paginaAtual = pagina;
      this.atualizarPagina();
    }
  }
}
