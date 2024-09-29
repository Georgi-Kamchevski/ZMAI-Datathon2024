import { Component, effect, Input, OnDestroy } from '@angular/core';
import { modelOpshtini } from '../modals/modelOpshtini';
import { DataService } from '../data.service';
import { EChartsOption, BarSeriesOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-stacked-bar-zapishani-zavrsheni',
  standalone: true,
  templateUrl: './stacked-bar-zapishani-zavrsheni.component.html',
  styleUrls: ['./stacked-bar-zapishani-zavrsheni.component.css'],
  imports: [NgxEchartsDirective, NgFor],
})
export class StackedBarZapishaniZavrsheniComponent {

  @Input() selectedOpshtina: string = ''; 
  public opshtinaData: modelOpshtini[] = [];
  public filteredOpshtinaData: modelOpshtini[] = [];
  public selectedYear: number | undefined;
  public availableYears: number[] = [];
  public options!: EChartsOption;

  constructor(private dataService: DataService) {
    const filteredOpshtiniSignal = this.dataService.getFilteredOpshtiniData();
    effect(() => {
      this.opshtinaData = filteredOpshtiniSignal();
      console.log('Filtered opshtinaData:', this.opshtinaData);
      if(this.opshtinaData){
        this.availableYears = Array.from(new Set(this.opshtinaData.map(data => data?.godina)));
  
        if (!!this.availableYears && this.availableYears.length > 0) {
          this.selectedYear = this.availableYears[0];
          this.updateChart(this.selectedYear);
        }
      }

    });
  }

  onYearChange(newYear: number): void {
    this.selectedYear = newYear;
    this.updateChart(newYear);
  }

  updateChart(year: number): void {
    if (!year) {  // Only return if year is not valid (null or undefined)
      return;
    }
    
    // Filter the data based on the selected opshtina and year
    this.filteredOpshtinaData = this.opshtinaData.filter(data => data.opshtina === this.selectedOpshtina && data.godina === year);
  
    if (this.filteredOpshtinaData.length > 0) {
      type GradeKeys = `${'prvo' | 'vtoro' | 'treto' | 'cetvrto' | 'petto' | 'shesto' | 'sedmo' | 'osmo' | 'devetto'}_${'zapishani' | 'zavrsheni'}`;
      const grades = ['prvo', 'vtoro', 'treto', 'cetvrto', 'petto', 'shesto', 'sedmo', 'osmo', 'devetto'];
  
      const zapishaniData = grades.map(grade => this.filteredOpshtinaData[0][`${grade}_zapishani` as GradeKeys]);
      const zavrsheniData = grades.map(grade => this.filteredOpshtinaData[0][`${grade}_zavrsheni` as GradeKeys]);
  
      // Custom label options to position the labels inside the bars
      const labelOption: BarSeriesOption['label'] = {
        show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'center',
        verticalAlign: 'middle',
        rotate: 0,
        formatter: '{c}',
        fontSize: 12,
        rich: {
          name: {}
        }
      };
  
      // Define the EChartsOption object
      this.options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
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
          type: 'category',
          data: grades.map(grade => `${grade.charAt(0).toUpperCase() + grade.slice(1)} Grade`) // Use grades as category
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Zapishani (Enrolled)',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#B06DB3'  // Custom color for "Zapishani"
            },
            data: zapishaniData // Data for zapishani
          },
          {
            name: 'Zavrsheni (Completed)',
            type: 'bar',
            label: labelOption,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#F8C056'  // Custom color for "Zavrsheni"
            },
            data: zavrsheniData // Data for zavrsheni
          }
        ] as BarSeriesOption[]  // Ensure the series is cast to the correct type
      };
    } else {
      console.warn('No data available for the selected year and opshtina.');
    }
  }
  
}
