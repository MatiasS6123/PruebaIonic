import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { GestionCurso } from 'src/models/gestionC';
import { UserService } from './user.service';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class GestionCService {
  private baseUrl = 'http://localhost:3000/api/curso'; // Corregir la URL base

  constructor(private http: HttpClient,private userService:UserService) {}

  asignarCurso(gestionCurso: GestionCurso): Observable<GestionCurso> {
    return this.http.post<GestionCurso>(this.baseUrl, gestionCurso);
  }

  getEstudiantes(): Observable<GestionCurso[]> {
    return this.http.get<GestionCurso[]>(this.baseUrl);
  }

  // Método para obtener un estudiante por su ID
  getCursoByNombre(nombreProfesor: string): Observable<GestionCurso> {
    return this.http.get<GestionCurso>(`${this.baseUrl}/${nombreProfesor}`);
  }

  updateCurso(nombreProfesor: string, curso: GestionCurso): Observable<GestionCurso> {
    return this.http.put<GestionCurso>(`${this.baseUrl}/${nombreProfesor}`, curso);
  }
  

  // Método para eliminar un estudiante por su ID
  deleteCurso(nombreProfesor: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${nombreProfesor}`);
  }

  getCursosAsignados(rutProfesor: string): Observable<GestionCurso[]> {
    return this.http.get<GestionCurso[]>(`${this.baseUrl}/${rutProfesor}/cursos`);
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  
}
