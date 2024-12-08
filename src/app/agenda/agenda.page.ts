import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage {
  agendamentos: any[] = [];
  mostrarForm: boolean = false;
  tipoUsuario: string = '';

  novoAgendamento = {
    nome_cliente: '',
    veiculo: '',
    data_horario: '',
    observacoes: ''
  };

  constructor(private http: HttpClient) {

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
  console.log('ususu',this.tipoUsuario);
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.http.get(`${environment.apiUrl}/services/agendamento.php`).subscribe(
      (res: any) => {
        this.agendamentos = res;
      },
      err => console.error('Erro ao carregar agendamentos:', err)
    );
  }

  toggleForm() {
    this.mostrarForm = !this.mostrarForm; // Alterna a visibilidade do formulário
  }

  adicionarAgendamento() {
    this.http.post(`${environment.apiUrl}/services/agendamento.php`, this.novoAgendamento).subscribe(
      (res: any) => {
        if (res.sucesso) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Horário agendado com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => {
            this.carregarAgendamentos();
            this.resetarFormulario();
            this.mostrarForm = false;
          });
        }else{
          Swal.fire({
            title: 'Erro!',
            text: 'Erro ao agendar horário. '+ res.mensagem,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      },
      err => {
        console.log('error',err)
        console.error('Erro agendar horário.', err);
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao adicionar agendamento.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  editarAgendamento(agendamento: any) {
    // Exemplo de lógica de edição: popula os campos do formulário com os dados selecionados.
    this.novoAgendamento = { ...agendamento };
  }

  removerAgendamento(id: number) {
    this.http.delete(`${environment.apiUrl}/services/agendamento.php?id=${id}`).subscribe(
      (res: any) => {
        if (res.sucesso) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Agendamento removido com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => {
            this.carregarAgendamentos();
          });
        }
      },
      err => {
        console.error('Erro ao cancelar agendamento:', err);
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao cancelar agendamento.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  resetarFormulario() {
    this.novoAgendamento = {
      nome_cliente: '',
      veiculo: '',
      data_horario: '',
      observacoes: ''
    };
  }
}
