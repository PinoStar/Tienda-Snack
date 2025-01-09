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
  tiendas: any[] = [];    // Array para almacenar las tiendas

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getTiendas().subscribe({
      next: (data) => {
        this.tiendas = data;  // Asigna las tiendas recibidas a la variable
        console.log('Tiendas cargadas:', this.tiendas);
      },
      error: (err) => {
        console.error('Error al obtener tiendas:', err);
      }
    });
  }
}
