import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GestionCService } from 'src/app/Service/gestion-c.service';
import { UserService } from 'src/app/Service/user.service';
import { User } from 'src/models/User';
import { GestionCurso } from 'src/models/gestionC';

@Component({
  selector: 'app-lista-curso',
  templateUrl: './lista-curso.component.html',
  styleUrls: ['./lista-curso.component.scss'],
})
export class ListaCursoComponent  implements OnInit {

  cursos:GestionCurso[]=[]
  profesores:User[]=[]

  constructor(private userService:UserService, private gestionCService:GestionCService) { }

  ngOnInit():void {
    //this.obtenerCursoAsignado();
    this.getProfesores();
    this.mostrarCurso();

  }

  /*obtenerCursoAsignado(){
    this.userService.getUserInfo().subscribe(
      (usuario)=>{
        this.gestionCService.getCursosAsignados(usuario.nombre).subscribe(
          (cursos) => {
            this.curso = cursos;
          },
          (error) => {
            console.error('Error al obtener cursos asignados:', error);
            // Manejo de error
          }
        )
      
      }
    )

  }*/


  mostrarCurso() {
    this.userService.getUserInfo().subscribe(
      (usuario) => {
        try {
          this.gestionCService.getCursosAsignados(usuario.rut).subscribe(
            (curso) => {
              this.cursos = curso;
            },
            (error) => {
              if (error instanceof HttpErrorResponse && error.status === 404) {
                // Manejo del error 404 (Not Found)
                console.error('No se encontraron cursos asignados:', error);
              } else {
                // Otros errores HTTP
                console.error('Error al obtener cursos asignados:', error);
              }
            }
          );
        } catch (error) {
          // Captura de errores generales
          console.error('Error:', error);
        }
      }
    );
  }

  getProfesores() {
    console.log('Obteniendo profesores...');
    this.userService.getProfesores().subscribe(
      (profesores) => {
        this.profesores = profesores;
        console.log('Profesores obtenidos:', profesores);
      },
      (error) => {
        console.error('Error al obtener los profesores:', error);
      }
    );
  }
}
