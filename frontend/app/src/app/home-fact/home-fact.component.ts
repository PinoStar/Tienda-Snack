import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home-fact',
  standalone: true,
  imports: [BannerComponent,NgFor,RouterLink],
  templateUrl: './home-fact.component.html',
  styleUrl: './home-fact.component.css'
})
export class HomeFactComponent {
  constructor(private authService: AuthService) { }
  pedidos: any[] = [];
  ngOnInit(): void {
    this.cargarnotas();
  }
  cargarnotas() {
    this.authService.getNotaVenta().subscribe({
      next: (data) => {
        this.pedidos = data.map(pedido => ({
          ...pedido,
          fecha: new Date(pedido.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
          
        }));
        
        console.log('Notas de venta recibidas:', this.pedidos);
      },
      error: (err) => {
        console.error('Error al obtener notas de venta:', err);
      }
    });
  }


  
  
}
