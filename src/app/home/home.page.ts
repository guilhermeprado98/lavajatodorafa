import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tipoUsuario: string = '';

  constructor(private router: Router) {
    const usuario = localStorage.getItem('usuario');
    const usuarioParse = usuario ? JSON.parse(usuario) : null;
    this.tipoUsuario = usuarioParse.tipo;


  }


    logout() {
      Swal.fire({
        title: 'Deseja sair?',
        text: 'Você será desconectado do aplicativo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Não, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          localStorage.removeItem('usuario');
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        } else {
          console.log('Logout cancelado!');
        }
      });
    }

}
