import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PresentacionService } from '../presentacion.service';
import Swal from 'sweetalert2';
import { Presentacion } from '../presentacion';
import { ModalcartaService } from 'src/app/modals/modalcarta.service';
import { PresentacionComponent } from '../presentacion/presentacion.component';

@Component({
  selector: 'app-cartaform',
  templateUrl: './cartaform.component.html',
  styleUrls: ['./cartaform.component.css']
})

export class CartaformComponent implements OnInit {

  public titulo:string = 'Editar carta de presentacion'

  @Input() public presentacion:Presentacion;

  constructor(private presentacionService:PresentacionService,private router:Router, public modalService:ModalcartaService, public padre:PresentacionComponent) { }

  ngOnInit(): void {}

  update():void{
    this.presentacionService.updateCarta(this.presentacion).subscribe(
      pres => {
        this.cerrarModalCarta();
        this.router.navigate(['/portafolio'])
        Swal.fire('Carta Actualizada',`La carta de ${pres.nombre} se actualizo con exito`,'success');
      }
    )
  }
  
  cerrarModalCarta(){
    this.modalService.cerrarModal();
    this.padre.noCambiar();
  }


}
