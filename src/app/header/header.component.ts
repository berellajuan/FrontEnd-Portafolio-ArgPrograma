import { Component, OnInit, Pipe } from '@angular/core';
import { Presentacion } from './presentacion';
import { PresentacionService } from './presentacion.service';
import { ModalpresentacionService } from '../modals/modalpresentacion.service';
import { AuthService } from '../login/auth.service';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  public presentacion:Presentacion = new Presentacion();

  public urlBACKEND:string = URL_BACKEND;

  constructor(private presentacionService:PresentacionService, public modalHeader:ModalpresentacionService, public authService:AuthService) { }
 

  ngOnInit(): void {
    this.presentacionService.getPresentacion().subscribe(
      pres => this.presentacion = pres
    )
    
    this.modalHeader.notificarUpload.subscribe(presEmit=> {
      
      if(this.presentacion.fotoPerfil != presEmit.fotoPerfil){
        this.presentacion.fotoPerfil = presEmit.fotoPerfil
      }
      if(this.presentacion.fotoPortada != presEmit.fotoPortada){
        this.presentacion.fotoPortada = presEmit.fotoPortada;
      }

    })
  }

  nocambiar(){
    this.presentacionService.getPresentacion().subscribe(
      pres => this.presentacion = pres
    )
  }

  abrirModalHeader(presentacion:Presentacion){
    this.presentacion = presentacion;
    this.modalHeader.abrirModal();
  }

}