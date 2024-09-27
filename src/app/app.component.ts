import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgxEchartsDirective, provideEcharts} from 'ngx-echarts'
import type { EChartsOption } from 'echarts';
import { MapComponent } from "./map/map.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgxEchartsDirective],
  imports: [RouterOutlet, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[
    provideEcharts()
  ]
})
export class AppComponent {
  title = 'ZMAI-Datathon-2024';

  options!: EChartsOption;
  constructor() {}

  ngOnInit(): void {

    //Hard-coding the data
    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < 100; i++) {
      xAxisData.push('category' + i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }

    
    //Options for charts
    this.options = {
      legend: {
        data: ['bar', 'bar2'],
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
          name: 'bar',
          type: 'bar',
          data: data1,
          animationDelay: idx => idx * 10,
        },
        {
          name: 'bar2',
          type: 'bar',
          data: data2,
          animationDelay: idx => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}


  title = 'ZMAI-Datathon-2024';}