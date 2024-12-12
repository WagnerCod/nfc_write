import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCadNfcPage } from './modal-cad-nfc.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCadNfcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCadNfcPageRoutingModule {}
