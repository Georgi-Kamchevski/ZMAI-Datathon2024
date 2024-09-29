import { Component, effect, Input, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
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
export class LineZapishaniZavrsheniComponent implements OnChanges {

  @Input() selectedOpshtina: string = '';  // The selected municipality (opshtina)
  public opshtinaData: modelOpshtini[] = [];
  public filteredOpshtinaData: modelOpshtini[] = [];  // Data for the selected opshtina
  public selectedGrade: string = 'prvo';  // Default selected grade (can be changed)
  public options!: EChartsOption;
  private chartInstance: any;  // Keep a reference to the chart instance
  
  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {
    const filteredOpshtiniSignal = this.dataService.getFilteredOpshtiniData();
    
    effect(() => {
      this.opshtinaData = filteredOpshtiniSignal();
      this.filterData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOpshtina']) {
      this.filterData();  // Filter data when selectedOpshtina changes
    }
  }

  filterData() {
    this.filteredOpshtinaData = this.opshtinaData.filter(data => data.opshtina === this.selectedOpshtina);
    if (this.filteredOpshtinaData.length > 0) {
      this.updateChart(this.selectedGrade);
    } else {
      console.warn('No data available for the selected opshtina.');
    }
  }

  onChartInit(ec: any) {
    this.chartInstance = ec;  // Save the chart instance
  }

  onGradeChange(newGrade: string): void {
    this.selectedGrade = newGrade;
    this.updateChart(newGrade);  // Update the chart when a new grade is selected
  }

  updateChart(grade: string): void {
    if (!this.filteredOpshtinaData || this.filteredOpshtinaData.length === 0) {
      console.warn('No data available for the selected opshtina.');
      return;
    }

    type GradeKeys = `${'prvo' | 'vtoro' | 'treto' | 'cetvrto' | 'petto' | 'shesto' | 'sedmo' | 'osmo' | 'devetto'}_${'zapishani' | 'zavrsheni'}`;
    
    const xAxisData = this.filteredOpshtinaData.map(data => data.godina);  // Extract the years

    const zapishaniKey = `${grade}_zapishani` as GradeKeys;
    const zavrsheniKey = `${grade}_zavrsheni` as GradeKeys;

    const zapishaniData = this.filteredOpshtinaData.map(data => data[zapishaniKey]);
    const zavrsheniData = this.filteredOpshtinaData.map(data => data[zavrsheniKey]);

    if (zapishaniData.some(d => d !== undefined) && zavrsheniData.some(d => d !== undefined)) {
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
          name: 'Година',
          nameLocation: 'middle',
          nameGap: 20,
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          name: 'Број на запишани ученици',
          nameLocation: 'middle',
          nameRotate: 90,
          nameGap: 30
        },
        series: [
          {
            name: 'Zapishani (Enrolled)',
            type: 'line',
            data: zapishaniData,
            lineStyle: {
              type: 'solid',
              color: '#B06DB3'
            },
            itemStyle: {
              color: '#B06DB3'
            }
          },
          {
            name: 'Zavrsheni (Completed)',
            type: 'line',
            data: zavrsheniData,
            lineStyle: {
              type: 'dotted',
              color: '#F8C056'
            },
            itemStyle: {
              color: '#F8C056'
            }
          }
        ]
      };

      if (this.chartInstance) {
        this.chartInstance.clear();
        this.chartInstance.setOption(this.options, true);
      }

      this.cdr.detectChanges();
    } else {
      console.warn('No data available for selected grade.');
    }
  }
}
