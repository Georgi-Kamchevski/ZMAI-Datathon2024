import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MapComponent } from "./map/map.component";
import { FilterComponent } from './filter/filter.component';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MapComponent, FilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent implements OnInit{
  title = 'ZMAI-Datathon-2024';
  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.loadCSV().subscribe();
  }
 


}


