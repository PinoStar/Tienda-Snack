import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [NgIf],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  userRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();  // Obtenemos el rol desde el servicio
    // console.log('User Role:', this.userRole); // Verifica el valor de userRole
  }
  
}
