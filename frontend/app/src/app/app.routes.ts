import { Routes } from '@angular/router';
import { HomeVendComponent } from './home-vend/home-vend.component';
import { HomeFactComponent } from './home-fact/home-fact.component';
import { HomeAdmiComponent } from './home-admi/home-admi.component';
import { LoginComponent } from './login/login.component';
import { RegistroPediComponent } from './registro-pedi/registro-pedi.component';
import { CatalogoComponent } from './home-vend/catalogo/catalogo.component';
import { AppComponent } from './app.component';
import { DetalleProducComponent } from './home-vend/detalleproduc/detalleproduc.component';
import { NotaVentaComponent } from './home-vend/nota-venta/nota-venta.component';
import { HistoryPediComponent } from './registro-pedi/history-pedi/history-pedi.component';
import { FactDetallesComponent } from './home-fact/fact-detalles/fact-detalles.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'HomeVend', component: HomeVendComponent },
  { path: 'HomeFact', component: HomeFactComponent },
  { path: 'HomeAdmi', component: HomeAdmiComponent },
  { path: 'RegistroPedi', component: RegistroPediComponent },
  {path:'HistoryPedi',component:HistoryPediComponent},
  {path: 'FactDetalles',component:FactDetallesComponent},
  {path:'detalleproduc',component:DetalleProducComponent},
  {path:'NotaVenta',component:NotaVentaComponent},
  { path: 'detallesproduc/:id', component: DetalleProducComponent },
  {path: 'Catalogo',component:CatalogoComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección a /login
  //{ path: '**', component: LoginComponent } // Ruta wildcard para cualquier otra ruta
];


