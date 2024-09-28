import { Component, OnInit } from '@angular/core';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Offcanvas } from 'bootstrap'; // Import Offcanvas
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
    {coords:"41.707950780384465, 22.855144797486066",id:1,centralno:"x"},
    
     // Берово - ООУ „Дедо Иљо Малешевски“
    {coords:"41.7369176, 22.8390488",id:2},
    {coords:"41.7631614, 22.7766109",id:3},
    {coords:"41.7097895, 22.7836551",id:4},
    {coords:"41.7799433, 22.7413956",id:5},
    {coords:"41.6738929, 22.8519488",id:6},
    {coords:"41.5904433, 22.9185855",id:7,centralno:"x"},
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
      // iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconUrl: "../assets/pngwing.com.png",
      iconSize: [50, 41],  // Size of the icon
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      // riseOnHover: true,
      shadowUrl: '',  // Remove shadow
    });

    // Loop through the markerValues array, adding markers in pairs (lat, lon)
    for (let i = 0; i < this.markerValues.length; i += 2) {
      const coords = this.markerValues[i].coords.split(", ").map(Number);
  const lat: number = coords[0];
  const lon: number = coords[1];

      // Create a marker at the given lat, lon
      const marker = L.marker([lat, lon], { icon: defaultIconWithoutShadow });
      marker.on('click',(e: any) => {  // Use an arrow function to retain 'this'
        const popLocation = new L.LatLng(lat, lon);
        const popup = L.popup({
          autoClose: true,
          closeOnClick: true,
          // autoPan:false,
        })
          .setLatLng(popLocation)
          .setContent('<p>Берово - ООУ „Дедо Иљо Малешевски</p>')
          .openOn(this.map);  // 'this' refers to the MapComponent's map instance
          this.map.setView([lat, lon], 18);

          const offcanvasElement = document.getElementById('offcanvasRight');
        if (offcanvasElement) {
          const bsOffcanvas = new Offcanvas(offcanvasElement); // Use Offcanvas from Bootstrap
          bsOffcanvas.show();
        }

        })
      const coordsRad = this.markerValues[0].coords.split(", ").map(Number);
      const latRad: number = coordsRad[0];
      const lonRad: number = coordsRad[1];
      const furthestSchool = 24000;
      const circle = L.circle([latRad, lonRad], {
        radius: furthestSchool, // Radius in meters
        color: '#FDFFFC', // Optional: specify color
        fillColor: '#FDFFFC', // Optional: specify fill color
        fillOpacity: 0.1 // Optional: specify fill opacity
      }).addTo(this.map);
        marker.addTo(this.map);
    }
    }
    
  constructor() { }

  // Initialize the map after the view has been initialized
  ngOnInit(): void {
    this.initMap();
  }
}