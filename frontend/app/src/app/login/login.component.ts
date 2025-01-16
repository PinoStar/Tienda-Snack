import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [HttpClientModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}
    ngOnInit(): void { // Reemplaza la URL actual para evitar que el usuario vuelva atrás 
        history.pushState(null, '', location.href); 
        window.addEventListener('popstate', function(event) { 
         history.pushState(null, '', location.href); 
        });
    }
  onSubmit(forms:NgForm) {
    this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
            if (response.success) {
                // alert('Usuario autenticado pero no sabe el rol jaja');
                localStorage.setItem('userRole', response.rol);
                // Redirigir según el rol
                if (response.rol === 'vendedor') {
                    this.router.navigate(['/HomeVend']);
                } else if (response.rol === 'facturador') {
                    this.router.navigate(['/HomeFact']);
                } else if (response.rol === 'administrador') {
                    this.router.navigate(['/HomeAdmi']);
                }
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        },
        error: () => {
            alert('Error en el servidor. Intente nuevamente.');
        }
    });
  }
}
