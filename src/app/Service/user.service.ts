import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<any> {
    return this.http.post<any>(this.baseUrl, user);
  }
  buscarUser(rut:string):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/${rut}`);

  }
  modificarUser(rut:string,user:User):Observable<User>{
    return this.http.put<User>(`${this.baseUrl}/${rut}`, user);
  }
  eliminarUser(rut:string):Observable<any>{
    return this.http.delete(`${this.baseUrl}/${rut}`);
  }

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
  

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password });
  }

  logout(): void {
    // Borra el token almacenado en localStorage al cerrar sesión
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    // Verifica si hay un token almacenado en localStorage para determinar si el usuario está autenticado
    return localStorage.getItem('token') !== null;

  }
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }
  getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`, { headers: this.getAuthHeaders() });
  }
  

  isAdmin(): Observable<boolean> {
    // Verifica si el usuario actualmente autenticado es administrador
    return this.getUserInfo().pipe(
      map(user => {
        console.log('Tipo de usuario:', user.tipo_usuario );
        const isAdmin = user.tipo_usuario === 'administrador';
        console.log('¿Es administrador?', isAdmin);
        return isAdmin;
      })
    );
  }
  renewTokenIfNeeded(): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<any>(`${this.baseUrl}/profile`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403 && error.error === 'TokenExpiredError') {
          return this.http.get<any>(`${this.baseUrl}/renew-token`, { headers }).pipe(
            map(response => {
              if (response && response.token) {
                localStorage.setItem('token', response.token);
                return true;
              }
              return false;
            }),
            catchError(err => {
              console.error('Error al renovar el token:', err);
              return throwError(err);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  
  getProfesores(): Observable<User[]> {
    const url = `${this.baseUrl}/profesores`;
    return this.http.get<User[]>(url);
  }
}
