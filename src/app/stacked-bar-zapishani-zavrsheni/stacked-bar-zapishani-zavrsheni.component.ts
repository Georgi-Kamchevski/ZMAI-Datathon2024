import { Component, effect, Input } from '@angular/core';
import { modelOpshtini } from '../modals/modelOpshtini'; // Import your modelOpshtini interface
import { DataService } from '../data.service'; // Import your DataService
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts'; // Import the NgxEchartsDirective
import { NgFor } from '@angular/common'; // Import NgFor

@Component({
  selector: 'app-stacked-bar-zapishani-zavrsheni',
  standalone: true,
  templateUrl: './stacked-bar-zapishani-zavrsheni.component.html',
  styleUrls: ['./stacked-bar-zapishani-zavrsheni.component.css'],
  imports: [NgxEchartsDirective, NgFor], // Add NgFor to imports
})
export class StackedBarZapishaniZavrsheniComponent {

  @Input() selectedOpshtina: string = '';  // The selected municipality (opshtina)
  public opshtinaData: modelOpshtini[] = [];
  public filteredOpshtinaData: modelOpshtini[] = [];  // Data for the selected opshtina
  public selectedYear: number | undefined;  // Selected year (can be changed, initially undefined)
  public availableYears: number[] = [];  // Available years for dropdown
  public options!: EChartsOption;
  
  constructor(private dataService: DataService) {
    const filteredOpshtiniSignal = this.dataService.getFilteredOpshtiniData();
    effect(() => {
      this.opshtinaData = filteredOpshtiniSignal();
      console.log('Filtered opshtinaData:', this.opshtinaData);

      // Extract available years from the data for dropdown options
      this.availableYears = Array.from(new Set(this.opshtinaData.map(data => data.godina)));

      // Automatically set the first year as selected by default (if available)
      if (this.availableYears.length > 0) {
        this.selectedYear = this.availableYears[0];
        this.updateChart(this.selectedYear);  // Update the chart with the first year
      }
    });
  }

  // Update chart based on selected year
  onYearChange(newYear: number): void {
    this.selectedYear = newYear;
    this.updateChart(newYear);  // Update the chart when a new year is selected
  }

  updateChart(year: number): void {
    // Filter the data for the selected opshtina and year
    this.filteredOpshtinaData = this.opshtinaData.filter(data => data.opshtina === this.selectedOpshtina && data.godina === year);

    if (this.filteredOpshtinaData.length > 0) {
      // Create arrays for each grade

      // Define the valid grade keys as a union type
      type GradeKeys = `${'prvo' | 'vtoro' | 'treto' | 'cetvrto' | 'petto' | 'shesto' | 'sedmo' | 'osmo' | 'devetto'}_${'zapishani' | 'zavrsheni'}`;
      const grades = ['prvo', 'vtoro', 'treto', 'cetvrto', 'petto', 'shesto', 'sedmo', 'osmo', 'devetto'];

      const zapishaniData = grades.map(grade => this.filteredOpshtinaData[0][`${grade}_zapishani` as GradeKeys]);  // Get zapishani values
      const zavrsheniData = grades.map(grade => this.filteredOpshtinaData[0][`${grade}_zavrsheni` as GradeKeys]);  // Get zavrsheni values

      // Update the chart options for stacked bars
      this.options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // Show a shadow on hover
          }
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
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: grades.map(grade => `${grade.charAt(0).toUpperCase() + grade.slice(1)} Grade`)  // Display grades on y-axis
        },
        series: [
          {
            name: 'Zapishani (Enrolled)',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: zapishaniData
          },
          {
            name: 'Zavrsheni (Completed)',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: zavrsheniData
          }
        ]
      };
    } else {
      console.warn('No data available for the selected year and opshtina.');
    }
  }
}
