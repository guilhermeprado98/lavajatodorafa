import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tipoUsuario: string = '';

  constructor() {
    const usuario = localStorage.getItem('usuario');
    const usuarioParse = usuario ? JSON.parse(usuario) : null;
    this.tipoUsuario = usuarioParse.tipo;

  }

}
