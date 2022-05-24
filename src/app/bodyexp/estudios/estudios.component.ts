import { Component, OnInit } from '@angular/core';
import { Educacion } from './estudio';
import { EducacionService } from './estudio.service';
import Swal from 'sweetalert2';
import { ModalsestudioService } from 'src/app/modals/modalsestudio.service';
import { AuthService } from 'src/app/login/auth.service';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-estudios',
  templateUrl: './estudios.component.html',
  styleUrls: ['../bodyexp.component.css']
})
export class EstudiosComponent implements OnInit {

  public educaciones:Educacion[] = [];

  public urlBACKEND:string = URL_BACKEND;

  public educacionSeleccionada:Educacion;

  constructor(private educacionService:EducacionService,public modalService:ModalsestudioService,public authService:AuthService) { }

  ngOnInit(): void {
    this.getExperiencias();
    this.modalService.notificarUpload.subscribe(edu =>{
      this.educaciones = this.educaciones.map(eduEmit =>{
        if(edu.id == eduEmit.id){
          eduEmit.logoInstituto = edu.logoInstituto;
        }
        return eduEmit;
      })
    });
  }

  getExperiencias(){
    this.educacionService.getEducaciones().subscribe(
      edu => this.educaciones = edu
    );
  }

  delete(edu:Educacion):void{
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Estas seguro?',
        text: `¿Estas seguro que desea eliminar ${edu.titulo} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.educacionService.delete(edu.id).subscribe(
            res=>{
              this.educaciones = this.educaciones.filter(educaciones => educaciones !== edu)
              swalWithBootstrapButtons.fire(
                'Experiencia eliminada!',
                `La educacion en ${edu.titulo} ah sido eliminada con exito!`,
                'success'
              )
            }
          )
        } 
      })
    }

    abrirModalEducacion(educacion:Educacion){
      this.educacionSeleccionada = educacion;
      this.modalService.abrirModal();
    }

    abrirModalEducacionCreate(){
      this.educacionSeleccionada = new Educacion();
      this.modalService.abrirModal();
    }

}


