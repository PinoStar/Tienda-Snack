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

  onSubmit(forms:NgForm) {
    this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
            if (response.success) {
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
