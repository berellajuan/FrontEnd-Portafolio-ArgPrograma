import { Component, OnInit } from '@angular/core';
import { Presentacion } from '../presentacion';
import { PresentacionService } from '../presentacion.service';
import { ModalcartaService } from 'src/app/modals/modalcarta.service';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements OnInit {

  public presentacion:Presentacion = new Presentacion();
  
  constructor(private presentacionService:PresentacionService,public modalCarta:ModalcartaService,public authService:AuthService) { }

  ngOnInit(): void {
    this.presentacionService.getPresentacion().subscribe(
      res=> this.presentacion = res
    );
  }

  abrirModalCarta(carta:Presentacion){
    this.presentacion = carta;
    this.modalCarta.abrirModal()
  }

  noCambiar(){
    this.presentacionService.getPresentacion().subscribe(
      res=> this.presentacion = res
    );
  }

}
