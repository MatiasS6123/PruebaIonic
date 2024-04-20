export interface User {
    _id:string;
    rut: string;
    nombre: string;
    apellido: string;
    edad: number;
    tipo_usuario: string;
    email: string;
    password: string; // Cambiado de "contrasena" a "password"
}
