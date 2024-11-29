import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario: string = '';
  senha: string = '';

  constructor(private http: HttpClient,private router: Router) {}

  login() {
    const credenciais = { usuario: this.usuario, senha: this.senha };


    this.http.post('http://localhost/lavajatodorafa-backend/api/services/login.php', credenciais).subscribe(

      (res: any) => {
        console.log('res',res);
        if (res.sucesso) {
          this.router.navigate(['/home']);
        } else {
          console.error(res.mensagem);
        }
      },
      (err) => {
        console.error('Erro de conexão:', err);
      }
    );
  }
}
