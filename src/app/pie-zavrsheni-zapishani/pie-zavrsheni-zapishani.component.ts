import { Component, effect, Input, OnInit } from '@angular/core';
import { modelOpshtini } from '../modals/modelOpshtini';
import { DataService } from '../data.service';
import { NgFor } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-zavrsheni-zapishani',
  standalone: true,
  imports: [NgFor, NgxEchartsDirective, NgbModule],
  templateUrl: './pie-zavrsheni-zapishani.component.html',
  styleUrls: ['./pie-zavrsheni-zapishani.component.css']
})
export class PieZavrsheniZapishaniComponent implements OnInit {

  constructor(private dataService: DataService) {
    const filteredOpshtiniSignal = dataService.getFilteredOpshtiniData();
    effect(() => {
      this.opshtinaData = filteredOpshtiniSignal();
      console.log('Filtered opshtinaData:', this.opshtinaData);
      
      // Move chart data generation here, after opshtinaData is updated
      if (this.opshtinaData.length > 0) {
        const groupedData = this.getGroupedDataByYear(this.opshtinaData, this.opshtina);
        console.log('Grouped Data:', groupedData);
        this.generateChartData(groupedData);
      }
    });
  }

  public opshtinaData: modelOpshtini[] = [];
  @Input() opshtina: string = '';

  // Holds chart data for each year
  public chartDataByYear: { year: number, chartData: any }[] = [];
  options!: EChartsOption;

  ngOnInit() {
    // Chart data generation is handled reactively in the effect
  }

  getGroupedDataByYear(data: modelOpshtini[], opshtina: string) {
    const filteredData = data.filter(item => item.opshtina === opshtina);
    const groupedByYear = filteredData.reduce((acc, item) => {
      if (!acc[item.godina]) {
        acc[item.godina] = { total_zavrsheni: 0, total_zapishani: 0 };
      }
      acc[item.godina].total_zavrsheni += item.total_zavrsheni;
      acc[item.godina].total_zapishani += item.total_zapishani;
      return acc;
    }, {} as Record<number, { total_zavrsheni: number; total_zapishani: number }>);

    return groupedByYear;
  }

  generateChartData(groupedData: { [year: number]: { total_zavrsheni: number; total_zapishani: number } }) {
    this.chartDataByYear = Object.keys(groupedData).map(yearString => {
      const year = Number(yearString);
      const yearData = groupedData[year];
  
      console.log(`Generating chart for year ${year}:`, {
        zavrsheni: yearData.total_zavrsheni,
        remaining: yearData.total_zapishani - yearData.total_zavrsheni
      });
  
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
                { value: yearData.total_zavrsheni, name: 'Завршени ученици', itemStyle: {
                  color:'#B06DB3' // Custom color for "Професори"
                } },
                { value: yearData.total_zapishani - yearData.total_zavrsheni, name: 'Останати ученици', itemStyle: {
                  color:'#F8C056' // Custom color for "Професори"
                }  }
              ]
            }
          ]
        }
      };
    });
  
    // Log the chart data to ensure it's being populated
    console.log('Chart data by year:', this.chartDataByYear);
  }
}
