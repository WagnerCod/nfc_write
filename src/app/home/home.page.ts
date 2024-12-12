import { ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalCadNfcPage } from '../modal-cad-nfc/modal-cad-nfc.page';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NfcService } from '../services/nfc/nfc.service';

declare var nfc: any;
declare var ndef: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  forms!: FormGroup;
  titulo = '';
  isModalOpen = false;

  responseTag: any;
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private cdf: ChangeDetectorRef,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private nfcService: NfcService
  ) {

  }

  ngOnInit(): void {
    this.iniciarForm();
    this.route.queryParams.subscribe((params) => {
      if (params['infoTag']) {
        this.responseTag = params['infoTag'];
        console.log('infoTag', this.responseTag);
      }
    });
  }

  ionViewDidEnter() {
    this.nfcService.removeCallback();
  }


  iniciarForm() {
    this.forms = this.fb.group({
      infoTag: ['', Validators.required],
    });
  }


  setOpen(opc: number, isOpen: boolean) {
    if (opc === 1 && isOpen === true) {
      if (this.forms.valid) {
        console.log('Abrindo modal...');
        this.isModalOpen = true;

      } else {
        alert('Preencha o formulário corretamente.');
      }
    }

    if (opc === 0 && isOpen === false) {
      console.log('Fechando modal...');
      this.isModalOpen = false;
    }
  }

  cadNfc() {
    const params: NavigationExtras = {
      queryParams: {
        infoTag: this.forms.value.infoTag
      }
    }
    this.navCtrl.navigateForward('modal-cad-nfc', params);
  }

  async modalCadNfc() {
    const modalCad = await this.modalCtrl.create({
      component: ModalCadNfcPage,
      componentProps: {
        infoTag: this.forms.value.infoTag
      }
    })
    await modalCad.present();

    modalCad.onDidDismiss().then((data) => {
      if (data) {
        console.log(data);
        this.responseTag = data.data.infoTag;
      }
    })
  }

}