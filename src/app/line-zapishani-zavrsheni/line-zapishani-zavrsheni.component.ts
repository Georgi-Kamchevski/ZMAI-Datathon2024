import { Component, effect, Input } from '@angular/core';
import { modelOpshtini } from '../modals/modelOpshtini'; // Import your modelOpshtini interface
import { DataService } from '../data.service'; // Import your DataService
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-line-zapishani-zavrsheni',
  standalone: true,
  templateUrl: './line-zapishani-zavrsheni.component.html',
  styleUrls: ['./line-zapishani-zavrsheni.component.css'],
  imports: [NgxEchartsDirective]
})
export class LineZapishaniZavrsheniComponent {

  @Input() selectedOpshtina: string = '';  // The selected municipality (opshtina)
  public opshtinaData: modelOpshtini[] = [];
  public filteredOpshtinaData: modelOpshtini[] = [];  // Data for the selected opshtina
  public selectedGrade: string = 'prvo';  // Default selected grade (can be changed)
  public options!: EChartsOption;
  public chartInitialized: boolean = false; // To track whether the chart options have been initialized
  
  constructor(private dataService: DataService) {
    const filteredOpshtiniSignal = this.dataService.getFilteredOpshtiniData();
    effect(() => {
      this.opshtinaData = filteredOpshtiniSignal();
      console.log('Filtered opshtinaData:', this.opshtinaData);
      
      // Filter data based on the selected opshtina
      this.filteredOpshtinaData = this.opshtinaData.filter(data => data.opshtina === this.selectedOpshtina);

      if (this.filteredOpshtinaData.length > 0) {
        // Update the chart only when filtered data is available
        this.updateChart(this.selectedGrade);  
      }
    });
  }

  // Update chart based on selected grade
  onGradeChange(newGrade: string): void {
    this.selectedGrade = newGrade;
    this.updateChart(newGrade);  // Update the chart when a new grade is selected
  }

  updateChart(grade: string): void {
    // Prepare to handle dynamic keys safely
    type GradeKeys = `${'prvo' | 'vtoro' | 'treto' | 'cetvrto' | 'petto' | 'shesto' | 'sedmo' | 'osmo' | 'devetto'}_${'zapishani' | 'zavrsheni'}`;
    
    const xAxisData = this.filteredOpshtinaData.map(data => data.godina);  // Extract the years

    // Dynamically access zapishani and zavrsheni data using the `grade` key
    const zapishaniKey = `${grade}_zapishani` as GradeKeys;
    const zavrsheniKey = `${grade}_zavrsheni` as GradeKeys;

    const zapishaniData = this.filteredOpshtinaData.map(data => data[zapishaniKey]);  // Get zapishani values for the selected grade
    const zavrsheniData = this.filteredOpshtinaData.map(data => data[zavrsheniKey]);  // Get zavrsheni values for the selected grade

    // Ensure there is valid data before initializing the chart
    if (zapishaniData.length > 0 && zavrsheniData.length > 0) {
      this.options = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Zapishani (Enrolled)', 'Zavrsheni (Completed)']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData  // Years on the x-axis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Zapishani (Enrolled)',
            type: 'line',
            data: zapishaniData,  // Data for zapishani (solid line)
            lineStyle: {
              type: 'solid'  // Solid line for zapishani
            }
          },
          {
            name: 'Zavrsheni (Completed)',
            type: 'line',
            data: zavrsheniData,  // Data for zavrsheni (dotted line)
            lineStyle: {
              type: 'dotted'  // Dotted line for zavrsheni
            }
          }
        ]
      };
      this.chartInitialized = true;  // Mark the chart as initialized
    } else {
      console.warn('No data available for selected grade.');
    }
  }
}
