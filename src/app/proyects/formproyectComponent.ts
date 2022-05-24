import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyect } from './proyect';
import { ProyectsService } from './proyects.service';
import Swal from 'sweetalert2';
import { ModalproyectService } from '../modals/modalproyect.service';
import { ProyectsComponent } from './proyects.component';
import { HttpEventType } from '@angular/common/http';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-formproyect',
  templateUrl: './formproyect.component.html',
  styleUrls: ['./formproyect.component.css']
})
export class FormproyectComponent implements OnInit {

  public titulo: string = 'Proyecto';
  @Input() public proyect:Proyect;
  public errores:string[];
  private fotoSeleccionada:File;
  public progreso:number;
  public urlBACKEND:string = URL_BACKEND;

  constructor(private proyectService:ProyectsService,private router:Router,private activedRoute:ActivatedRoute, public modalProyect:ModalproyectService,public padre:ProyectsComponent) { }

  ngOnInit(): void {
    this.cargarProyecto();
  }

  cargarProyecto():void{
    this.activedRoute.params.subscribe(
      params => {
        let id = params['id']
        if(id){
          this.proyectService.getProyect(id).subscribe(
            pro => this.proyect = pro
          )
        }
      }
    )
  }

  create():void{
    this.proyectService.create(this.proyect).subscribe(
      pro => {
        this.cerrarModalProyecto();
        this.router.navigate(['/portafolio'])
        Swal.fire('Nuevo Proyecto Agregado',`Proyecto ${pro.nombre} agregado con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }

  update():void{
    this.proyectService.update(this.proyect).subscribe(
      pro =>{
        this.modalProyect.cerrarModal();
        this.router.navigate(['/portafolio'])
        Swal.fire('Proyecto Actualizado',`Proyecto ${pro.nombre}  se actualizo con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }

  seleccionarFoto(event){
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
      this.proyectService.subirLogo(this.fotoSeleccionada, this.proyect.id).subscribe(
      event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response:any = event.body;
          this.proyect = response.proyect as Proyect;

          this.modalProyect.notificarUpload.emit(this.proyect);

          Swal.fire('La foto se subio completamente!', response.mensaje ,'success')
        }
      });
    }
  }

  cerrarModalProyecto(){
    this.modalProyect.cerrarModal();
    this.errores=[];
    this.padre.getProyects();
    this.progreso=0;
    this.fotoSeleccionada=null;
  }

}
