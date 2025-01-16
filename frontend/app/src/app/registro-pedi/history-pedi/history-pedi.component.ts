import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BannerComponent } from '../../banner/banner.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-history-pedi',
  standalone: true,
  imports: [NgFor, CommonModule, BannerComponent, RouterLink],
  templateUrl: './history-pedi.component.html',
  styleUrls: ['./history-pedi.component.css','../../home-fact/home-fact.component.css'] // Corregido: styleUrls en plural
})
export class HistoryPediComponent {
  pedidos: any[] = []; // Ajusta el tipo si tienes un modelo definido
  tiendaId: number=0;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }
  // loaddata(){
  //   this.authService.getHistorialPedido().subscribe({
  //     next: (data) => {
  //       this.pedidos = data;
  //       console.log('Pedidos cargados:', this.pedidos);
  //     },
  //     error: (err) => {
  //       console.error('Error al obtener pedidos:', err);
  //     }
  //   });
  // }

  cargarPedidos(): void {
    const tiendaId = this.route.snapshot.paramMap.get('tiendaId'); // Corregido: 'tiendaId' como string
    if (tiendaId !== null) {
      const tiendaIdNumber = Number(tiendaId); // Convertir tiendaId a número
      this.authService.getHistorialPedido(tiendaIdNumber).subscribe({
        next: (data) => {
          this.pedidos = data; // Asigna los pedidos recibidos
          console.log('Pedidos cargados:', this.pedidos);
        },
        error: (err) => {
          console.error('Error al obtener pedidos:', err);
        }
      });
    } else {
      console.error('No se encontró el ID de la tienda en la URL');
    }
  }

  goBack(): void {
    this.location.back();
  }
}
