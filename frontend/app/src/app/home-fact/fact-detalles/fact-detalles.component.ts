import { Component, OnInit } from '@angular/core';
import { BannerComponent } from "../../banner/banner.component";
import { AuthService } from "../../auth.service";
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { jsPDF } from 'jspdf';
import { Location } from '@angular/common';

interface Detalle {
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-fact-detalles',
  standalone: true,
  imports: [BannerComponent, NgFor,  CommonModule],
  templateUrl: './fact-detalles.component.html',
  styleUrls: ['./fact-detalles.component.css']
})
export class FactDetallesComponent implements OnInit {
  id: number = 0;
  factura: any = {};
  iva: number = 0;
  totalConIva: number = 0;
  fechafinal: string = '';
  isButtonDisabled: boolean = false; // Estado inicial del botón

  constructor(private authService: AuthService, private route: ActivatedRoute, private location: Location) {}
 

  ngOnInit(): void {
    this.cargardatos();
  }

  // Formatea la fecha en formato YYYY-MM-DD
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', fecha);
      return 'Fecha inválida';
    }
    return date.toISOString().split('T')[0];
  }

  // Carga los datos de la factura desde el servicio
  cargardatos() {
    const pedidoId = this.route.snapshot.paramMap.get('pedidoId');
    this.id = Number(pedidoId);
    this.authService.getFactura(this.id).subscribe(
      (data) => {
        this.factura = data.factura;
        if (this.factura?.fecha) {
          this.fechafinal = this.formatearFecha(this.factura.fecha);
        }
        this.calcularIvaYTotal();
      },
      (error) => console.error('Error al cargar los datos', error)
    );
  }

  // Calcula IVA y total con IVA
  calcularIvaYTotal() {
    const subtotal = parseFloat(this.factura.total);
    if (!isNaN(subtotal)) {
      this.iva = subtotal * 0.15;
      this.totalConIva = subtotal + this.iva;
    } else {
      console.error('Subtotal no válido:', this.factura.total);
    }
  }
  addFactura() {
    const data = {
      notaDeVentaId: this.id,
      facturadorId: 1,
      subtotal: this.factura.total,
      total: this.totalConIva,
    };
    this.authService.addFactura(data).subscribe((response) => {
      console.log('Factura agregada:', response);
    });
  }

  onGenerarFactura() {
    this.isButtonDisabled = true; // Bloquear el botón
    this.generarFactura(); // Generar el PDF
  
    // Limpiar la factura
    this.factura = {};
    this.iva = 0;
    this.totalConIva = 0;
  
    // Opción para reactivar el botón después de cierto tiempo (opcional)
    // setTimeout(() => this.isButtonDisabled = false, 5000);
  }
  
  // Genera la factura en PDF
  generarFactura() {
    this.isButtonDisabled = true; // Bloquear el botón
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
    doc.text(`Nombre: ${this.factura.tienda.propietario || 'N/A'}`, 15, 75);
    doc.text(`Dirección: ${this.factura.tienda.direccion || 'N/A'}`, 15, 82);
    doc.text(`RUC: ${this.factura.tienda.ruc || 'N/A'}`, 15, 89);
  
    // Datos de la factura
    doc.setFillColor(250, 250, 250); // Fondo blanco
    doc.rect(10, 95, 190, 20, 'F');
    doc.setFont('bold');
    doc.text(`Nota de Venta ID: ${this.factura.id}`, 15, 105);
    doc.text(`Fecha: ${this.fechafinal}`, 15, 112);
  
    // Tabla de productos
    doc.setFillColor(200, 200, 200); // Encabezado de la tabla
    doc.rect(10, 120, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Producto', 15, 127);
    doc.text('Cantidad', 100, 127);
    doc.text('Precio Unitario', 140, 127);
    doc.text('Subtotal', 180, 127);
  
    let yPosition = 137;
  
    this.factura.detalles.forEach((detalle: Detalle, index: number) => {
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
    doc.text(`Subtotal: $${parseFloat(this.factura.total).toFixed(2)}`, 15, yPosition + 7);
  
    yPosition += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPosition, 190, 10, 'F');
    doc.text(`IVA (15%): $${this.iva.toFixed(2)}`, 15, yPosition + 7);
  
    yPosition += 10;
    doc.setFillColor(200, 200, 200); // Fondo gris oscuro para el total
    doc.rect(10, yPosition, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: $${this.totalConIva.toFixed(2)}`, 15, yPosition + 7);
  
    // Pie de página
    yPosition += 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Gracias por su compra en MundoSnack', 105, yPosition, { align: 'center' });
  
    // Guardar PDF
    doc.save('factura.pdf');
  }
  goBack() {
    this.location.back();
    
  }
  
}
