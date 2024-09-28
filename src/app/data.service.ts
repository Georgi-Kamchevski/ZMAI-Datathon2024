import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { parse } from 'csv-parse/browser/esm/sync';
import { Observable } from 'rxjs';
import { LocationData } from './modals/locationData';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private locationDataUrl = 'assets/dataSets/osnovno_koordinati.csv'; 
  public filteredLocationData = signal<LocationData[]>([]);
  public locations = signal<LocationData[]>([]);

  public getLocations(){
    return this.locations;
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
}  