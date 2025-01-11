import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { RegistroPediComponent } from '../registro-pedi/registro-pedi.component';
import { BannerComponent } from "../banner/banner.component";
import { CatalogoComponent } from './catalogo/catalogo.component';

@Component({
  selector: 'app-home-vend',
  standalone: true,
  imports: [
    CommonModule, // Asegúrate de incluir CommonModule aquí
    RegistroPediComponent,
    BannerComponent,
    CatalogoComponent
  ],
  templateUrl: './home-vend.component.html',
  styleUrls: ['./home-vend.component.css']  // Fíjate que sea 'styleUrls' en plural
})
export class HomeVendComponent implements OnInit {
  view: string = 'RegistroPedi'; // Estado inicial

  ngOnInit(): void {
    // Cargar el estado guardado desde localStorage al iniciar
    const savedView = localStorage.getItem('currentView');
    if (savedView) {
      this.view = savedView; // Restaurar la vista desde localStorage
    }
  }

  switchView(viewName: string) {
    this.view = viewName; // Cambiar la vista actual
    localStorage.setItem('currentView', viewName); // Guardar la vista en localStorage
  }
}
