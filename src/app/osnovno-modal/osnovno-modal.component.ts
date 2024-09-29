import { Component, effect } from '@angular/core';
import { DataService } from '../data.service';
import { OnsovnoInfo } from '../modals/osnovnoInfo';

@Component({
  selector: 'app-osnovno-modal',
  standalone: true,
  imports: [],
  templateUrl: './osnovno-modal.component.html',
  styleUrl: './osnovno-modal.component.css'
})
export class OsnovnoModalComponent {
  selectedLocation: OnsovnoInfo | null = null;

  constructor(private dataService: DataService){
    const osnovnoInfo = this.dataService.getSelectedLocation();
    effect(() =>  {
      this.selectedLocation = osnovnoInfo();
    });
  }

}
