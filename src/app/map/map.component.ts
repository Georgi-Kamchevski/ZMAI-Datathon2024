import { Component, OnInit, effect, signal } from '@angular/core';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Offcanvas } from 'bootstrap';
import * as L from 'leaflet';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { DataService } from '../data.service'; // Import your DataService
import { LocationData } from '../modals/locationData'; // Import your model
import { modelOpshtini } from '../modals/modelOpshtini';
import { PieChartComponent } from "../pie-chart/pie-chart.component";
import { LineZapishaniZavrsheniComponent } from "../line-zapishani-zavrsheni/line-zapishani-zavrsheni.component";
import { StackedBarZapishaniZavrsheniComponent } from "../stacked-bar-zapishani-zavrsheni/stacked-bar-zapishani-zavrsheni.component";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [NgxEchartsDirective, PieChartComponent, LineZapishaniZavrsheniComponent, StackedBarZapishaniZavrsheniComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [provideEcharts()]
})
export class MapComponent implements OnInit {
  private map: any;
  private markerLayer: L.LayerGroup = L.layerGroup(); // Layer group for markers
  public filteredData: LocationData[] = [];
  public filteredOpshtiniData:modelOpshtini[]=[]
  options!: EChartsOption;
  title:string='';
  centralno_uchiliste:string='';

  constructor(private dataService: DataService) {
    const filteredDataSignal = this.dataService.getFilteredLocations();
  
    // Create an effect to reactively update when the signal changes
    effect(() => {
      this.filteredData = filteredDataSignal();
      console.log('Filtered data in map component:', this.filteredData);
      this.title=(this.filteredData[0])['opshtina']
      this.centralno_uchiliste=(this.filteredData[0])['osnovno_ucilishte']
      // After retrieving filtered data, update the map markers
      if (this.filteredData && this.filteredData.length > 0) {
        const coordsCent = this.filteredData[0].coordinates_centralno
        .split(",").map(Number);
        let latCent: number = coordsCent[0];
        let lonCent: number = coordsCent[1];

        this.map.setView([latCent, lonCent], 10);

        this.addMarkers(); // Update the markers based on filtered data
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
    this.markerLayer.addTo(this.map); // Add marker layer to the map
  }

  private addMarkers(): void {
    // Clear existing markers
    this.markerLayer.clearLayers();

    if (this.filteredData && this.filteredData.length) {
      
      const redIconWithoutShadow = L.icon({
        iconUrl: "../assets/pngwing.com.png",
        iconSize: [50, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowUrl: '',
      });

      const blueIconWithoutShadow = L.icon({
        iconUrl: "../assets/blue_pin.pngwing.com.png",
        iconSize: [50, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowUrl: '',
      });

      this.filteredData.forEach((location) => {
        const coords = location.coordinates_podracno
          .split(",").map(Number);
        const lat: number = coords[0];
        const lon: number = coords[1];

        var marker;
        if(location.distance < 4){
          marker = L.marker([lat, lon], { icon: blueIconWithoutShadow });
        }
        else{
          marker = L.marker([lat, lon], { icon: redIconWithoutShadow });
        }
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

        this.markerLayer.addLayer(marker); // Add marker to markerLayer
      });
    }
  }

  ngOnInit(): void {
    this.initMap();

    // Use an effect to listen to changes in the filteredLocationData signal
      //Hard-coding the data
      const xAxisData = ['2018 година','2019 година','2020 година','2021 година','2022 година','2023 година'];
     
      const dataIgrade = [93,86,91,92,67,84];
      const dataIIgrade = [84,89,86,92,92,66];
      const dataIIIgrade = [95,80,89,85,89,90];
      const dataIVgrade = [101,93,79,86,84,87];
      const dataVgrade = [86,98,91,78,84,85];
      const dataVIgrade = [91,82,93,91,75,82];
      const dataVIIgrade = [101,86,80,91,88,74];
      const dataVIIIgrade = [79,102,83,78,87,84];
      const dataIXgrade = [108,75,100,83,76,84];
      
     
      //Берово,2018,,,,,,,,,101,79,108,86
      //Берово,2019,,,,,,,,,86,102,75,91
      //Берово,2020,,,,,,,,,80,83,100,93
      //Берово,2021,,,,,,,,,91,78,83,75
      //Берово,2022,,,,,,,,,88,87,76,91
      //Берово,2023,,,,,,,,,74,84,84,




      // for (let i = 2018; i <= 2024; i++) {
      //   xAxisData.push(i +' година');
      //   data2019.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      //   data2020.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
      //   data2021.push((Math.cos(i / 3) * (i / 3 - 10) + i / 6) * 5);
      //   data2022.push((Math.cos(i / 3) * (i / 3 - 10) + i / 6) * 5);
      //   data2023.push((Math.cos(i) * (i - 10) + i / 6) * 5);
      //   data2024.push((Math.cos(i) * (i - 10) + i / 6) * 5);
      // }
  
      
      //Options for charts
      this.options = {
        legend: {
          data: ['dataIgrade','dataIIgrade','dataIIIgrade','dataIVgrade','dataVgrade','dataVIgrade','dataVIIgrade','dataVIIIgrade','dataIXgrade'],
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
            name: 'dataIgrade',
            type: 'line',
            data: dataIgrade,
            animationDelay: idx => idx * 10,
          },
          {
            name: 'dataIIgrade',
            type: 'line',
            data: dataIIgrade,
            animationDelay: idx => idx * 10 + 100,
          },
          {
            name: 'dataIIIgrade',
            type: 'line',
            data: dataIIIgrade,
            animationDelay: idx => idx * 10 + 100,
          },
     
          {
            name: 'dataIVgrade',
            type: 'line',
            data: dataIVgrade,
            animationDelay: idx => idx * 10 + 100,
          },
          {
            name: 'dataVgrade',
            type: 'line',
            data: dataVgrade,
            animationDelay: idx => idx * 10 + 100,
          },
          {
            name: 'dataVIgrade',
            type: 'line',
            data: dataVIgrade,
            animationDelay: idx => idx * 10 + 100,
          },
          {
            name: 'dataVIIgrade',
            type: 'line',
            data: dataVIIgrade,
            animationDelay: idx => idx * 10 + 100,
          },
          {
            name: 'dataVIIIgrade',
            type: 'line',
            data: dataVIIIgrade,
            animationDelay: idx => idx * 10 + 100,
          },
          {
            name: 'dataIXgrade',
            type: 'line',
            data: dataIXgrade,
            animationDelay: idx => idx * 10 + 100,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: idx => idx * 5,
      };

  }

    };
