import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {

  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      rut: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      tipo_usuario:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  onSubmit() {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.registerForm.invalid) {
      return;
    }

    // Si el formulario es válido, envía los datos al servicio para el registro
    this.userService.createUser(this.registerForm.value)
      .subscribe(
        response => {
          // Manejar la respuesta del servidor si es necesario
          console.log(response);
          // Mostrar Toast de registro exitoso
          this.presentToast('Registro exitoso.');
          // Reiniciar el formulario
          this.registerForm.reset();
          this.submitted = false;
        },
        error => {
          // Manejar el error de la solicitud si es necesario
          console.error(error);
        }
      );
  }
}
