import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NotaService } from 'src/app/Service/nota.service';
import { Nota } from 'src/models/nota';

@Component({
  selector: 'app-gestion-nota',
  templateUrl: './gestion-nota.component.html',
  styleUrls: ['./gestion-nota.component.scss'],
})
export class GestionNotaComponent {

  notaForm:Nota = {
    _id: '', // Añadido el campo _id
    nombreCurso: '', // Añadido el campo nombreCurso
    asignatura: '',
    nombreProfesor: '', // Añadido el campo nombreProfesor
    rutProfesor: '', // Añadido el campo rutProfesor
    notas: [],
    fecha: new Date()
  };
  buscarForm: any = {
    nombreCurso: ''
  };
  notaEncontrado: Nota | null = null;
  mostrarInformacionNota: boolean = false;
  edicionHabilitada: boolean = false;

  constructor(private notaService: NotaService, private toastController: ToastController) { }

  buscarNota() {
    this.notaService.getNotasByCurso(this.buscarForm.nombreCurso).subscribe(
      (nota: Nota) => {
        console.log("nota encontrada", nota)

        if (nota) {
          this.notaEncontrado = nota;
          this.mostrarInformacionNota = true;

          this.notaForm = nota;
          this.edicionHabilitada = false;
        } else {
          this.presentToast('Nota no encontrada');
          this.notaEncontrado = null;
          this.mostrarInformacionNota = false;
        }
      }
    )
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  habilitarEdicion() {
    this.edicionHabilitada = true;
  }

  actualizarNota() {
    this.notaService.updateCurso(this.notaForm.nombreCurso, this.notaForm).subscribe(
      (curso: Nota) => {
        console.log('Curso actualizado:', curso);
        this.presentToast('Curso actualizado correctamente');
        this.notaEncontrado = curso;
        this.mostrarInformacionNota = true;
        this.edicionHabilitada = false;
      },
      (error) => {
        console.error('Error al actualizar el curso:', error);
        this.presentToast('Error al actualizar el curso');
      }
    );
  }

  eliminarNota() {
    const nombreCurso = this.notaForm.nombreCurso;
    if (!nombreCurso) {
      this.presentToast('No se proporcionó un nombre válido para eliminar el curso');
      return;
    }

    console.log(nombreCurso)

    this.notaService.deleteNota(nombreCurso).subscribe(
      () => {
        this.presentToast('Curso eliminado correctamente');
        this.notaEncontrado = null;
        this.mostrarInformacionNota = false;
        this.buscarForm.Curso = '';
      },
      (error) => {
        this.presentToast("Error al eliminar el curso");
        console.error('Error al eliminar el curso:', error);
      }
    );
  }

}
