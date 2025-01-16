import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from '../../banner/banner.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalleproduc',
  standalone: true,
  imports: [FormsModule, BannerComponent],
  templateUrl: './detalleproduc.component.html',
  styleUrls: ['./detalleproduc.component.css']
})
export class DetalleProducComponent implements OnInit {
  producto: any = null; // Datos del producto
  cantidad: number = 0; // Cantidad seleccionada
  subtotal: number = 0; // Subtotal calculado
  ultimoPedidoId: number = 0; // Último ID del pedido

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Obtiene el ID del producto desde la ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(+id); // Cargar producto con el ID obtenido
    }
  }
  
  cargarProducto(id: number): void {
    // Cargar el producto por ID
    this.authService.getProductoById(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.calcularSubtotal();
      },
      error: (err) => console.error('Error al obtener producto:', err),
    });
  
    this.authService.getUltimoPedidoIddeta().subscribe({
  next: (response) => {
    console.log('Respuesta del servidor:', response);
    // Acceder correctamente a 'ultimoId' y convertirlo a número
    const ultimoId = Number(response.ultimoId);  // Acceder directamente a 'ultimoId'
    if (!isNaN(ultimoId)) {
      this.ultimoPedidoId = ultimoId;
    } else {
      console.error('El ID recibido no es un número válido');
    }
  },
  error: (err) => {
    console.error('Error al obtener último pedido ID:', err);
  }
});

  }
  

  adjustQuantity(delta: number): void {
    if (this.producto?.stock === 0) {
      alert('No se puede agregar más, el producto está fuera de stock.');
      return;
      
    }

    const nuevaCantidad = this.cantidad + delta;
    // Ajustar la cantidad dentro del rango permitido
    this.cantidad = Math.max(1, Math.min(nuevaCantidad, this.producto?.stock || nuevaCantidad));
    this.calcularSubtotal();
  }
  

  calcularSubtotal(): void {
    if (this.producto) {
      // Calcular el subtotal del pedido
      this.subtotal = parseFloat((this.cantidad * this.producto.precio).toFixed(2));
    }
  }

  addPedido(): void {
    // Verificar que el producto y el último ID de pedido estén disponibles
    if (!this.producto || this.ultimoPedidoId === 0) {
      console.error('Error: Producto no disponible o ID de pedido no encontrado.');
      return;
    }
  
    // Asegurarse de que solo el valor de 'ultimoPedidoId' se pase como 'pedido_id'
    const pedidoData = {
      pedidoId: this.ultimoPedidoId,  // Asegurarse de que solo el valor sea asignado
      productoId: this.producto.id,
      cantidad: this.cantidad,
      subtotal: this.subtotal
    };
  
    // Verificar los datos antes de enviarlos
    console.log('Datos del pedido:', pedidoData);
  
    // Llamar al método del servicio para agregar el pedido en la base de datos
    this.authService.addPedido(pedidoData).subscribe({
      next: (response) => {
        console.log('Pedido agregado con éxito:', response);
        alert('Pedido agregado con éxito');
        this.cargarProducto(this.producto.id);
        
        // Opcional: resetear la cantidad y subtotal después de agregar el pedido
        this.cantidad = 0;
        this.subtotal = 0;
  
        // Redirigir al usuario al catálogo o a la vista del pedido si es necesario
        // this.location.back();
      },
      error: (err) => {
        console.error('Error al agregar el pedido:', err);
        alert('Error al agregar el pedido');
      }
    });
  }
  
  

  goBack(): void {
    // Navegar hacia atrás en el historial de navegación
    this.location.back();
  }
}
