import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MapComponent } from "./map/map.component";
import { FilterComponent } from './filter/filter.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MapComponent, FilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {
  title = 'ZMAI-Datathon-2024';

 
  constructor() {}


}


