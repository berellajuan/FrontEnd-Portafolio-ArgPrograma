import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Experiencia } from './experiencia';
import { ExperienciaService } from './experiencia.service';
import { ModalsService } from '../modals/modals.service';
import { AuthService } from '../login/auth.service';
import { URL_BACKEND } from '../config/config';


@Component({
  selector: 'app-bodyexp',
  templateUrl: './bodyexp.component.html',
  styleUrls: ['./bodyexp.component.css']
})
export class BodyexpComponent implements OnInit {

  public experiencias:Experiencia[] =[];

  public urlBACKEND:string = URL_BACKEND;

  public experienciaSeleccionada:Experiencia;

  constructor(private experienciaService:ExperienciaService, public modalService:ModalsService,public autoService:AuthService) { }

  ngOnInit(): void {
    this.getExperiencias();

    this.modalService.notificarUpload.subscribe(exp =>{
      this.experiencias = this.experiencias.map(expEmit =>{
        if(exp.id == expEmit.id){
          expEmit.logoEmpresa = exp.logoEmpresa;
        }
        return expEmit;
      })
    });
  }

  getExperiencias(){
    this.experienciaService.getExperiencias().subscribe(
      experiencias => this.experiencias = experiencias
    );
  }

  delete(exp:Experiencia):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: `¿Estas seguro que desea eliminar ${exp.titulo} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.experienciaService.delete(exp.id).subscribe(
          res=>{
            this.experiencias = this.experiencias.filter(experiencias => experiencias !== exp)
            swalWithBootstrapButtons.fire(
              'Experiencia eliminada!',
              `La experiencia en ${exp.titulo} ah sido eliminada con exito!`,
              'success'
            )
          }
        )
      } 
    })
  }

  abrirModalExperiencia(experiencia:Experiencia){
    this.experienciaSeleccionada = experiencia;
    this.modalService.abrirModal();
  }

  abrirModalExperienciaCreate(){
    this.experienciaSeleccionada = new Experiencia();
    this.modalService.abrirModal();
  }


}
