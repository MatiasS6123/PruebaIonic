import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa FormsModule y ReactiveFormsModule

import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { ListaEstudianteComponent } from './lista-estudiante/lista-estudiante.component';
import { GestionUsuarioComponent } from './gestion-usuario/gestion-usuario.component';
import { ListEstudentComponent } from './list-estudent/list-estudent.component';
import { ListaUsuarioComponent } from './lista-usuario/lista-usuario.component';
import { BuscarCursoComponent } from './buscar-curso/buscar-curso.component';
import { BitacoraComponent } from './bitacora/bitacora.component';
import { GestionNotaComponent } from './gestion-nota/gestion-nota.component';
import { ListaCursoComponent } from './lista-curso/lista-curso.component';

@NgModule({
  declarations: [RegistroComponent,LoginComponent,ListaEstudianteComponent,GestionUsuarioComponent,ListEstudentComponent,ListaUsuarioComponent,
  BuscarCursoComponent,BitacoraComponent,GestionNotaComponent,ListaCursoComponent],
  imports: [
    CommonModule,
    IonicModule, // Importa IonicModule
    FormsModule, // Importa FormsModule
    ReactiveFormsModule // Importa ReactiveFormsModule
  ],
  exports: [RegistroComponent],
})
export class RegistroModule { }
