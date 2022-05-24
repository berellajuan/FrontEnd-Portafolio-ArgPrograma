import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { PresentacionComponent } from './header/presentacion/presentacion.component';
import { BodyexpComponent } from './bodyexp/bodyexp.component';
import { EstudiosComponent } from './bodyexp/estudios/estudios.component';
import { ProyectsComponent } from './proyects/proyects.component';
import { SkillsComponent } from './skills/skills.component';
//principal
import { PortafolioComponent } from './portafolio/portafolio.component';
//Services
import { ExperienciaService } from './bodyexp/experiencia.service';
import { EducacionService } from './bodyexp/estudios/estudio.service';
//Routers
import { RouterModule, Routes } from '@angular/router';
//otros imports
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
//formularios
import { FormComponent } from './bodyexp/form.component';
import { FormComponentEducacion } from './bodyexp/estudios/form.component';
import { FormproyectComponent } from './proyects/formproyectComponent';
import { ProyectsService } from './proyects/proyects.service';
import { FormskillComponent } from './skills/formskill.component';
import { SkillsService } from './skills/skills.service';
import { PerfilformComponent } from './header/perfilform.component';
import { PresentacionService } from './header/presentacion.service';
import { CartaformComponent } from './header/presentacion/cartaform.component';
import { LoginComponent } from './login/login.component';

const routes:Routes = [
  {path:'', redirectTo:'/portafolio',pathMatch:'full'},
  {path:'portafolio', component: PortafolioComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    PresentacionComponent,
    BodyexpComponent,
    EstudiosComponent,
    ProyectsComponent,
    SkillsComponent,
    PortafolioComponent,
    FormComponent,
    FormComponentEducacion,
    FormproyectComponent,
    FormskillComponent,
    PerfilformComponent,
    CartaformComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ExperienciaService,EducacionService,ProyectsService,SkillsService,PresentacionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
