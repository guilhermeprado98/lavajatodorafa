import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  perfilForm: FormGroup;
  isDisabled = true; // Inicia com os campos desabilitados
  userId: number;

  constructor(private fb: FormBuilder) {
    // Inicializa o formulário com campos desabilitados
    this.perfilForm = this.fb.group({
      nome: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      celular: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      senha: [{ value: '', disabled: true }],
      confirmarSenha: [{ value: '', disabled: true }],
    });

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.userId = usuario.id || 1;
    this.getUsuario();
  }

  // Função para carregar os dados do usuário
  async getUsuario() {
    try {
      const response = await fetch(`${environment.apiUrl}/services/usuarios.php?id=${this.userId}`);
      const res = await response.json();

      console.log('respone',response);

      if (response.ok) {
        // Preenche os campos com os dados retornados
        this.perfilForm.patchValue({
          nome: res.nome || '',
          email: res.email || '',
          celular: res.celular || '',
        });

        // Habilita os campos após preencher os dados
        if (this.isDisabled) {
          this.perfilForm.get('nome')?.enable();
          this.perfilForm.get('email')?.enable();
          this.perfilForm.get('celular')?.enable();
        }
      } else {
        console.error('Erro ao buscar usuário:', res.mensagem || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  }


   toggleEditMode() {
    this.isDisabled = !this.isDisabled;


    if (!this.isDisabled) {
      this.perfilForm.get('nome')?.enable();
      this.perfilForm.get('email')?.enable();
      this.perfilForm.get('celular')?.enable();
      this.perfilForm.get('senha')?.enable();
      this.perfilForm.get('confirmarSenha')?.enable();
    } else {

      this.salvarAlteracoes();
    }
  }


  async salvarAlteracoes() {
    if (this.perfilForm.valid) {
      const dadosAtualizados = this.perfilForm.value;


      if (dadosAtualizados.senha && dadosAtualizados.senha !== dadosAtualizados.confirmarSenha) {
        Swal.fire('Erro', 'As senhas não coincidem!', 'error');
        this.isDisabled = false;
        return;
      }

      try {

        const response = await fetch(`${environment.apiUrl}/services/usuarios.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operacao: 'edit',
            id: this.userId,
            nome: dadosAtualizados.nome,
            email: dadosAtualizados.email,
            celular: dadosAtualizados.celular,
            senha: dadosAtualizados.senha || undefined,
          }),
        });

        const res = await response.json();

        if (response.ok && res.sucesso) {
          Swal.fire('Sucesso', 'Alterações salvas com sucesso!', 'success');
        } else {
          Swal.fire('Erro', res.mensagem || 'Erro ao salvar alterações.', 'error');
        }
      } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        Swal.fire('Erro', 'Erro ao salvar alterações.', 'error');
      } finally {
        // Após salvar, desabilita os campos novamente
        this.perfilForm.get('nome')?.disable();
        this.perfilForm.get('email')?.disable();
        this.perfilForm.get('celular')?.disable();
        this.perfilForm.get('senha')?.disable();
        this.perfilForm.get('confirmarSenha')?.disable();
        this.isDisabled = true; // Garante que o formulário volte ao modo desabilitado
      }
    } else {
      Swal.fire('Erro', 'Formulário inválido!', 'error');
    }
  }
}
