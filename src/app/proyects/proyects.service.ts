import { Injectable } from '@angular/core';
import { catchError,map,Observable,throwError } from 'rxjs';
import { Proyect } from './proyect';
import { Router } from '@angular/router';
import { HttpClient,HttpEvent,HttpHeaders, HttpRequest } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../login/auth.service';
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ProyectsService {
  
  private urlEndPoint:string = URL_BACKEND+'/api/portafolio/proyects';

  private httpHeaders:HttpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  private isNoAutorizado(error):boolean{
    if(error.status==401){
      if(this.authService.isAuthenticated()){
        this.authService.logout()
      }
      this.router.navigate(['/login'])
      return true;
    }
    if(error.status == 403){
      Swal.fire('Acceso Denegado','No tiene Acceso a este recurso','warning');
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }

  constructor(private http:HttpClient, private router:Router,private authService:AuthService) { }

  private addAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization','Bearer '+token);
    }
    return this.httpHeaders;
  }

  getProyects():Observable<Proyect[]>{
    return this.http.get<Proyect[]>(this.urlEndPoint);
  }

  create(proyect:Proyect):Observable<Proyect>{
    return this.http.post(this.urlEndPoint,proyect,{headers: this.addAuthorizationHeader()}).pipe(
      map((res:any) => res.proyect as Proyect),
      catchError(e =>{

        if(this.isNoAutorizado(e)){
          return throwError(()=>e)
        }

        if(e.status ==400){
          return throwError(()=>e)
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error,'error')
        return throwError(()=>e)
      })
    )
  }

  getProyect(id):Observable<Proyect>{
    return this.http.get<Proyect>(
      `${this.urlEndPoint}/${id}`
    ).pipe(
      catchError( e => {
        this.router.navigate(['/portafolio']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar',e.error.mensaje,'error');
        return throwError(()=>e)
      })
    )
  }

  update(proyect:Proyect):Observable<Proyect>{
    return this.http.put(`${this.urlEndPoint}/${proyect.id}`,proyect,{headers:this.addAuthorizationHeader()}).pipe(
      map((res:any) => res.proyect as Proyect),
      catchError(e =>{
        if(this.isNoAutorizado(e)){
          return throwError(()=>e)
        }
        if(e.status ==400){
          return throwError(()=>e)
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error,'error')
        return throwError(()=>e)
      })
    )
  }

  delete(id:number):Observable<Proyect>{
    return this.http.delete<Proyect>(`${this.urlEndPoint}/${id}`,{headers: this.addAuthorizationHeader()}).pipe(
      catchError(e=>{
        if(this.isNoAutorizado(e)){
          return throwError(()=>e)
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error,'error')
        return throwError(()=>e)
      })
    )
  }

  subirLogo(archivo:File,id):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo)
    formData.append("id",id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization','Bearer '+token);
    }
    
    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,formData, {
      reportProgress:true,
      headers: httpHeaders
    })

    return this.http.request(req).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(()=>e);
      })
    )
  }
}
