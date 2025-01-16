import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { SharedService } from '../services/shared.service';
import { AuthService } from '../../auth.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BannerComponent } from '../../banner/banner.component';
import { HttpClientModule } from '@angular/common/http';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-prodcutos-his',
  standalone: true,
  imports: [BannerComponent,CommonModule,NgFor, HttpClientModule],
  templateUrl: './prodcutos-his.component.html',
  styleUrls: ['./prodcutos-his.component.css','../../home-fact/fact-detalles/fact-detalles.component.css']
})
export class ProdcutosHisComponent implements OnInit {
  factura: any = {};

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // const facturaId = this.route.snapshot.params['pedidos.factura_id'];
    this.getFactura();
  }

  getFactura(): void {
    const facturaId = this.route.snapshot.paramMap.get('facturaId'); // Obtiene el parámetro 'facturaId' de la URL
  
    if (facturaId !== null) {
      const facturaIdNumber = Number(facturaId); // Convierte el parámetro a número
  
      this.authService.getproductosfactura(facturaIdNumber).subscribe({
        next: (data) => {
          if (Array.isArray(data) && data.length > 0) {
            // Agrupar los productos por factura
            const facturaAgrupada = {
              factura_id: data[0].factura_id,
              fecha_factura: data[0].fecha_factura,
              subtotal_factura: data[0].subtotal_factura,
              iva_factura: data[0].iva_factura,
              total_factura: data[0].total_factura,
              nombre_tienda: data[0].nombre_tienda,
              direccion_tienda: data[0].direccion_tienda,
              ruc_tienda: data[0].ruc_tienda,
              propietario_tienda: data[0].propietario_tienda,
              detalles: data.map(item => ({
                nombre_producto: item.nombre_producto,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario,
                subtotal: item.subtotal
              }))
            };
            this.factura = facturaAgrupada; // Asigna la factura agrupada a la variable factura
          } else {
            console.warn('No se encontraron datos de factura.');
          }
          console.log('Factura cargada:', this.factura);
          console.log('Factura ID:', facturaId);
        },
        error: (error) => {
          console.error('Error al cargar la factura:', error);
        },
      });
    } else {
      console.warn('No se encontró el parámetro facturaId en la ruta.');
      console.log('Factura ID:', facturaId);
    }
  }
  
  

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString();
  }

  goBack(): void {
    window.history.back();
  }

  generarFactura(): void {
    
    const doc = new jsPDF();
  
    // Encabezado principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Factura', 105, 20, { align: 'center' });
  
    // Información de la tienda
    doc.setFontSize(12);
    doc.setFillColor(230, 230, 230); // Fondo gris claro
    doc.rect(10, 25, 190, 30, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('MundoSnack', 15, 35);
    doc.text('Dirección: Calle Ficticia 123, Ciudad, País', 15, 42);
    doc.text('RUC: 1234567890', 15, 49);
  
    // Datos del cliente
    doc.setFillColor(240, 240, 240); // Fondo gris muy claro
    doc.rect(10, 60, 190, 30, 'F');
    doc.text('Datos del Cliente:', 15, 68);
    doc.setFont('normal');
    doc.text(`Nombre: ${this.factura.propietario_tienda || 'N/A'}`, 15, 75);
    doc.text(`Dirección: ${this.factura.direccion_tienda || 'N/A'}`, 15, 82);
    doc.text(`RUC: ${this.factura.ruc_tienda || 'N/A'}`, 15, 89);
  
    // Datos de la factura
    doc.setFillColor(250, 250, 250); // Fondo blanco
    doc.rect(10, 95, 190, 20, 'F');
    doc.setFont('bold');
    doc.text(`Factura ID: ${this.factura.factura_id}`, 15, 105);
    doc.text(`Fecha: ${this.formatearFecha(this.factura.fecha_factura)}`, 15, 112);
  
    // Tabla de productos
    doc.setFillColor(200, 200, 200); // Encabezado de la tabla
    doc.rect(10, 120, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Producto', 15, 127);
    doc.text('Cantidad', 100, 127);
    doc.text('Precio Unitario', 140, 127);
    doc.text('Subtotal', 180, 127);
  
    let yPosition = 137;
  
    this.factura.detalles.forEach((detalle: any, index: number) => {
      const precioUnitario = parseFloat(detalle.precio_unitario.toString());
      const subtotal = parseFloat(detalle.subtotal.toString());
  
      if (isNaN(precioUnitario) || isNaN(subtotal)) {
        console.error('Datos inválidos en detalle:', detalle);
        return;
      }
  
      doc.setFillColor(index % 2 === 0 ? 245 : 255, 245, 245); // Alternar color de filas
      doc.rect(10, yPosition, 190, 10, 'F');
      doc.setFont('normal');
      doc.text(detalle.nombre_producto, 15, yPosition + 7);
      doc.text(String(detalle.cantidad), 100, yPosition + 7);
      doc.text(`$${precioUnitario.toFixed(2)}`, 140, yPosition + 7);
      doc.text(`$${subtotal.toFixed(2)}`, 180, yPosition + 7);
      yPosition += 10;
    });
  
    // Resumen de totales
    yPosition += 10;
    doc.setFont('bold');
    doc.setFillColor(240, 240, 240); // Fondo gris claro para totales
    doc.rect(10, yPosition, 190, 10, 'F');
    doc.text(`Subtotal: $${parseFloat(this.factura.subtotal_factura).toFixed(2)}`, 15, yPosition + 7);
  
    yPosition += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPosition, 190, 10, 'F');
    doc.text(`IVA (15%): $${parseFloat(this.factura.iva_factura).toFixed(2)}`, 15, yPosition + 7);
  
    yPosition += 10;
    doc.setFillColor(200, 200, 200); // Fondo gris oscuro para el total
    doc.rect(10, yPosition, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: $${parseFloat(this.factura.total_factura).toFixed(2)}`, 15, yPosition + 7);
  
    // Pie de página
    yPosition += 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Gracias por su compra en MundoSnack', 105, yPosition, { align: 'center' });
  
    // Guardar PDF
    doc.save('factura.pdf');
  }
}
