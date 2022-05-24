import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalsService {
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
