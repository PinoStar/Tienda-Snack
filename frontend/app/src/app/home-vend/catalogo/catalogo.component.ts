import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NgFor, RouterLink, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  tiendas: any[] = [];
  selectedTienda: any = null;
  productosSeleccionados: any[] = [];
  pedidoId: number = 0;
  userid: number = 0;
  vendedorId: any[] = []; // Supongamos que es un valor fijo; puedes ajustarlo según sea necesario

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();

    // Recuperar la tienda seleccionada del localStorage
    const tiendaGuardada = this.authService.getTiendaSeleccionada();
    if (tiendaGuardada) {
      this.selectedTienda = tiendaGuardada;
    }

    // Suscribirse al estado de la tienda seleccionada
    this.authService.tiendaSeleccionada$.subscribe((tienda) => {
      this.selectedTienda = tienda; // Actualizar el estado de la tienda seleccionada
    });
  }

  cargarDatosIniciales(): void {
    this.authService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });

    this.authService.getTiendas().subscribe({
      next: (data) => {
        this.tiendas = data;
      },
      error: (err) => {
        console.error('Error al obtener tiendas:', err);
      }
    });

    this.authService.getVendedores().subscribe({
      next: (data) => {
        this.vendedorId = data;
      },
      error: (err) => {
        console.error('Error al obtener vendedores:', err);
      }
    });

    this.authService.getUltimoPedidoId().subscribe({
      next: (ultimoId) => {
        this.pedidoId = ultimoId + 1;
      },
      error: (err) => {
        console.error('Error al obtener el último pedidoId:', err);
        this.pedidoId = 1;
      }
    });
  }

  onTiendaChange(): void {
    if (this.selectedTienda) {
      const userid = this.authService.getUserId();

      if (!userid) {
        alert('No se encontró información del vendedor.');
        return;
      }

      const nuevoPedido = {
        tienda_id: this.selectedTienda,
        vendedor_id: userid,
        total: 0,
        productos: []
      };

      this.authService.generarPedido(nuevoPedido).subscribe({
        next: (response) => {
          console.log('Pedido creado:', response);
          alert('Pedido creado automáticamente con Tienda y Vendedor.');
          this.pedidoId = response.pedidoId || this.pedidoId;
        },
        error: (err) => {
          console.error('Error al crear el pedido:', err);
          alert('Hubo un error al crear el pedido.');
        }
      });

      // Guardar la tienda seleccionada en el localStorage
      this.authService.setTiendaSeleccionada(this.selectedTienda);
    }
  }

  generarPedido(): void {
    if (!this.selectedTienda) {
      alert('Por favor, selecciona una tienda');
      return;
    }

    if (this.productosSeleccionados.length === 0) {
      alert('No has agregado productos al pedido');
      return;
    }

    const pedido = {
      tiendaId: this.selectedTienda.id,
      vendedorId: this.vendedorId,
      productos: this.productosSeleccionados,
      total: this.calcularTotalPedido(),
      pedidoId: this.pedidoId
    };

    this.authService.generarPedido(pedido).subscribe({
      next: () => {
        alert('Pedido generado con éxito');
        this.productosSeleccionados = [];
        this.authService.setTiendaSeleccionada(this.selectedTienda);
        //this.authService.clearTiendaSeleccionada(); // Limpiar la tienda seleccionada
        this.pedidoId++;
      },
      error: (err) => {
        console.error('Error al generar el pedido:', err);
        alert('Hubo un error al generar el pedido.');
      }
    });
  }

  agregarProductoAlPedido(producto: any): void {
    const productoExistente = this.productosSeleccionados.find(p => p.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      const productoConCantidad = { ...producto, cantidad: 1 };
      this.productosSeleccionados.push(productoConCantidad);
    }
  }

  calcularTotalPedido(): number {
    return this.productosSeleccionados.reduce(
      (total, producto) => total + (producto.precio * producto.cantidad),
      0
    );
  }
}
