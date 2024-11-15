import { Routes } from '@angular/router';
import { HomeVendComponent } from './home-vend/home-vend.component';
import { HomeFactComponent } from './home-fact/home-fact.component';
import { HomeAdmiComponent } from './home-admi/home-admi.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'HomeVend', component: HomeVendComponent },
  { path: 'HomeFact', component: HomeFactComponent },
  { path: 'HomeAdmi', component: HomeAdmiComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección a /login
  { path: '**', component: LoginComponent } // Ruta wildcard para cualquier otra ruta
];


