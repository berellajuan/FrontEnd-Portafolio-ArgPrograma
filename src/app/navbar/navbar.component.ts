import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { LoginmodalService } from '../modals/loginmodal.service';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  public urlBACKEND:string = URL_BACKEND;

  constructor(public authService:AuthService, private router:Router, public modalLogin:LoginmodalService) { }
  
  ngOnInit(): void {}

  logout():void{
    
    this.router.navigate(['/portafolio'])
    Swal.fire('Logout',`Hola ${this.authService.usuario.nombre} ${this.authService.usuario.apellido}, cerraste sesion con exito!`,'success');
    this.authService.logout();
  }


}
