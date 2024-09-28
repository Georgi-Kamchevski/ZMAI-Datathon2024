import { Component,  OnInit } from '@angular/core';
import * as L from 'leaflet';
import {NgxEchartsDirective, provideEcharts} from 'ngx-echarts'
import type { EChartsOption } from 'echarts';
import csvParser from 'csv-parser';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers:[
    provideEcharts()
  ]
})
export class MapComponent implements OnInit {
  private map: any;

  options!: EChartsOption;

  // Array containing lat, lon pairs
  private markerValues = [
    41.707950780384465, 22.855144797486066, // Берово - ООУ „Дедо Иљо Малешевски“
    41.7104071,22.8467131,
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
      const lat = this.markerValues[i];
      const lon = this.markerValues[i + 1];

      // Create a marker at the given lat, lon
      const marker = L.marker([lat, lon], { icon: defaultIconWithoutShadow });
      marker.on('click',(e: any) => {  // Use an arrow function to retain 'this'
        const popLocation = new L.LatLng(lat, lon);
        const popup = L.popup({
          autoClose: true,
          closeOnClick: true,
  
        })
          .setLatLng(popLocation)
          .setContent('<p>Берово - ООУ „Дедо Иљо Малешевски</p>')
          .openOn(this.map);  // 'this' refers to the MapComponent's map instance
      })
  
        marker.addTo(this.map);
    }


    const marker = L.marker([41.70654945554364, 22.853571009575017], { icon: defaultIconWithoutShadow });

    marker.on('click',(e: any) => {  // Use an arrow function to retain 'this'

      // ACTIVATE MODAL ON CLICK ON MARKER!!!!!!!!!

      
//       data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
// aria-controls="offcanvasRight"
    })

    marker.addTo(this.map);
    
  }

  constructor() { }

  // Initialize the map after the view has been initialized
  ngOnInit(): void {
    this.initMap();
      //Hard-coding the data
      const xAxisData = [];
      const data2019 = [];
      const data2020 = [];
      const data2021 = [];
      const data2022 = [];
      const data2023 = [];
      const data2024 = [];
  
      for (let i = 2018; i < 2024; i++) {
        xAxisData.push(i +' година');
        data2019.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        data2020.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
        data2021.push((Math.cos(i / 3) * (i / 3 - 10) + i / 6) * 5);
        data2022.push((Math.cos(i / 3) * (i / 3 - 10) + i / 6) * 5);
        data2023.push((Math.cos(i) * (i - 10) + i / 6) * 5);
        data2024.push((Math.cos(i) * (i - 10) + i / 6) * 5);
      }
  
      
      //Options for charts
      this.options = {
        legend: {
          data: ['2019', '2020','2021','2022','2023','2024'],
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