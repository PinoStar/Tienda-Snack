import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";

@Component({
  selector: 'app-home-fact',
  standalone: true,
  imports: [BannerComponent],
  templateUrl: './home-fact.component.html',
  styleUrl: './home-fact.component.css'
})
export class HomeFactComponent {

}
