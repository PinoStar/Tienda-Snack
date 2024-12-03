import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { AuthService } from '../auth.service';  // Ajusta la ruta según tu estructura
@Component({
  selector: 'app-registro-pedi',
  standalone: true,
  imports: [CommonModule],  // Agrega CommonModule aquí
  templateUrl: './registro-pedi.component.html',
  styleUrl: './registro-pedi.component.css'
})
export class RegistroPediComponent implements OnInit {
  productos: any[] = [];  // Array para almacenar los productos

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;  // Asigna los productos recibidos a la variable
        console.log('Productos cargados:', this.productos);
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });
  }
}
