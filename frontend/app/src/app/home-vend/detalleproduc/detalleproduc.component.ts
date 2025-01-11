import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from "../../banner/banner.component"; // Importa FormsModule para ngModel

@Component({
    selector: 'app-detalleproduc',
    standalone: true,
    imports: [CommonModule, FormsModule, BannerComponent], // Agrega FormsModule aquí
    templateUrl: './detalleproduc.component.html',
    styleUrls: ['./detalleproduc.component.css']
})
export class DetalleProducComponent implements OnInit {
    producto: any = null;
    cantidad: number = 1;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.authService.getProductoById(+id).subscribe({
                next: (data) => this.producto = data,
                error: (err) => console.error('Error al obtener producto:', err),
            });
        }
    }

    adjustQuantity(delta: number): void {
        this.cantidad = Math.max(1, this.cantidad + delta);
    }

    addToCart(): void {
        console.log(`Añadido al carrito: ${this.cantidad} de ${this.producto?.nombre}`);
    }
}
