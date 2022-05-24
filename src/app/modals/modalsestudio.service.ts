import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalsestudioService {
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
