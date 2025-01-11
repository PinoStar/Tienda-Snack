import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; // Asegúrate de importar el servicio AuthService
import { CommonModule } from '@angular/common'; // Importa CommonModule para ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Importa FormsModule para el manejo de formularios

@Component({
  selector: 'app-home-admi',
  standalone: true,
  imports: [CommonModule, FormsModule], // Usa CommonModule y FormsModule en lugar de AppModule
  templateUrl: './home-admi.component.html',
  styleUrls: ['./home-admi.component.css'],
})
export class HomeAdmiComponent implements OnInit {
  usuarios: any[] = [];
  productos: any[] = [];
  tiendas: any[] = [];

  nuevoUsuario = { username: '', password: '', rol: '' };
  nuevoProducto = { nombre: '',descripcion: '', precio: 0, stock: 0, tienda_id: '', imagen_url: '' };
  nuevaTienda = { nombre: '', ubicacion: '' };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar productos, usuarios y tiendas usando el AuthService
    this.authService.getProductos().subscribe(
      (productos) => {
        this.productos = productos;
      },
      (error) => {
        console.error('Error al cargar productos', error);
      }
    );

    this.authService.getUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
      },
      (error) => {
        console.error('Error al cargar usuarios', error);
      }
    );

    this.authService.getTiendas().subscribe(
      (tiendas) => {
        this.tiendas = tiendas;
      },
      (error) => {
        console.error('Error al cargar tiendas', error);
      }
    );
  }

  agregarUsuario() {
    if (this.nuevoUsuario.username && this.nuevoUsuario.password && this.nuevoUsuario.rol) {
      this.authService.agregarUsuario(this.nuevoUsuario).subscribe(
        (usuario) => {
          this.usuarios.push(usuario);
          this.nuevoUsuario = { username: '', password: '', rol: '' }; // Limpiar formulario
        },
        (error) => {
          console.error('Error al agregar usuario', error);
        }
      );
    } else {
      alert('Por favor, complete todos los campos del usuario.');
    }
  }

  eliminarUsuario(id: number) {
    this.authService.eliminarUsuario(id).subscribe(
      () => {
        this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
      },
      (error) => {
        console.error('Error al eliminar usuario', error);
      }
    );
  }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.nuevoProducto.imagen_url = file.name; // Guarda solo el nombre del archivo o la ruta
  //     console.log('Imagen seleccionada:', this.nuevoProducto.imagen_url);
  //   }
  // }

  agregarProducto() {
    if (this.nuevoProducto.nombre && this.nuevoProducto.descripcion && this.nuevoProducto.precio > 0 && this.nuevoProducto.stock >= 0 && this.nuevoProducto.tienda_id != null && this.nuevoProducto.imagen_url != null) {
      console.log('Producto a agregar:', this.nuevoProducto);
      this.authService.agregarProducto(this.nuevoProducto).subscribe(
        (producto) => {
          console.log('Producto agregado:', producto);
          this.productos.push(producto);  // Asegúrate de que el producto agregado se incluya en la lista
          this.nuevoProducto = { nombre: '',descripcion: '', precio: 0, stock: 0, tienda_id: '', imagen_url: '' };  // Limpiar formulario
        },
        (error) => {
          console.error('Error al agregar producto', error);
          alert('Hubo un error al agregar el producto.');
        }
      );
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
  

  eliminarProducto(id: number) {
    this.authService.eliminarProducto(id).subscribe(
      () => {
        this.productos = this.productos.filter((producto) => producto.id !== id);
      },
      (error) => {
        console.error('Error al eliminar producto', error);
      }
    );
  }

  agregarTienda() {
    if (this.nuevaTienda.nombre && this.nuevaTienda.ubicacion) {
      this.authService.agregarTienda(this.nuevaTienda).subscribe(
        (tienda) => {
          this.tiendas.push(tienda);
          this.nuevaTienda = { nombre: '', ubicacion: '' }; // Limpiar formulario
        },
        (error) => {
          console.error('Error al agregar tienda', error);
        }
      );
    } else {
      alert('Por favor, complete todos los campos de la tienda.');
    }
  }

  eliminarTienda(id: number) {
    this.authService.eliminarTienda(id).subscribe(
      () => {
        this.tiendas = this.tiendas.filter((tienda) => tienda.id !== id);
      },
      (error) => {
        console.error('Error al eliminar tienda', error);
      }
    );
  }

  getTiendaNombre(id: number): string {
    const tienda = this.tiendas.find((t) => t.id === id);
    return tienda ? tienda.nombre : 'Sin asignar';
  }
}
