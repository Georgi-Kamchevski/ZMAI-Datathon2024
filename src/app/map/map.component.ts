import { Component,  OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: any;

  // Array containing lat, lon pairs
  private markerValues = [
    41.7104071,22.8467131, // Берово - ООУ „Дедо Иљо Малешевски“
    41.7077826,22.8545511,
    41.707950780384465, 22.855144797486066,

  ];

  // Initialize the map
  private initMap(): void {
    this.map = L.map('map', {
      center: [41.707382506518876, 22.85278959464174],  // Centered on the first location
      zoom: 14,  // Zoom level
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  
    tiles.addTo(this.map);

    this.addMarkers();  // Call the function to add markers
  }

  // Function to add multiple markers to the map
  private addMarkers(): void {
    const defaultIconWithoutShadow = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],  // Size of the icon
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowUrl: ''  // Remove shadow
    });

    // Loop through the markerValues array, adding markers in pairs (lat, lon)
    for (let i = 0; i < this.markerValues.length; i += 2) {
      const lat = this.markerValues[i];
      const lon = this.markerValues[i + 1];

      // Create a marker at the given lat, lon
      const marker = L.marker([lat, lon], { icon: defaultIconWithoutShadow });
        marker.addTo(this.map);
    }
  }

  constructor() { }

  // Initialize the map after the view has been initialized
  ngOnInit(): void {
    this.initMap();
  }
}