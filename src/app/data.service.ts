import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { parse } from 'csv-parse/browser/esm/sync';
import { Observable } from 'rxjs';
import { LocationData } from './modals/locationData';
import { modelOpshtini } from './modals/modelOpshtini';
import { OnsovnoInfo } from './modals/osnovnoInfo';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // private locationDataUrl = 'assets/dataSets/osnovno_koordinati.csv'; 
  private locationDataUrl = 'assets/dataSets/uciliste_metadata.csv'; 
  //TODO: stavi ime na csv file
  private opsthiniDataUrl = 'assets/dataSets/data_opstini.csv'
  public filteredLocationData = signal<OnsovnoInfo[]>([]);
  public filteredOpshtiniData = signal<modelOpshtini[]>([]);
  public locations = signal<OnsovnoInfo[]>([]);
  public selectedLocation = signal<OnsovnoInfo | null>(null);

  public getSelectedLocation(){
    return this.selectedLocation;
  }

  public getLocations(){
    return this.locations;
  }

  public getFilteredLocations(){
    return this.filteredLocationData;
  }
  public getFilteredOpshtiniData(){
    return this.filteredOpshtiniData;
  }

  setLocations(opshtinaFilter: string) {
    // Filter locationData based on opshtinaFilter
    console.log(opshtinaFilter);
    const filteredData = this.locations().filter((location : OnsovnoInfo) => location.opshtina === opshtinaFilter);
      
    // console.log('Parsed location data:', filteredData);
      
    filteredData!! ? this.filteredLocationData.set(filteredData) : this.filteredLocationData.set([]);
  }

  constructor(private http: HttpClient) {}

  loadCSV(): Observable<OnsovnoInfo[]> {
    // console.log('started loading CSV file');
    return this.http.get(this.locationDataUrl, { responseType: 'text' }).pipe(
      map((csvData: string) => {
        // console.log('CSV file loaded successfully:', csvData);
        const records = parse(csvData, {
          columns: true, // Use header row as keys
          skip_empty_lines: true,
        });
  
        let i = 0;
        // Map CSV rows to LocationData objects
        const locationData = records.map((record: any, index: number) => {
          if(!record['lat'] || !record['long']){
            console.log(i++);
            return;
          }
          const coordinates = record['lat'].replace(/\s/g, "") + "," + record['long'].replace(/\s/g, ""); // First substring until first space
          // const osnovno_ucilishte = record['centralno']
          //   .split('ООУ ')[1] // Get everything after "ООУ "
          //   ?.replace(/"/g, '') // Remove quotes
          //   ?.trim(); // Trim whitespace
  
          return {
            filteredDataTypeId: index,
            opshtina: record['opshtina'].replace(/\s/g, ""),
            osnovno_ucilishte: record['osnovno_ucilishte'].replace(/\s/g, ""),
            coordinates: coordinates,
            osnnovno_tip: !!record['osnnovno_tip'] ? record['osnnovno_tip'].replace(/\s/g, "") :'',
            language: record['language'].replace(/\s/g, ""),
            uce_2019_2020:  +record['uce_2019_2020'].replace(/\s/g, ""),
            uce_2020_2021:  +record['uce_2020_2021'].replace(/\s/g, ""),
            uce_2021_2022:  +record['uce_2021_2022'].replace(/\s/g, ""),
            uce_2022_2023:  +record['uce_2022_2023'].replace(/\s/g, ""),
            uce_2023_2024:  +record['uce_2023_2024'].replace(/\s/g, ""),
            par_2019_2020:  +record['par_2019_2020'].replace(/\s/g, ""),
            par_2020_2021:  +record['par_2020_2021'].replace(/\s/g, ""),
            par_2021_2022:  +record['par_2021_2022'].replace(/\s/g, ""),
            par_2022_2023:  +record['par_2022_2023'].replace(/\s/g, ""),
            par_2023_2024:  +record['par_2023_2024'].replace(/\s/g, ""),
          } as OnsovnoInfo;
        });
        
        console.log(locationData);
        // this.filteredLocationData.set(filteredData);
        this.locations.set(locationData);
        return locationData;
      })
    );
  }


  loadmodelOpshtiniCSV(opshtinaFilter:string): Observable<modelOpshtini[]> {
    // console.log('started loading CSV file');
    return this.http.get(this.opsthiniDataUrl, { responseType: 'text' }).pipe(
      map((csvData: string) => {
        // console.log('CSV file loaded successfully:', csvData);
        const records = parse(csvData, {
          columns: true, // Use header row as keys
          skip_empty_lines: true,
        });
        console.log(records);
        // Map CSV rows to LocationData objects
        const opshtiniData = records.map((record: any, index: number) => {
          const opshtina = record['Општина'] // First substring until first space
          return {
            filteredDataTypeId: index,
            opshtina:record ["Општина"],
            godina:record ["година"],
            prvo_zapishani:record ["запишани деца во I одделение"],
            vtoro_zapishani:record ["запишани деца во II одделение"],
            treto_zapishani:record ["запишани деца во III одделение"],
            cetvrto_zapishani:record ["запишани деца во IV одделение"],
            petto_zapishani:record ["запишани деца во V одделение"],
            shesto_zapishani:record ["запишани деца во VI одделение"],
            sedmo_zapishani:record ["запишани деца во VII одделение"],
            osmo_zapishani:record ["запишани деца во VIII одделение"],
            devetto_zapishani:record ["запишани деца во IX одделение"],
            prvo_zavrsheni:record ["Завршени деца во I одделение"],
            vtoro_zavrsheni:record ["Завршени деца во II одделение"],
            treto_zavrsheni:record ["Завршени деца во III одделение"],
            cetvrto_zavrsheni:record ["Завршени деца во IV одделение"],
            petto_zavrsheni:record ["Завршени деца во V одделение"],
            shesto_zavrsheni:record ["Завршени деца во VI одделение"],
            sedmo_zavrsheni:record ["Завршени деца во VII одделение"],
            osmo_zavrsheni:record ["Завршени деца во VIII одделение"],
            devetto_zavrsheni:record ["Завршени деца во IX одделение"],
            total_profesori:record ["Наставници"],
            total_zapishani:record ["Вкупно запишани"],//
            profesori_zapishani_rate:record ["Сооднос деца по наставник"]//
          } as modelOpshtini
        });
        //console.log(opshtiniData);
        const filteredData = opshtiniData.filter((opshtinaModel : modelOpshtini) => opshtinaModel.opshtina === opshtinaFilter);
        console.log(filteredData)
        // this.filteredLocationData.set(filteredData);
        this.filteredOpshtiniData.set(filteredData);
        return filteredData;
      })
    );
  }
}  