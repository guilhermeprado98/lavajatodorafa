import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovimentacaoPageRoutingModule } from './movimentacao-routing.module';

import { MovimentacaoPage } from './movimentacao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovimentacaoPageRoutingModule
  ],
  declarations: [MovimentacaoPage]
})
export class MovimentacaoPageModule {}
