import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCadNfcPage } from './modal-cad-nfc.page';

describe('ModalCadNfcPage', () => {
  let component: ModalCadNfcPage;
  let fixture: ComponentFixture<ModalCadNfcPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCadNfcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
