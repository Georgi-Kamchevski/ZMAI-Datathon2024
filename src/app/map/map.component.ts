import { Component, OnInit, effect, signal } from '@angular/core';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Offcanvas } from 'bootstrap';
import * as L from 'leaflet';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { DataService } from '../data.service'; // Import your DataService
import { LocationData } from '../modals/locationData'; // Import your model

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [provideEcharts()]
})
export class MapComponent implements OnInit {
  private map: any;
  public filteredData: LocationData[] = [];
  options!: EChartsOption;
  

  constructor(private dataService: DataService) {
    // Get the signal from DataService
    const filteredDataSignal = this.dataService.getFilteredLocationData() ;

    // Create an effect to reactively update when the signal changes
    effect(() => {
      this.filteredData = filteredDataSignal();  // Retrieve the filtered data from the signal
      console.log('Filtered data in map component:', this.filteredData);

      // After retrieving filtered data, update the map markers
      if (this.filteredData && this.filteredData.length > 0) {
        this.addMarkers(); // Ensure you update the markers based on filtered data
      }
    });
  }  // Inject DataService

  // Initialize the map
  private initMap(): void {
    this.map = L.map('map', {
      center: [41.707382506518876, 22.85278959464174],
      zoom: 14,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.addMarkers();  // Call the function to add markers
  }

  // Function to add markers to the map based on the filtered data
  private addMarkers(): void {
    if (this.filteredData && this.filteredData.length) {
      const defaultIconWithoutShadow = L.icon({
        iconUrl: "../assets/pngwing.com.png",
        iconSize: [50, 41],  
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowUrl: '',  
      });

      // Loop through the filteredData array to add markers dynamically

      

      this.filteredData.forEach((location) => {
        const coords = location.coordinates_podracno
        .split(",").map(Number);
        const lat: number = coords[0];
        const lon: number = coords[1];

        const coordsCent = this.filteredData[0].coordinates_centralno
        .split(",").map(Number);
         let latCent: number = coordsCent[0];
         let lonCent: number = coordsCent[1];
        
        const marker = L.marker([lat, lon], { icon: defaultIconWithoutShadow });
        marker.on('click', (e: any) => {
          const popLocation = new L.LatLng(lat, lon);
          const popup = L.popup({
            autoClose: true,
            closeOnClick: true,
          })
          .setLatLng(popLocation)
          .setContent(`<p>${location.osnovno_ucilishte}</p>`)
          .openOn(this.map);

          this.map.setView([lat, lon], 18);

          const offcanvasElement = document.getElementById('offcanvasRight');
          if (offcanvasElement) {
            const bsOffcanvas = new Offcanvas(offcanvasElement);
            bsOffcanvas.show();
          }
        });

        const markerCent = L.marker([latCent, lonCent], { icon: defaultIconWithoutShadow });
        markerCent.on('click', (e: any) => {
          const popLocation = new L.LatLng(latCent, lonCent);
          const popup = L.popup({
            autoClose: true,
            closeOnClick: true,
          })
          .setLatLng(popLocation)
          .setContent(`<p>${location.osnovno_ucilishte}</p>`)
          .openOn(this.map);

          this.map.setView([latCent, lonCent], 18);

          const offcanvasElement = document.getElementById('offcanvasRight');
          if (offcanvasElement) {
            const bsOffcanvas = new Offcanvas(offcanvasElement);
            bsOffcanvas.show();
          }
        });

      const circle = L.circle([latCent, lonCent], {
        radius: this.filteredData[0].distance*1000, // Radius in meters
        color: '#FDFFFC', // Optional: specify color
        fillColor: '#FDFFFC', // Optional: specify fill color
        fillOpacity: 0.1 // Optional: specify fill opacity
      }).addTo(this.map);

        marker.addTo(this.map);
        markerCent.addTo(this.map);

      });
    }
  }

  ngOnInit(): void {
    this.initMap();

    // Use an effect to listen to changes in the filteredLocationData signal
    

    // Example chart data (You can keep the chart logic as is)
    const xAxisData = [];
    const data2019 = [];
    const data2020 = [];
    const data2021 = [];
    const data2022 = [];
    const data2023 = [];
    const data2024 = [];

    for (let i = 2018; i < 2024; i++) {
      xAxisData.push(i + ' година');
      data2019.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2020.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2021.push((Math.cos(i / 3) * (i / 3 - 10) + i / 6) * 5);
      data2022.push((Math.cos(i / 3) * (i / 3 - 10) + i / 6) * 5);
      data2023.push((Math.cos(i) * (i - 10) + i / 6) * 5);
      data2024.push((Math.cos(i) * (i - 10) + i / 6) * 5);
    }

    this.options = {
      legend: {
        data: ['2019', '2020', '2021', '2022', '2023', '2024'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: '2019',
          type: 'line',
          data: data2019,
          animationDelay: idx => idx * 10,
        },
        {
          name: '2020',
          type: 'line',
          data: data2020,
          animationDelay: idx => idx * 10 + 100,
        },
        {
          name: '2021',
          type: 'line',
          data: data2021,
          animationDelay: idx => idx * 10 + 100,
        },
        {
          name: '2022',
          type: 'line',
          data: data2022,
          animationDelay: idx => idx * 10 + 100,
        },
        {
          name: '2023',
          type: 'line',
          data: data2023,
          animationDelay: idx => idx * 10 + 100,
        },
        {
          name: '2024',
          type: 'line',
          data: data2024,
          animationDelay: idx => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
