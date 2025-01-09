import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NgFor],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent  implements OnInit {
  productos: any[] = [];  // Array para almacenar los productos

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;  // Asigna los productos recibidos a la variable
        // console.log('Productos cargados:', this.productos);
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });
  }
}
 


