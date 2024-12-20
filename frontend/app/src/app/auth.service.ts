import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // Base URL

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }

  // Métodos para obtener productos, usuarios y tiendas
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/productos`);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`);
  }

  getTiendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tiendas`);
  }

  // Métodos para agregar productos, usuarios y tiendas
  agregarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios`, usuario);
  }

  agregarProducto(producto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/productos`, producto);
  }

  agregarTienda(tienda: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tiendas`, tienda);
  }

  // Métodos para eliminar productos, usuarios y tiendas
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/usuarios/${id}`);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/productos/${id}`);
  }

  eliminarTienda(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tiendas/${id}`);
  }

}
