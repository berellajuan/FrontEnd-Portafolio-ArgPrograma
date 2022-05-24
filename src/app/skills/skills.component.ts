import { Component, OnInit } from '@angular/core';
import { Skill } from './skill';
import { SkillsService } from './skills.service';
import Swal from 'sweetalert2';
import { ModalskillService } from '../modals/modalskill.service';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  public skills:Skill[] = []

  public skillSeleccionada:Skill;

  constructor(private skillsService:SkillsService, public modalService:ModalskillService, public authService:AuthService) { }

  ngOnInit(): void {
    this.getSkills();
  }

  getSkills(){
    this.skillsService.getSkills().subscribe(
      res => this.skills = res
    )
  }

  delete(skill:Skill):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: `¿Estas seguro que desea eliminar ${skill.nombre} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.skillsService.delete(skill.id).subscribe(
          res=>{
            this.skills = this.skills.filter(skills => skills !== skill)
            swalWithBootstrapButtons.fire(
              'Skill eliminada!',
              `Skill en ${skill.nombre} ah sido eliminada con exito!`,
              'success'
            )
          }
        )
      } 
    })
  }

  abrirModalSkill(skillSelect:Skill){
    this.skillSeleccionada = skillSelect;
    this.modalService.abrirModal();
  }

  abrirModalSkillCreate(){
    this.skillSeleccionada = new Skill();
    this.modalService.abrirModal();
  }

}
