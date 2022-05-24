import { Injectable } from '@angular/core';
import { Observable,throwError,catchError,map } from 'rxjs';
import { Presentacion } from './presentacion';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Provincia } from './provincia';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { URL_BACKEND } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class PresentacionService {
  
  private urlEndPoint:string = URL_BACKEND+'/api/portafolio/presentacion';

  private httpHeaders:HttpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  private isNoAutorizado(error):boolean{
    if(error.status==401){
      if(this.authService.isAuthenticated()){
        this.authService.logout()
      }
      Swal.fire('Login','Error usuario o constraseña incorrectos','warning');
      this.router.navigate(['/login'])
      return true;
    }
    if(error.status == 403){
      Swal.fire('Acceso Denegado','No tiene Acceso a este recurso','warning');
      this.router.navigate(['/login'])
      return true;
    }
    return false;;
  }

  constructor(private http: HttpClient, private router:Router,private authService:AuthService) { }

  private addAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization','Bearer '+token);
    }
    return this.httpHeaders;
  }

  getProvincias():Observable<Provincia[]>{
    return this.http.get<Provincia[]>(this.urlEndPoint + '/provincias');
  }
  
  getPresentacion():Observable<Presentacion>{
    return this.http.get<Presentacion>(this.urlEndPoint);
  }

  update(presentacion:Presentacion):Observable<Presentacion>{
    return this.http.put(
      `${this.urlEndPoint}`,presentacion,{headers: this.addAuthorizationHeader()}
    ).pipe(
      map((res:any)=> res.presentacion as Presentacion),
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

  updateCarta(presentacion:Presentacion):Observable<Presentacion>{
    return this.http.put(
      `${this.urlEndPoint}/carta`,presentacion,{headers:this.addAuthorizationHeader()}
    ).pipe(
      map((res:any) => res.presentacion as Presentacion),
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

  subirPortada(archivo:File,id):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo)
    formData.append("id",id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization','Bearer '+token);
    }

    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload/fotoportada/`,formData,{
      reportProgress:true,
      headers: httpHeaders
    })

    return this.http.request(req).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(()=>e);
      })
    );
  }

  subirPerfil(archivo:File,id):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo)
    formData.append("id",id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization','Bearer '+token);
    }

    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload/fotoperfil/`,formData,{
      reportProgress:true,
      headers: httpHeaders
    })

    return this.http.request(req).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(()=>e);
      })
    );
  } 


}
