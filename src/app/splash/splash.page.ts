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

    const usuario = localStorage.getItem('usuario');

    if (usuario) {

      this.router.navigateByUrl('/home');
    } else {

      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 3000);
    }
  }
}
