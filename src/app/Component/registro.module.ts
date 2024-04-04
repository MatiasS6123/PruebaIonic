import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa FormsModule y ReactiveFormsModule

import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [RegistroComponent,LoginComponent],
  imports: [
    CommonModule,
    IonicModule, // Importa IonicModule
    FormsModule, // Importa FormsModule
    ReactiveFormsModule // Importa ReactiveFormsModule
  ],
  exports: [RegistroComponent],
})
export class RegistroModule { }