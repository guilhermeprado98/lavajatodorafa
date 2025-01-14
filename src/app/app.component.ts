import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private router: Router,private menu : MenuController) {}

  ngOnInit() {
    // Verificar se 'usuario' está presente no localStorage
    const userSession = localStorage.getItem('usuario');
    this.isLoggedIn = userSession !== null; // Definir o estado de login
  }

  closeMenu() {
    this.menu.close();
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
