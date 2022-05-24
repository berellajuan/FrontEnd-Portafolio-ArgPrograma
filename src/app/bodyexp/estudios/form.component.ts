import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Educacion } from './estudio';
import { EducacionService } from './estudio.service';
import { ModalsestudioService } from 'src/app/modals/modalsestudio.service';
import { EstudiosComponent } from './estudios.component';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-formeducacion',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponentEducacion implements OnInit {

  @Input() public educacion:Educacion;
  public titulo:string = "Educacion";
  public errores:string[];
  private fotoSeleccionada:File;
  public progreso:number;
  public urlBACKEND:string = URL_BACKEND;

  constructor(private eduService:EducacionService, private route:Router,private activatedRouter:ActivatedRoute, public modalService:ModalsestudioService,public padre:EstudiosComponent) { }

  ngOnInit(): void {}

  cargarEducacion():void{
    this.activatedRouter.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.eduService.getEducacion(id).subscribe(
            edu => this.educacion = edu
          )
        }
      }
    )
  }

  create():void{
    this.eduService.create(this.educacion).subscribe(
      edu => {
        this.cerrarModalEducacion();
        this.route.navigate(['/portafolio'])
        Swal.fire('Nueva Educacion Agregada',`Educacion en ${edu.titulo} agregada con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

  update():void{
    this.eduService.update(this.educacion).subscribe(
      edu => {
        this.modalService.cerrarModal();
        this.route.navigate(['/portafolio']);
        Swal.fire('Educacion Actualizada',`Educacion ${edu.titulo} se actualizo con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }

  selecionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error al Seleccionar: ','Debe seleccionar un archivo del tipo imagen','error')
      this.fotoSeleccionada=null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Error al Subir: ','Debe seleccionar una foto','error')
    }else{
      this.eduService.subirLogo(this.fotoSeleccionada, this.educacion.id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response){
            let response:any = event.body;
            this.educacion = response.educacion as Educacion;

            this.modalService.notificarUpload.emit(this.educacion);

            Swal.fire('La foto se subio completamente!',`La foto se subio con exito!: ${this.educacion.logoInstituto}`,'success')
          }
        });
    }
  }

  cerrarModalEducacion(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada=null;
    this.progreso=0;
    this.errores=[];
    this.padre.getExperiencias();
  }


}
