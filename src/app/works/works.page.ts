import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-works',
  templateUrl: './works.page.html',
  styleUrls: ['./works.page.scss'],
})
export class WorksPage implements OnInit {
  servicos: any[] = []; // Lista de serviços
  tipoUsuario: string = ''; // Tipo de usuário: 'admin' ou 'cliente'

  constructor() { }

  ngOnInit() {
    // Simula carregamento do tipo de usuário
    const dadosUsuarios = localStorage.getItem('usuario');
    if (dadosUsuarios) {
      try {
        const usuarios = JSON.parse(dadosUsuarios);
        this.tipoUsuario = usuarios.tipo || 'cliente';
        console.log('Tipo de usuário carregado:', this.tipoUsuario);
      } catch (error) {
        console.error('Erro ao processar dados do localStorage:', error);
        this.tipoUsuario = 'cliente';
      }
    } else {
      this.tipoUsuario = 'cliente';
    }
    this.carregarServicos();
  }

  carregarServicos() {
    // Simulação de serviços (substituir pela integração real)
    this.servicos = [
      { id: 1, nome: 'Lavagem Completa', preco: 50 },
      { id: 2, nome: 'Polimento', preco: 100 },
      { id: 3, nome: 'Higienização Interna', preco: 80 },
    ];
  }

  adicionarServico() {
    if (this.tipoUsuario == 'admin') {
      console.log('Abrindo modal para adicionar serviço...');
      // Aqui você pode abrir um modal ou implementar a lógica de adicionar
    } else {
      alert('Apenas administradores podem adicionar serviços.');
    }
  }
}
