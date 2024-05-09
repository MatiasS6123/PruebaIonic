import { Component, OnInit } from '@angular/core';
import { NotaService } from 'src/app/Service/nota.service';
import { EstudianteService } from 'src/app/Service/estudiante.service';
import { Estudiante } from 'src/models/Estudiante';
import { Nota } from '../../../models/nota';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { GestionCurso } from 'src/models/gestionC';
import { ActivatedRoute } from '@angular/router';
import { GestionCService } from 'src/app/Service/gestion-c.service';
import { UserService } from 'src/app/Service/user.service';
import { User } from 'src/models/User';

@Component({
  selector: 'app-nota',
  templateUrl: './nota.page.html',
  styleUrls: ['./nota.page.scss'],
})
export class NotaPage implements OnInit {

  gestionCurso: GestionCurso;

  user:User
  nombreProfesor: string ;
  rutProfesor: string ;
  cantidadNotas: number = 5
  notasArray: any[] = Array(this.cantidadNotas).fill(0); // Array de tamaño cantidadNotas lleno de ceros


  nota: Nota = {
    _id: '', // Añadido el campo _id
    nombreCurso: '', // Añadido el campo nombreCurso
    asignatura: '',
    nombreProfesor: '', // Añadido el campo nombreProfesor
    rutProfesor: '', // Añadido el campo rutProfesor
    notas: [],
    fecha: new Date()
  };
  notasEstudiantes: { nombre: string, rut: string, notas: number[] }[] = [];



  constructor(
    private notaService: NotaService,
    private gestionC: GestionCService,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private authService:UserService
  
  ) { }

  ngOnInit(): void {
    const nombreCurso = this.route.snapshot.paramMap.get('nombreCurso');
    console.log('ID del curso recibido:', nombreCurso);
  
    this.gestionC.getCursoByNombre(nombreCurso).subscribe(
      (curso) => {
        this.gestionCurso = curso;
        console.log('Información del curso:', this.gestionCurso);
        // Aquí puedes realizar cualquier otra acción necesaria con la información del curso
  
        // Reinicializar notasEstudiantes como un arreglo vacío
        this.notasEstudiantes = [];
        
        // Iterar sobre cada estudiante y agregar un objeto vacío para cada uno a notasEstudiantes
        this.gestionCurso.alumno.forEach(estudiante => {
          this.notasEstudiantes[estudiante.rut] = {};
          for (let i = 0; i < this.cantidadNotas; i++) {
            this.notasEstudiantes[estudiante.rut][i] = 0;
          }
        });
      },
      (error) => {
        console.error('Error al obtener información del curso:', error);
        // Maneja el error adecuadamente, por ejemplo, mostrando un mensaje al usuario
      }
    );
  
    this.obtenerProfile();
  }
    
    
  guardarNotas(): void {
    // Validar las notas ingresadas

    const notasArray = this.gestionCurso.alumno.map(estudiante => ({
      nombre: estudiante.nombre,
      rut: estudiante.rut,
      nota: this.notasEstudiantes[estudiante.rut] || 0 // Utilizar el nombre del estudiante como clave para obtener la nota
    }));
    // Construir el objeto Nota
    const nuevaNota: Nota = {
      _id: '4', // Añadido el campo _id
      nombreCurso: this.gestionCurso.nombreCurso,
      asignatura: this.nota.asignatura,
      nombreProfesor: this.nombreProfesor, // Añadido el campo nombreProfesor
      rutProfesor: this.rutProfesor, // Añadido el campo rutProfesor
      notas: notasArray,
      fecha: this.nota.fecha
    };

    console.log('Nueva nota a guardar:', nuevaNota);

    // Llamar al servicio para guardar la nueva nota
    this.notaService.guardarNota(nuevaNota).subscribe(() => {
      this.presentToast('Nota guardada exitosamente.');
      // Limpiar el formulario después de guardar la nota
      // Limpiar las notas de los estudiantes
      // Cambio en la limpieza del objeto de notas
      window.location.reload();
    }, error => {
      // Si hay un error diferente, manejarlo apropiadamente
      // Puedes agregar más lógica aquí según sea necesario
      if(error.status === 201){
        this.presentToast("Notas  guardadas correctamente")
        this.notasEstudiantes=[];
        this.gestionCurso.alumno.forEach(estudiante => {
          this.notasEstudiantes[estudiante.rut] = {};
          for (let i = 0; i < this.cantidadNotas; i++) {
            this.notasEstudiantes[estudiante.rut][i] = 0;
          }
        });
        this.nota.asignatura='';
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  obtenerProfile() {
    this.authService.getUserInfo().subscribe(
      (usuario: User) => {
        // Asigna el nombre y rut del usuario a las variables correspondientes
        this.nombreProfesor = usuario.nombre;
        this.rutProfesor = usuario.rut;
        console.log(usuario); // Imprime la información del usuario obtenida
      }
    );
  }


}
