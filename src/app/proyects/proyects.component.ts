import { Component, OnInit } from '@angular/core';
import { Proyect } from './proyect';
import { ProyectsService } from './proyects.service';
import Swal from 'sweetalert2';
import { ModalproyectService } from '../modals/modalproyect.service';
import { AuthService } from '../login/auth.service';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.css']
})
export class ProyectsComponent implements OnInit {

  public proyects:Proyect[] = []

  public urlBACKEND:string = URL_BACKEND;

  public proyectSeleccionado:Proyect;

  constructor(private serviceProyects:ProyectsService, public modalProyect:ModalproyectService, public authService:AuthService) { }

  ngOnInit(): void {
    this.getProyects()

    this.modalProyect.notificarUpload.subscribe(pro =>{
      this.proyects = this.proyects.map(proEmit =>{
        if(pro.id ==  proEmit.id){
          proEmit.imagen = pro.imagen;
        }
        return proEmit;
      })
    });
  }

  getProyects(){
    this.serviceProyects.getProyects().subscribe(
      res => this.proyects = res
    )
  }

  delete(pro:Proyect):void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: `¿Estas seguro que desea eliminar ${pro.nombre} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceProyects.delete(pro.id).subscribe(
          res=>{
            this.proyects = this.proyects.filter(proyects => proyects !== pro)
            swalWithBootstrapButtons.fire(
              'Experiencia eliminada!',
              `La experiencia en ${pro.nombre} ah sido eliminada con exito!`,
              'success'
            )
          }
        )
      } 
    })
  
  }

  abrirModalProyect(proyect:Proyect){
    this.proyectSeleccionado = proyect;
    this.modalProyect.abrirModal();
  }

  abrirModalProyectCreate(){
    this.proyectSeleccionado = new Proyect();
    this.modalProyect.abrirModal();
  }

}
