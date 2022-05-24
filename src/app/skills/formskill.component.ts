import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Skill } from './skill';
import { SkillsService } from './skills.service';
import { ModalskillService } from '../modals/modalskill.service';
import { SkillsComponent } from './skills.component';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-formskill',
  templateUrl: './formskill.component.html',
  styleUrls: ['./formskill.component.css']
})
export class FormskillComponent implements OnInit {

  public titulo:string = 'Habilidad';
  
  @Input() public skill:Skill;

  public errores:string[];

  constructor(private skillService:SkillsService,private router:Router,private activedRouter:ActivatedRoute, public modalService:ModalskillService, public padre:SkillsComponent) { }

  ngOnInit(): void {
    this.cargarSkill()
  }
  
  cargarSkill():void{
    this.activedRouter.params.subscribe(
      params => {
        let id = params['id']
        if(id){
          this.skillService.getSkill(id).subscribe(
            skill => this.skill = skill
          )
        }
      }
    )
  }

  create():void{
    this.skillService.create(this.skill).subscribe(
      pro => {
        this.cerrarModalSkill();
        this.router.navigate(['/portafolio'])
        Swal.fire('Nueva Skill Agregada',`Skill en ${pro.nombre} agregada con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }

  update():void{
    this.skillService.update(this.skill).subscribe(
      pro=>{
        this.modalService.cerrarModal();
        this.router.navigate(['/portafolio'])
        Swal.fire('Skill Actualizada',`Skill en ${pro.nombre}  se actualizo con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }

  public cerrarModalSkill(){
    this.modalService.cerrarModal();
    this.errores=[];
    this.padre.getSkills();
  }

}
