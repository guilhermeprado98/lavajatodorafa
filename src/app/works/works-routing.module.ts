import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorksPage } from './works.page';

const routes: Routes = [
  {
    path: '',
    component: WorksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorksPageRoutingModule {}
