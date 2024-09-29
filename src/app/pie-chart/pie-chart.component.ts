import { Component, effect, Input, OnInit } from '@angular/core';
import { modelOpshtini } from '../modals/modelOpshtini';
import { DataService } from '../data.service';
import { NgFor, NgIf } from '@angular/common'; // Import NgIf
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgFor, NgIf, NgxEchartsDirective, NgbModule], // Add NgIf to the imports
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  constructor(private dataService: DataService) {
    const filteredOpshtiniSignal = dataService.getFilteredOpshtiniData();
    effect(() => {
      this.opshtinaData = filteredOpshtiniSignal();
      console.log('Filtered opshtinaData:', this.opshtinaData);

      // Check if opshtinaData exists and has data
      if (this.opshtinaData && this.opshtinaData.length > 0) {
        const groupedData = this.getGroupedDataByYear(this.opshtinaData, this.opshtina);
        console.log('Grouped Data:', groupedData);

        // Generate chart data for the grouped data
        this.generateChartData(groupedData);

        // Ensure the chart data and selected year are reset when new data arrives
        if (!!this.chartDataByYear && this.chartDataByYear.length > 0) {
          this.selectedYear = this.chartDataByYear[0].year;
          this.selectedChart = this.chartDataByYear.find(chart => chart.year === this.selectedYear);
        } else {
          // Reset selectedYear and selectedChart if no data is found
          this.selectedYear = null;
          this.selectedChart = null;
        }
      } else {
        // If no data is available, reset the chart and dropdown
        this.chartDataByYear = [];
        this.selectedYear = null;
        this.selectedChart = null;
      }
    });
  }

  public opshtinaData: modelOpshtini[] = [];
  @Input() opshtina: string = 'Берово';

  // Holds chart data for each year
  public chartDataByYear: { year: number, chartData: any }[] = [];
  public selectedYear!: number | null;
  public selectedChart: any;
  options!: EChartsOption;

  ngOnInit() {
    // Ensure selectedChart is set initially if there is data
    if (this.chartDataByYear.length > 0) {
      this.selectedYear = this.chartDataByYear[0].year;
      this.selectedChart = this.chartDataByYear.find(chart => chart.year === this.selectedYear);
    }
  }

  getGroupedDataByYear(data: modelOpshtini[], opshtina: string) {
    const filteredData = data.filter(item => item.opshtina === opshtina);
    
    // Debugging: log the filtered data
    console.log('Filtered data:', filteredData);

    const groupedByYear = filteredData.reduce((acc, item) => {
      if (!acc[item.godina]) {
        acc[item.godina] = { total_profesori: 0, total_zapishani: 0 };
      }
      acc[item.godina].total_profesori += item.total_profesori;
      acc[item.godina].total_zapishani += item.total_zapishani;
      return acc;
    }, {} as Record<number, { total_profesori: number; total_zapishani: number }>);

    return groupedByYear;
  }

  generateChartData(groupedData: { [year: number]: { total_profesori: number; total_zapishani: number } }) {
    if (groupedData && Object.keys(groupedData).length > 0) {
      this.chartDataByYear = Object.keys(groupedData).map(yearString => {
        const year = Number(yearString);
        const yearData = groupedData[year];

        return {
          year: year,
          chartData: {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [
              {
                name: `Data for ${year}`,
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: yearData.total_profesori, name: 'Професори', itemStyle: { color: '#B06DB3' }},
                  { value: yearData.total_zapishani, name: 'Запишани ученици', itemStyle: { color: '#F8C056' }}
                ]
              }
            ]
          }
        };
      });

      // Ensure the default chart is selected when data is generated
      if (this.chartDataByYear.length > 0) {
        this.selectedYear = this.chartDataByYear[0].year;
        this.selectedChart = this.chartDataByYear.find(chart => chart.year === this.selectedYear);
      }
    }
  }

  // Update the chart when the selected year changes
  onYearChange(event: any) {
    const selectedYear = +event.target.value;
    this.selectedChart = this.chartDataByYear.find(chart => chart.year === selectedYear);
  }
}
