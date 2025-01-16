import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NgFor, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { BannerComponent } from "../../banner/banner.component";

@Component({
  selector: 'app-nota-venta',
  standalone: true,
  imports: [NgFor, BannerComponent, NgIf],
  templateUrl: './nota-venta.component.html',
  styleUrls: ['./nota-venta.component.css']
})
export class NotaVentaComponent implements OnInit {
  productos: any[] = [];
  totalSinImpuesto: number = 0;
  impuesto: number = 0;
  totalConImpuesto: number = 0;
  productosGenerados: boolean = false;  // Bandera para controlar la visibilidad

  constructor(private authService: AuthService, private location: Location, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargardatos();
  }

  cargardatos() {
    this.authService.getpedidosproductos().subscribe(
      (data: any) => {
        this.productos = data;
        console.log('Productos del ultimo pedido:', this.productos);
        // Calcular los totales después de cargar los productos
        this.calcularTotales();
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
      }
    );
  }

  calcularTotales() {
    this.totalSinImpuesto = this.productos.reduce((total, producto) => {
      const subtotal = Number(producto.subtotal);
      return total + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);

    this.totalSinImpuesto = parseFloat(this.totalSinImpuesto.toFixed(2));
    this.impuesto = this.totalSinImpuesto * 0.15;
    this.impuesto = parseFloat(this.impuesto.toFixed(2));
    this.totalConImpuesto = this.totalSinImpuesto + this.impuesto;
    this.totalConImpuesto = parseFloat(this.totalConImpuesto.toFixed(2));
  }

  GenerarNota() {
    this.authService.getUltimoPedidoIddeta().subscribe(pedidoData => {
      const pedidoId = pedidoData.ultimoId;
      const vendedorId = this.authService.getUserId();
      const total = this.totalSinImpuesto;

      console.log("pedidoId", pedidoId);

      this.authService.addNotaVenta({ pedidoId, vendedorId, total }).subscribe(
        (data: any) => {
          console.log('Nota de venta agregada:', data);
          alert("Nota de Venta generada correctamente!");

          // Cambiar la bandera para ocultar los productos después de generar la nota
          this.productosGenerados = true;

          // Limpiar productos y totales después de generar la nota
          this.productos = [];  // Vaciar la lista de productos
          this.totalSinImpuesto = 0;  // Restablecer el total sin impuesto
          this.impuesto = 0;  // Restablecer el impuesto
          this.totalConImpuesto = 0;  // Restablecer el total con impuesto
          
        },
        (error) => {
          console.error('Error al agregar nota de venta:', error);
          alert("Hubo un error al generar la Nota de Venta.");
        }
      );
    }, error => {
      console.error('Error al obtener el último pedidoId:', error);
      alert("Hubo un error al obtener el último ID de pedido.");
    });
  }

  goBack(): void {
    this.location.back();
  }
}
