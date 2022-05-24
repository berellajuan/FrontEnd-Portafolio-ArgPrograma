import { Injectable } from '@angular/core';
import { Observable,throwError,catchError,map } from 'rxjs';
import { Skill } from './skill';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../login/auth.service';
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  
  private urlEndPoint:string = URL_BACKEND +'/api/portafolio/skills';

  private htttHeaders:HttpHeaders = new HttpHeaders({'Content-Type':'application/json'});

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
      return this.htttHeaders.append('Authorization','Bearer '+token);
    }
    return this.htttHeaders;
  }

  getSkills():Observable<Skill[]>{
    return this.http.get<Skill[]>(this.urlEndPoint)
  }

  getSkill(id):Observable<Skill>{
    return this.http.get<Skill>(
      `${this.urlEndPoint}/${id}`
    ).pipe(
      catchError(e=>{
        this.router.navigate(['/portafolio']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar',e.error.mensaje,'error');
        return throwError(()=>e)
      })
    );
  }

  create(skill:Skill):Observable<Skill>{
    return this.http.post(this.urlEndPoint,skill,{headers:this.addAuthorizationHeader()}).pipe(
      map((res:any)=> res.skill as Skill),
      catchError(e=>{
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

  update(skill:Skill):Observable<Skill>{
    return this.http.put(
      `${this.urlEndPoint}/${skill.id}`, skill,{headers:this.addAuthorizationHeader()}
    ).pipe(
      map((res:any)=> res.skill as Skill),
      catchError(e=>{
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

  delete(id:number):Observable<Skill>{
    return this.http.delete<Skill>(`${this.urlEndPoint}/${id}`,{headers:this.addAuthorizationHeader()}).pipe(
      catchError(e=>{
        if(this.isNoAutorizado(e)){
          return throwError(()=>e)
        }

        Swal.fire(e.error.mensaje,e.error.error,'error')
        return throwError(()=>e)
      })
    )
  }

}
