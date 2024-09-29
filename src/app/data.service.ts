import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { parse } from 'csv-parse/browser/esm/sync';
import { Observable } from 'rxjs';
import { LocationData } from './modals/locationData';
import { modelOpshtini } from './modals/modelOpshtini';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private locationDataUrl = 'assets/dataSets/osnovno_koordinati.csv'; 
  //TODO: stavi ime na csv file
  private opsthiniDataUrl = 'assets/dataSets/data_opstini.csv'
  public filteredLocationData = signal<LocationData[]>([]);
  public filteredOpshtiniData = signal<modelOpshtini[]>([]);
  public locations = signal<LocationData[]>([]);
  public selectedLocation = signal<LocationData | null>(null);

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
    const filteredData = this.locations().filter((location : LocationData) => location.opshtina === opshtinaFilter);
      
    // console.log('Parsed location data:', filteredData);
      
    filteredData!! ? this.filteredLocationData.set(filteredData) : this.filteredLocationData.set([]);
  }

  constructor(private http: HttpClient) {}

  loadCSV(): Observable<LocationData[]> {
    // console.log('started loading CSV file');
    return this.http.get(this.locationDataUrl, { responseType: 'text' }).pipe(
      map((csvData: string) => {
        // console.log('CSV file loaded successfully:', csvData);
        const records = parse(csvData, {
          columns: true, // Use header row as keys
          skip_empty_lines: true,
        });
  
        // Map CSV rows to LocationData objects
        const locationData = records.map((record: any) => {
          const opshtina = record['centralno'].split(' ')[0]; // First substring until first space
          const osnovno_ucilishte = record['centralno']
            .split('ООУ ')[1] // Get everything after "ООУ "
            ?.replace(/"/g, '') // Remove quotes
            ?.trim(); // Trim whitespace
  
          return {
            opshtina: opshtina,
            distance: +record['distance (km)'], // Convert to number
            osnovno_ucilishte: osnovno_ucilishte,
            coordinates_centralno: record['coordinates_centralno'].replace(/\s/g, ""),
            coordinates_podracno: record['coordinates_podracno'].replace(/\s/g, ""),
            naseleno_mesto: record['Населено место'].trim(), // Trim any whitespace
          } as LocationData;
        });
  
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
        // Map CSV rows to LocationData objects
        const opshtiniData = records.map((record: any) => {
          const opshtina = record['Општина'] // First substring until first space
          return {
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