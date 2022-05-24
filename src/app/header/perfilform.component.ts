import { Component, Input, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { Presentacion } from './presentacion';
import { PresentacionService } from './presentacion.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalpresentacionService } from '../modals/modalpresentacion.service';
import { HeaderComponent } from './header.component';
import { Provincia } from './provincia';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-perfilform',
  templateUrl: './perfilform.component.html',
  styleUrls: ['./perfilform.component.css']
})
export class PerfilformComponent implements OnInit {

  public titulo:string = 'Editar Perfil'
  @Input() public presentacion:Presentacion;
  private fotoPortadaSeleccionada:File;
  private fotoPerfilSeleccionada:File;
  public urlBACKEND:string = URL_BACKEND;

  public provincias:Provincia[] = [];
  public progresoPortada:number;
  public progresoPerfil:number;

  constructor(private presentacionService:PresentacionService,private router:Router, public modalHeader:ModalpresentacionService,
    public padre:HeaderComponent) { }

  ngOnInit(): void {
    this.presentacionService.getProvincias().subscribe(provincias => this.provincias = provincias); 
    
  }
  
  update():void{
    this.presentacionService.update(this.presentacion).subscribe(
      pres => {
        this.modalHeader.cerrarModal();
        this.modalHeader.notificarUpload.emit(this.presentacion);
        this.router.navigate(['/portafolio'])
        this.modalHeader.cerrarModal();
        Swal.fire('Perfil Actualizado',`Perfil de ${pres.nombre}  se actualizo con exito`,'success');
      }
    )
    
  }

  selecionarFotoPortada(event){
    this.fotoPortadaSeleccionada = event.target.files[0];
    this.progresoPortada=0;
    if(this.fotoPortadaSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error al Seleccionar: ','Debe seleccionar un archivo del tipo imagen','error')
      this.fotoPortadaSeleccionada=null;
    }
  }

  subirFotoPortada(){
    if(!this.fotoPortadaSeleccionada){
      Swal.fire('Error al Subir: ','Debe seleccionar una foto','error')
    }else{
      this.presentacionService.subirPortada(this.fotoPortadaSeleccionada, this.presentacion.id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progresoPortada = Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response){
            let response:any = event.body;
            this.presentacion = response.presentacion as Presentacion;

            this.modalHeader.notificarUpload.emit(this.presentacion);            

            Swal.fire('La foto se subio completamente!',`La foto se subio con exito!: ${this.presentacion.fotoPortada}`,'success')
          }
        }
      );
    }
  }

  selecionarFotoPerfil(event){
    this.fotoPerfilSeleccionada = event.target.files[0];
    this.progresoPerfil=0;
    if(this.fotoPerfilSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error al Seleccionar: ','Debe seleccionar un archivo del tipo imagen','error')
      this.fotoPerfilSeleccionada=null;
    }
  }

  subirFotoPerfil(){
    if(!this.fotoPerfilSeleccionada){
      Swal.fire('Error al Subir: ','Debe seleccionar una foto','error')
    }else{
      this.presentacionService.subirPerfil(this.fotoPerfilSeleccionada, this.presentacion.id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progresoPerfil = Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response){
            let response:any = event.body;
            this.presentacion = response.presentacion as Presentacion;

            this.modalHeader.notificarUpload.emit(this.presentacion);    

            Swal.fire('La foto se subio completamente!',`La foto se subio con exito!: ${this.presentacion.fotoPerfil}`,'success')
          }
        }
      );
    }
  }

  cerrarModalHeader(){
    this.modalHeader.cerrarModal();
    this.progresoPerfil = 0;
    this.progresoPortada = 0;
    this.fotoPerfilSeleccionada=null;
    this.fotoPortadaSeleccionada=null;
    this.padre.nocambiar()
  }

  comprarProvincia(p1:Provincia,p2:Provincia):boolean{
    return p1 === null || p2 === null || p1 === undefined || p2 === undefined ? false: p1.id === p2.id;
  }

}
