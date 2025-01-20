import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap,BehaviorSubject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://tienda-snack-1.onrender.com'; // Base URL

  constructor(private http: HttpClient) {}
  private tiendaSeleccionadaSubject = new BehaviorSubject<any>(null); // Estado de la tienda seleccionada
  tiendaSeleccionada$ = this.tiendaSeleccionadaSubject.asObservable();


  setTiendaSeleccionada(tienda: any): void {
    this.tiendaSeleccionadaSubject.next(tienda);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('tiendaSeleccionada', JSON.stringify(tienda));
    }
  }

  clearTiendaSeleccionada(): void {
    this.tiendaSeleccionadaSubject.next(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('tiendaSeleccionada');
    }
  }

  getTiendaSeleccionada(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const tienda = localStorage.getItem('tiendaSeleccionada');
      return tienda ? JSON.parse(tienda) : null;
    }
    return null;
  }
  


  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('id', response.id);  // Guardamos el userId
            localStorage.setItem('userRole', response.rol);  // Guardamos el rol
          }
        })
      );
  }
  
  
  getUserId(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('id') || '';  // Devuelve el userId o una cadena vacía si no existe
    }
    return '';  // Si no está disponible localStorage, devuelve una cadena vacía
  }
  

  getRole(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userRole') || '';  // Devuelve el rol o una cadena vacía si no existe
    }
    return '';  // Si no está disponible localStorage, devuelve una cadena vacía
  }
  
  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/productos/${id}`);
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

  // Métodos en AuthService

  getPedidoId(): number | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const pedidoId = localStorage.getItem('pedidoId');
      return pedidoId ? parseInt(pedidoId, 10) : null;
    }
    return null;
  }

  getProductosPedido(pedidoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pedidos_productos/${pedidoId}`);
  }

  generarPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pedidos`, pedido);
  }
  getUltimoPedidoId(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/pedidos/ultimoId`);
  }

  // En AuthService
  getUltimoPedidoIddeta(): Observable<{ ultimoId: number }> {
    return this.http.get<{ ultimoId: number }>(`${this.baseUrl}/pedidos/ultimoId`);
  }

  getProductosDelUltimoPedido(): Observable<any[]> {
    return this.getUltimoPedidoId().pipe(
      switchMap((ultimoPedidoId: number) => this.getProductosPedido(ultimoPedidoId))
    );
  }

  getpedidosproductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pedidosid/productos`);
  }


  getVendedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empleados`);
  }

  addNotaVenta(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/notadeventa`, data);
  }
  getNotaVenta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notadeventa`);
  }
  getNotaVentaId(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notadeventa/ultimoId`);
  }
  getFactura(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/factura/${id}`);
  }
  
  addFactura(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/factura`, data);
  }

  getHistorialPedido(tiendaid: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/facturas/${tiendaid}`);
  }

  getproductosfactura(facturaId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/producfactura/${facturaId}`);
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

  editarusuario(id:number):Observable<void>{
    return this.http.put<void>(`${this.baseUrl}/usuarios/${id}`, id);
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
  addPedido(pedidoData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pedidos_productos`, pedidoData);
  }



}
