import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ZMAI-Datathon-2024';
}
