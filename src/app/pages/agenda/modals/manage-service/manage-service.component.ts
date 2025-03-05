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
  @Input() servico: any = null;
  dataMinima = new Date().toISOString().split('T')[0];
  horariosDisponiveis: string[] = [];
  listaServicos: Array<any> = [];
  listaClientes: Array<any> = [];
  tipoUsuario = JSON.parse(this.dadosUsuario).tipo;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.carregarServicos();

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
        cliente_id: '',
        veiculo: '',
        data: '',
        observacoes: '',
        servico_id: '',
        placa: '',
        endereco: '',
        delivery: '',
      };
    } else if (this.agendamento.data) {

      setTimeout(() => {
        this.agendamento.data = this.formatarParaISO(this.agendamento.data);
      });
    }
    if (this.servico) {
      this.agendamento.servico_id = this.servico.id;
    }


    this.atualizarHorariosDisponiveis(new Date().getDay());
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

  verificarDelivery(valor: boolean) {
    this.agendamento.delivery = valor;
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



    this.agendamento.data = this.agendamento.data.split('T')[0];
    try {
      let url = '';
      let method = 'POST';
      let body = null;
      let idcliente = null;
      console.log('this.tipoUsuario', this.tipoUsuario);
      if (this.tipoUsuario === 'cliente') {
        idcliente = JSON.parse(this.dadosUsuario).id;
      } else {
        idcliente = this.agendamento.cliente_id;
      }

      if (this.operacao === 'add') {
        const nomesAmigaveis: { [key: string]: string } = {
          veiculo: "Veículo",
          placa: "Placa",
          data: "Data",
          observacoes: "Observações",
          servico_id: "Serviço",
          horario: "Horário"
        };

        const camposObrigatorios = Object.keys(nomesAmigaveis);

        for (const campo of camposObrigatorios) {
          if (!this.agendamento[campo]) {
            Swal.fire(`O campo "${nomesAmigaveis[campo]}" é obrigatório.`, "", "warning");
            return;
          }
        }

        url = `${environment.apiUrl}/services/agendamento.php`;
        body = JSON.stringify({
          operacao: 'add',
          cliente_id: idcliente,
          veiculo: this.agendamento.veiculo,
          data: this.agendamento.data,
          observacoes: this.agendamento.observacoes,
          servico_id: this.agendamento.servico_id,
          placa: this.agendamento.placa,
          delivery: this.agendamento.delivery,
          endereco: this.agendamento.endereco,
          horario: this.agendamento.horario,
        });
      }

      if (this.operacao === 'edit') {
        url = `${environment.apiUrl}/services/agendamento.php`;

        body = JSON.stringify({
          operacao: 'edit',
          id_cliente: this.agendamento.cliente_id,
          id: this.agendamento.id,
          veiculo: this.agendamento.veiculo,
          data: this.agendamento.data,
          observacoes: this.agendamento.observacoes,
          servico_id: this.agendamento.servico_id,
          placa: this.agendamento.placa,
          delivery: this.agendamento.delivery,
          endereco: this.agendamento.endereco,
          horario: this.agendamento.horario,
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
      console.log('resultado', resultado);
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

  isSunday() {
    return new Date(this.agendamento.data).getDay() === 0;  // Retorna true se for domingo
  }

  validarData() {
    if (!this.agendamento.data) return;

    const dataSelecionada = new Date(this.agendamento.data);
    const diaSemana = dataSelecionada.getDay(); // 0 = Domingo, 6 = Sábado

    if (diaSemana === 0) {
      Swal.fire("Selecione um dia útil! Domingo não é permitido.", '', 'error');
      this.agendamento.data = '';
      return;
    }

    this.atualizarHorariosDisponiveis(diaSemana);  // Atualiza horários ao selecionar a data
  }

  atualizarHorariosDisponiveis(diaSemana: number) {
    this.horariosDisponiveis = [];
    let horaInicio = 8;
    let horaFim = diaSemana === 6 ? 12 : 17; // Sábado até 12h, outros dias até 17h

    const agora = new Date();
    const dataSelecionada = new Date(this.agendamento.data);
    const dataString = dataSelecionada.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const horarioAtual = agora.getHours();
    const minutosAtuais = agora.getMinutes();

    // Se for hoje, garantir que só aparecem horários futuros
    if (dataSelecionada.toDateString() === agora.toDateString()) {
      if (minutosAtuais < 30) {
        horaInicio = horarioAtual; // Se estiver entre XX:00 e XX:29, permite XX:30
      } else {
        horaInicio = horarioAtual + 1; // Se estiver entre XX:30 e XX:59, começa na próxima hora cheia
      }
    }

    // Requisição ao PHP para obter horários ocupados
    fetch(`${environment.apiUrl}/services/verificar-horarios.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: dataString })
    })
      .then(response => response.json())
      .then(data => {
        const horariosOcupados = data.horariosOcupados; // Horários ocupados retornados do PHP
        console.log('Horários ocupados:', horariosOcupados); // Debugging para verificar os dados

        for (let hora = horaInicio; hora <= horaFim; hora++) {
          const horaString = `${hora.toString().padStart(2, '0')}:00`;
          const meiaHoraString = `${hora.toString().padStart(2, '0')}:30`;

          // Se o horário for hoje, garantir que ele só aparece se for após o horário atual
          if (dataSelecionada.toDateString() === agora.toDateString()) {
            if (hora === horarioAtual && minutosAtuais >= 30) {
              // Se já passou de 30 min, permite apenas XX:30 da próxima hora
              if (!horariosOcupados[meiaHoraString] || horariosOcupados[meiaHoraString] < 2) {
                console.log(`Horário disponível: ${meiaHoraString}`);
                this.horariosDisponiveis.push(meiaHoraString);
              }
              continue; // Pula a verificação de XX:00 dessa hora
            }
            if (hora === horarioAtual && minutosAtuais < 30) {
              // Se ainda não passou de 30 min, não exibe XX:00, só XX:30
              if (!horariosOcupados[meiaHoraString] || horariosOcupados[meiaHoraString] < 2) {
                console.log(`Horário disponível: ${meiaHoraString}`);
                this.horariosDisponiveis.push(meiaHoraString);
              }
              continue; // Pula a verificação de XX:00 dessa hora
            }
          }

          // Verifique se o horário já está ocupado mais de 2 vezes
          if (!horariosOcupados[horaString] || horariosOcupados[horaString] < 2) {
            console.log(`Horário disponível: ${horaString}`);
            this.horariosDisponiveis.push(horaString);
          }

          if (!horariosOcupados[meiaHoraString] || horariosOcupados[meiaHoraString] < 2) {
            console.log(`Horário disponível: ${meiaHoraString}`);
            this.horariosDisponiveis.push(meiaHoraString);
          }
        }
      })
      .catch(error => {
        console.error('Erro ao verificar horários:', error);
        Swal.fire('Erro ao verificar horários disponíveis.', '', 'error');
      });
  }









}
