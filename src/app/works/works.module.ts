import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorksPageRoutingModule } from './works-routing.module';

import { WorksPage } from './works.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorksPageRoutingModule
  ],
  declarations: [WorksPage]
})
export class WorksPageModule {}
