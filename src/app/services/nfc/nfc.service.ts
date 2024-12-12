import { Injectable } from '@angular/core';

declare var nfc: any;
@Injectable({
  providedIn: 'root'
})
export class NfcService {
  ndefCallback: any;
  constructor() { }

  setCallback(fn: any) {
    this.ndefCallback = fn;
  }

  removeCallback() {
    if (this.ndefCallback) {
      nfc.removeNdefListener(
        this.ndefCallback,
        () => console.log('Listener NDEF removido com sucesso.'),
        (error) => console.error('Erro ao remover Listener NDEF:', error)
      );
      this.ndefCallback = null;
    }
  }
}
