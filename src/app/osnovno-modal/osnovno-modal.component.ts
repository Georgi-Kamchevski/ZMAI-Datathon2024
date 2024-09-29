import { Component, effect } from '@angular/core';
import { DataService } from '../data.service';
import { LocationData } from '../modals/locationData';

@Component({
  selector: 'app-osnovno-modal',
  standalone: true,
  imports: [],
  templateUrl: './osnovno-modal.component.html',
  styleUrl: './osnovno-modal.component.css'
})
export class OsnovnoModalComponent {
  selectedLocation: LocationData | null = null;

  constructor(private dataService: DataService){
    const osnovnoInfo = this.dataService.getSelectedLocation();
    effect(() =>  {
      this.selectedLocation = osnovnoInfo();
    });
  }

}
