import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginmodalService } from '../modals/loginmodal.service';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public titulo:string = 'Inicio de Sesion';
  public usuario:Usuario;

  constructor(public authService:AuthService, private router:Router, public modalLogin:LoginmodalService) { 
    this.usuario=new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/portafolio'])
      Swal.fire('Login',`Hola ${this.authService.usuario.nombre} ${this.authService.usuario.apellido} ya esta autenticado!`,'info');
      
    }
  }

  login():void{    
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error Login','Usuario o Contraseña vacios!','error');
      return;
    }
    this.authService.login(this.usuario).subscribe(res =>{
      
      this.authService.guardarUsuario(res.access_token);
      this.authService.guardarToken(res.access_token);
      console.log(res.info)
      let usuario = this.authService.usuario;
      this.modalLogin.cerrarModal();
      this.router.navigate(['/portafolio']);
      Swal.fire('Login',`Hola ${usuario.nombre} ${usuario.apellido}, iniciaste sesion con exito!`,'success');
    },err => {
      if(err.status == 401 || err.status == 400 ){
        Swal.fire('Error Login','Usuario o Contraseña Incorrectos!','error');
      }
    }
    )
  }  

}
