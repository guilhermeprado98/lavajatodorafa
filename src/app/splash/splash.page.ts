import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Espera 3 segundos antes de redirecionar para a tela de login
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000);
  }
}
