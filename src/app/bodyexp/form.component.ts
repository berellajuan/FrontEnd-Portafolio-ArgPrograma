import { Component, Input, OnInit } from '@angular/core';
import { Experiencia } from './experiencia';
import { ExperienciaService } from './experiencia.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalsService } from '../modals/modals.service';
import { BodyexpComponent } from './bodyexp.component';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

  @Input() public experiencia:Experiencia;
  public titulo:string = "Experiencia";
  public errores:string[];
  private fotoSeleccionada:File;
  public progreso:number;
  public urlBACKEND:string = URL_BACKEND;

  constructor(private expService:ExperienciaService,private router:Router, private activatedRoute:ActivatedRoute, public modalService:ModalsService, public padre:BodyexpComponent) { }

  ngOnInit(): void {}

  cargarExperiencia():void{
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id']
        if(id){
          this.expService.getExperiencia(id).subscribe(
            (exp) => this.experiencia = exp
          )
        }

      }
    )
  }

  create():void{
    this.expService.create(this.experiencia).subscribe(
      exp =>{
        this.cerrarModalExperiencia();
        this.router.navigate(['/portafolio'])
        Swal.fire('Nueva Experiencia Agregada',`Experiencia en ${exp.titulo} agregado con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

  update():void{
    this.expService.update(this.experiencia).subscribe(
      exp =>{
        this.modalService.cerrarModal();
        this.router.navigate(['/portafolio'])
        Swal.fire('Experiencia Actualizada',`Experiencia ${exp.titulo} se actualizo con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        
      }
    );
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
      this.expService.subirLogo(this.fotoSeleccionada, this.experiencia.id).subscribe(
      event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response:any = event.body;
          this.experiencia = response.experiencia as Experiencia;

          this.modalService.notificarUpload.emit(this.experiencia);

          Swal.fire('La foto se subio completamente!', response.mensaje ,'success')
        }
      });
    }
  }

  cerrarModalExperiencia(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada=null;
    this.progreso=0;
    this.errores=[];
    this.padre.getExperiencias();
  }

}
