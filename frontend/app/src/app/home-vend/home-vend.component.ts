import { Component } from '@angular/core';
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
export class HomeVendComponent {
  
  visto:boolean=true;
  view: string = 'RegistroPedi';  // Estado inicial




  // vista(){
  //   if (this.visto !=true){
  //     this.view=vie
  //   }
  // }

  switchView(viewName: string) {
    this.view = viewName;
  }

  
  // switchViews(visto:boolean) {
  //   if (this.visto !=true){
  //     this.view = 'HomeFact';
  //     this.visto=true
  //   }else{
  //     this.view = 'RegistroPedi';
  //     this.visto=false
  //   }
    
  // }
}
