import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCadNfcPageRoutingModule } from './modal-cad-nfc-routing.module';

import { ModalCadNfcPage } from './modal-cad-nfc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCadNfcPageRoutingModule
  ],
  declarations: [ModalCadNfcPage]
})
export class ModalCadNfcPageModule {}
