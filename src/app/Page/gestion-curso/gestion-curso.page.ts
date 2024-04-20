import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { EstudianteService } from 'src/app/Service/estudiante.service';
import { GestionCService } from 'src/app/Service/gestion-c.service';
import { UserService } from 'src/app/Service/user.service';
import { Estudiante } from 'src/models/Estudiante';
import { User } from 'src/models/User';
import { GestionCurso } from 'src/models/gestionC';

@Component({
  selector: 'app-gestion-curso',
  templateUrl: './gestion-curso.page.html',
  styleUrls: ['./gestion-curso.page.scss'],
})
export class GestionCursoPage implements OnInit {

  gestionCursoForm!: FormGroup;
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  alumnos: string[] = [];

  profesores: User[] = [];


  constructor(private formBuilder: FormBuilder,private GestionCservice:GestionCService, private toastControler:ToastController,
    private estudianteService:EstudianteService,private userService:UserService) { 
    this.gestionCursoForm = this.formBuilder.group({
      nombreCurso: ['', Validators.required],
      cantidadAlumno: ['', Validators.required],
      nombreProfesor: ['', Validators.required],
     
      dias: [[],Validators.required],
      alumno:[[],Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerNombresEstudiantes();
    this.obtenerProfesor();
  }

  onSubmit() {
    // Aquí puedes manejar la lógica para enviar el formulario al backend
    console.log(this.gestionCursoForm.value);
  }

  guardarCurso(): void {
    if (this.gestionCursoForm.valid) {
      console.log('Formulario válido. Guardando curso...');
      const formData = this.gestionCursoForm.value; // Obtener todos los datos del formulario
  
      // Crear un objeto curso que contenga todos los datos del formulario
      const curso: GestionCurso = {
        nombreCurso: formData.nombreCurso,
        cantidadAlumno: formData.cantidadAlumno,
        nombreProfesor: formData.nombreProfesor.nombre,
        rutProfesor: formData.nombreProfesor.rut,
        dias: formData.dias,
        alumno: formData.alumno
      };
  
      this.GestionCservice.asignarCurso(curso).subscribe(
        () => {
          this.presentToast("Curso asignado correctamente");
          console.log('Curso guardado correctamente.');
          this.gestionCursoForm.reset();
        },
        (error) => {
          console.error('Error al guardar el curso:', error);
          this.presentToast("Error al guardar el curso");
        }
      );
    } else {
      console.error('El formulario no es válido');
      this.presentToast("El formulario no es válido");
    }
  }
  
  
  obtenerNombresEstudiantes() {
    this.estudianteService.getEstudiantes().subscribe(
      (estudiantes: Estudiante[]) => {
        this.alumnos = estudiantes.map(estudiante => `${estudiante.nombre} ${estudiante.apellido}`);
      },
      (error) => {
        console.error('Error al obtener estudiantes:', error);
      }
    );
  }

  obtenerProfesor(){
    this.userService.getProfesores().subscribe(
      (profesores) =>{
        this.profesores=profesores;
      }
    )
  }

  

  async presentToast(message: string) {
    const toast = await this.toastControler.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
