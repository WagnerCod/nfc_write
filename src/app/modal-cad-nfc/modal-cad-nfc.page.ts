import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';

declare var nfc: any;
declare var ndef: any;

@Component({
  selector: 'app-modal-cad-nfc',
  templateUrl: './modal-cad-nfc.page.html',
  styleUrls: ['./modal-cad-nfc.page.scss'],
})
export class ModalCadNfcPage implements OnInit {
  infoTag: any;
  listenerAtivo: boolean = false;
  emProcesso: boolean = false;
  erroMostrado: any;

  // Armazena callbacks para remover posteriormente
  writeListenerCallback: any;
  readListenerCallback: any;

  constructor(
    private alertCtrl: AlertController,
    private cdf: ChangeDetectorRef,
    private plt: Platform,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['infoTag']) {
        this.infoTag = params['infoTag'];
        console.log('infoTag', this.infoTag);
      }
    });
    this.iniciarCadastro();
  }


  iniciarCadastro() {
    console.log('Verificando se o NFC está habilitado...');
    try {
      nfc.enabled(
        () => {
          console.log('NFC habilitado! Configurando listener de escrita...');
          this.adicionarListenerDeEscrita();
        },
        (error) => {
          console.error('Erro ao verificar o NFC:', error);
          alert('NFC não está habilitado ou suportado neste dispositivo.');
        }
      );
    } catch (error) {
      console.error('Erro inesperado ao verificar NFC:', error);
    }
  }

  async adicionarListenerDeEscrita() {
    if (this.listenerAtivo) {
      console.log('Listener já ativo. Ignorando.');
      return;
    }

    this.writeListenerCallback = async (nfcEvent) => {
      console.log('Evento NFC (escrita) detectado:', nfcEvent);

      if (this.emProcesso) {
        console.log('Operação em andamento. Ignorando.');
        return;
      }

      this.emProcesso = true;

      try {
        await this.processarTagParaEscrita(nfcEvent);
      } catch (error) {
        this.mostrarErro('Erro ao processar a tag NFC para escrita.');
        console.error('Erro ao processar a tag:', error);
      } finally {
        this.emProcesso = false;
      }
    };

    try {
      nfc.addNdefListener(
        this.writeListenerCallback,
        () => {
          console.log('Listener de escrita configurado com sucesso.');
          this.listenerAtivo = true;
        },
        (error) => {
          this.mostrarErro('Erro ao configurar listener de escrita NFC.');
          console.error('Erro ao configurar listener:', error);
        }
      );
    } catch (error) {
      this.mostrarErro('Erro inesperado ao configurar listener de escrita NFC.');
      console.error('Erro inesperado:', error);
    }
  }

  //! Ordem do fluxo: Primeiro escreve, remove o listener de escrita, depois adiciona o listener de leitura, lê, e remove o listener de leitura.

  async processarTagParaEscrita(nfcEvent: any) {
    console.log('Entrou em processarTagParaEscrita');
    const tagId = nfc.bytesToHexString(nfcEvent.tag.id);
    const type = nfcEvent.type || 'ndef';

    console.log('Processando tag:', tagId, 'Tipo:', type);

    if (type === 'ndef') {
      const infoTag = this.infoTag || 'Default Tag Data';
      console.log('Informação do formulário para gravação:', infoTag);

      const message = [ndef.textRecord(String(infoTag))];
      nfc.write(
        message,
        (data) => {
          if (data === 'OK') {
            console.log('Dados sobrescritos com sucesso:', data);

            // Remove o listener de escrita antes de iniciar a leitura
            this.removerListenerNFC(this.writeListenerCallback).then(() => {
              this.listenerAtivo = false;
              // Agora inicia o processo de leitura para confirmação
              this.iniciarLeituraTag();
            });
          } else {
            console.error(new Error('Resposta inesperada ao sobrescrever: ' + data));
            alert('Falha ao sobrescrever a tag. Tente novamente.');
          }
        },
        (error) => {
          console.error('Erro ao sobrescrever os dados:', error);
          alert('Erro ao sobrescrever a tag. Verifique se a tag está correta e tente novamente.');
        }
      );
    } else {
      console.log(`Tag do tipo ${type} detectada. Implementar lógica customizada, se necessário.`);
    }
  }

  iniciarLeituraTag() {
    console.log('Preparando leitura da tag para confirmação...');

    this.readListenerCallback = (event: any) => {
      console.log('Tag NFC detectada durante leitura!', event);

      // Remove o listener de leitura após ler a tag
      this.removerListenerNFC(this.readListenerCallback);

      const ndefMessage = event.tag.ndefMessage;
      if (ndefMessage && ndefMessage.length > 0) {
        const payload = nfc.bytesToString(ndefMessage[0].payload).substring(3);
        console.log('Dados lidos:', payload);
        this.confirmarCadastro(payload);
      } else {
        alert('Nenhuma mensagem NDEF encontrada na tag.');
      }
    };

    nfc.addNdefListener(
      this.readListenerCallback,
      () => {
        console.log('Listener adicionado para leitura. Aproxime a tag novamente.');
        alert('Aproxime novamente a mesma tag para confirmar os dados.');
      },
      (error) => {
        console.error('Erro ao adicionar listener para leitura da tag:', error);
        alert('Erro ao ler a tag. Aproxime novamente ou refaça o cadastro.');
      }
    );
  }

  async confirmarCadastro(tagData: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Cadastro de Dados',
      backdropDismiss: false,
      message: `Confirme se os dados estão corretos: \n${tagData}`,
      buttons: [
        {
          text: 'Refazer',
          handler: () => {
            // Ao clicar em "Refazer", iniciamos o processo de formatação da tag
            this.formatarTag();
          },
        },
        {
          text: 'Confirmo',
          handler: () => {
            this.close(tagData);
          },
        },
      ],
    });
    await alert.present();
  }

  formatarTag() {
    console.log('Preparando para formatar a tag...');

    // Primeiro, remove o listener se estiver ativo
    this.removerListenerNFC(this.writeListenerCallback);
    this.removerListenerNFC(this.readListenerCallback);

    // Agora adiciona um listener somente para a formatação
    const formatCallback = (event: any) => {
      console.log('Tag NFC detectada para formatação!', event);

      // Remove o listener de formatação, pois a tag já foi detectada
      this.removerListenerNFC(formatCallback);

      // Agora apaga (formata) a tag
      nfc.erase(() => {
          console.log('Tag formatada com sucesso.');
          alert('A tag foi formatada com sucesso. Você pode recadastrá-la agora.');
          this.voltar(); // Volta para a página anterior
        },
        (error) => {
          console.error('Erro ao formatar a tag:', error);
          alert('Erro ao formatar a tag. Tente novamente.');
          this.voltar();
        }
      );
    };

    nfc.addNdefListener(formatCallback, () => {
        console.log('Listener adicionado para formatação. Aproxime a tag a ser formatada.');
        alert('Aproxime a tag que deseja formatar.');
      },
      (error) => {
        console.error('Erro ao adicionar listener para formatação da tag:', error);
        alert('Erro ao preparar para formatação. Tente novamente.');
        this.voltar();
      }
    );
  }

  removerListenerNFC(callback: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!callback) {
        resolve();
        return;
      }

      nfc.removeNdefListener(
        callback,
        () => {
          console.log('Listener removido com sucesso.');
          resolve();
        },
        (error) => {
          console.error('Erro ao remover listener:', error);
          // Mesmo com erro tentamos seguir
          resolve();
        }
      );
    });
  }

  mostrarErro(mensagem: string) {
    if (!this.erroMostrado) {
      console.log(mensagem);
      this.erroMostrado = true;
      setTimeout(() => {
        this.erroMostrado = false;
      }, 2000);
    }
  }

  voltar() {
    this.navCtrl.navigateRoot('home');
    this.listenerAtivo = false;
    this.emProcesso = false;
  }

  close(data: any) {
    const params: NavigationExtras = {
      queryParams: {
        infoTag: data
      }
    }
    this.navCtrl.navigateRoot('home', params);
    this.listenerAtivo = false;
    this.emProcesso = false;
    alert('Dados gravados com sucesso!');
  }
}