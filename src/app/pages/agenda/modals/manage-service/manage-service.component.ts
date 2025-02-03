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
  @Input() agendamento: any = null;
  @Input() dadosUsuario: string = localStorage.getItem('usuario') || '';
  dataMinima = new Date().toISOString().split('T')[0];
  horariosDisponiveis: string[] = [];
  listaServicos: Array<any> = [];
  listaClientes: Array<any> = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.carregarServicos();
    this.agendamento.data = ''; // Garante que a data inicie vazia

    const UsuarioParse = this.dadosUsuario ? JSON.parse(this.dadosUsuario) : null;

    if (UsuarioParse.tipo === 'admin') {
      this.carregarClientes();
    } else {
      const usuario = localStorage.getItem('usuario');
      const cliente = usuario ? JSON.parse(usuario) : null;


      if (cliente) {
        this.listaClientes.push({
          id: cliente.id,
          nome: cliente.nome,
        });
      }
    }



    if (!this.agendamento) {
      this.agendamento = {
        id: '',
        nome: '',
        veiculo: '',
        data_horario: '',
        observacoes: '',
        servico_id: '',
        placa: '',
      };
    } else if (this.agendamento.data_horario) {

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
   * Carrega os clientes disponíveis para admin
   */
  async carregarClientes() {
    const usuario = localStorage.getItem('usuario');
    const clienteLogado = usuario ? JSON.parse(usuario) : null;

    // Inicializa listaClientes com base no tipo de usuário
    if (clienteLogado) {
      const UsuarioParse = this.dadosUsuario ? JSON.parse(this.dadosUsuario) : null;

      if (UsuarioParse.tipo === 'admin') {
        // Busca todos os clientes na API para o admin
        try {
          const response = await fetch(`${environment.apiUrl}/services/usuarios.php`);
          const data = await response.json();
          this.listaClientes = data || [];
        } catch (error) {
          console.error('Erro ao carregar clientes:', error);
        }
      }
    }
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

      if (this.operacao === 'add') {
        url = `${environment.apiUrl}/services/agendamento.php`;
        body = JSON.stringify({
          operacao: 'add',
          id_cliente: this.agendamento.cliente_id,
          veiculo: this.agendamento.veiculo,
          data_horario: this.agendamento.data_horario,
          observacoes: this.agendamento.observacoes,
          servico_id: this.agendamento.servico_id,
          placa: this.agendamento.placa,
        });
      }

      if (this.operacao === 'edit') {
        url = `${environment.apiUrl}/services/agendamento.php`;

        body = JSON.stringify({
          operacao: 'edit',
          id_cliente: this.agendamento.cliente_id,
          id: this.agendamento.id,
          veiculo: this.agendamento.veiculo,
          data_horario: this.agendamento.data_horario,
          observacoes: this.agendamento.observacoes,
          servico_id: this.agendamento.servico_id,
          placa: this.agendamento.placa,
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
        Swal.fire('Operação concluída com sucesso!', '', 'success').then(() => {
          this.modalController.dismiss({ resultado: true });
          location.reload();
        });
      } else {
        Swal.fire(resultado.mensagem, '', 'error');
      }
    } catch (error) {
      console.error('Erro durante a chamada da API', error);
      Swal.fire('Erro ao se comunicar com a API.', '', 'error');
    }
  }

  validarData() {
    if (!this.agendamento.data) return;

    const dataSelecionada = new Date(this.agendamento.data);
    const diaSemana = dataSelecionada.getDay(); // 0 = Domingo, 6 = Sábado

    if (diaSemana === 0 || diaSemana === 6) {
      if (diaSemana === 0) {
        alert("Selecione um dia útil! Domingo não é permitido.");
        this.agendamento.data = '';
        return;
      }
    }

    this.atualizarHorariosDisponiveis(diaSemana);
  }

  atualizarHorariosDisponiveis(diaSemana: number) {
    this.horariosDisponiveis = [];

    let horaInicio = 8;
    let horaFim = diaSemana === 6 ? 12 : 17; // Sábado até 12h, outros dias até 17h

    for (let hora = horaInicio; hora <= horaFim; hora++) {
      this.horariosDisponiveis.push(`${hora.toString().padStart(2, '0')}:00`);
      if (hora !== horaFim) {
        this.horariosDisponiveis.push(`${hora.toString().padStart(2, '0')}:30`);
      }
    }
  }

}
