import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-service',
  templateUrl: './manage-service.component.html',
  styleUrls: ['./manage-service.component.scss'],
})
export class ManageServiceAgendaComponent implements OnInit {
  @Input() operacao: 'add' | 'edit' | 'delete' = 'add';
  @Input() agendamento: any = null; // Recebe os dados do agendamento do componente pai

  listaServicos: Array<any> = []; // Lista para armazenar os serviços no select

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.carregarServicos();

    // Garante que o agendamento tem valores padrão no modo add
    if (!this.agendamento) {
      this.agendamento = {
        id: '',
        nome: '',
        veiculo: '',
        data_horario: '',
        observacoes: '',
        servico_id: '',
      };
    } else if (this.agendamento.data_horario) {
      // Converte para formato ISO 8601, se necessário
      setTimeout(() => {
        this.agendamento.data_horario = this.formatarParaISO(this.agendamento.data_horario);
      });
    }
  }

  /**
   * Carrega os serviços disponíveis da API para o Select
   */
  async carregarServicos() {
    fetch(`${environment.apiUrl}/services/servicos.php`)
      .then((response) => response.json())
      .then((data) => {
        this.listaServicos = data;
      })
      .catch((error) => {
        console.error('Erro ao carregar serviços:', error);
      });
  }

  /**
   * Fecha o modal sem fazer alterações
   */
  fecharModal() {
    this.modalController.dismiss();
  }

  /**
 * Converte uma string de data no formato 'YYYY-MM-DD HH:mm:ss' para ISO 8601
 * @param dataHora A data em formato 'YYYY-MM-DD HH:mm:ss'
 * @returns A data em formato ISO 8601
 */
  private formatarParaISO(dataHora: string): string {
    const [data, hora] = dataHora.split(' ');
    return `${data}T${hora}`;
  }

  /**
   * Salva os dados no backend com base na operação (add, edit ou delete)
   */
  async salvar() {
    try {
      let url = '';
      let method = 'POST';
      let body = null;

      const id_cliente = localStorage.getItem('usuario');
      const id_cliente_parse = id_cliente ? JSON.parse(id_cliente) : null;

      if (this.operacao === 'add') {
        url = `${environment.apiUrl}/services/agendamento.php`;
        body = JSON.stringify({
          operacao: 'add',
          id_cliente: id_cliente_parse['id'],
          veiculo: this.agendamento.veiculo,
          data_horario: this.agendamento.data_horario,
          observacoes: this.agendamento.observacoes,
          servico_id: this.agendamento.servico_id,
        });
      }

      if (this.operacao === 'edit') {
        url = `${environment.apiUrl}/services/agendamento.php`;


        const id_cliente = localStorage.getItem('usuario');
        const id_cliente_parse = id_cliente ? JSON.parse(id_cliente) : null;
        body = JSON.stringify({
          operacao: 'edit',
          id_cliente: id_cliente_parse['id'],
          id: this.agendamento.id,
          nome: this.agendamento.nome,
          veiculo: this.agendamento.veiculo,
          data_horario: this.agendamento.data_horario,
          observacoes: this.agendamento.observacoes,
          servico_id: this.agendamento.servico_id,
        });
      }

      if (this.operacao === 'delete') {
        url = `${environment.apiUrl}/services/agendamento.php`;
        body = JSON.stringify({
          operacao: 'delete',
          id: this.agendamento.id,
        });
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const resultado = await response.json();

      if (resultado?.sucesso) {
        Swal.fire('Operação concluída com sucesso!', '', 'success');
        this.modalController.dismiss({ resultado: true });
      } else {
        Swal.fire(resultado.mensagem, '', 'error');
      }
    } catch (error) {
      console.error('Erro durante a chamada da API', error);
      Swal.fire('Erro ao se comunicar com a API.', '', 'error');
    }
  }
}
