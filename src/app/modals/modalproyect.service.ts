import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalproyectService {
  modal:boolean = false;

  private _notificarUpload=new EventEmitter<any>();

  constructor() { }

  get notificarUpload(){
    return this._notificarUpload;
  }

  abrirModal(){
    this.modal=true;
  }

  cerrarModal(){
    this.modal=false;
  }
}
