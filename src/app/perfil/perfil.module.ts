import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Adicione ReactiveFormsModule
import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';
import { PerfilPage } from './perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Adicione aqui também
    IonicModule,
    PerfilPageRoutingModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {}
