import { Component, effect, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import Fuse from "fuse.js";
import { FilterDataType } from '../modals/filterDataType';
import { DataService } from '../data.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  dataList!: FilterDataType[];
  filteredSuggestions!: FilterDataType[];
  filterForm!: FormGroup;

  selectedKey: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private dataservice: DataService
  ) {
    const locations = this.dataservice.getLocations();

    effect(() =>{
      this.dataList = locations().map((location, index) => 
      {
        return {
          filteredDataTypeId: index,
          opshtina: location.opshtina,
          naseleno_mesto: location.naseleno_mesto,
          osnovno_ucilishte: location.osnovno_ucilishte,
        } as FilterDataType;
      }
      );
      this.filteredSuggestions = this.dataList;
      // console.log(this.dataList);
    });
  }

  async ngOnInit() {
    this.initializeForm();
    this.populateFilterList();
  }

  initializeForm() {
    this.filterForm = this.formBuilder.group({
      filter: [''],
      filterDataType: new FormArray([]),
    });
  }

  locationClicked(filterDataType: FilterDataType){
    console.log(filterDataType);
    this.selectedKey = filterDataType?.filteredDataTypeId;

    const data = this.dataList.find(filterDataType => filterDataType.filteredDataTypeId === this.selectedKey);

    // console.log(data?.opshtina);
    if(data){
      // this.dataservice.loadCSV(data!.opshtina).subscribe();
      this.dataservice.setLocations(data!.opshtina);
      this.dataservice.loadmodelOpshtiniCSV(data!.opshtina).subscribe()
    }
  }

  async populateFilterList() {
    const list: FilterDataType[] = [
      {
        filteredDataTypeId: 1,
        opshtina: 'Берово',
        naseleno_mesto: 'с. Смојмирово',
        osnovno_ucilishte: 'Дедо Иљо Малешевски'
      },
      {
        filteredDataTypeId: 2,
        opshtina: 'Аеродром',
        naseleno_mesto: 'с. Будинарци',
        osnovno_ucilishte: 'Дедо Иљо Малешевски'
      },
      {
        filteredDataTypeId: 3,
        opshtina: 'Карпош',
        naseleno_mesto: 'с. Будинарци',
        osnovno_ucilishte: 'Дедо Иљо Малешевски'
      },
      {
        filteredDataTypeId: 4,
        opshtina: 'Битола',
        naseleno_mesto: 'с. Будинарци',
        osnovno_ucilishte: 'Дедо Иљо Малешевски'
      },
      {
        filteredDataTypeId: 5,
        opshtina: 'Охрид',
        naseleno_mesto: 'с. Будинарци',
        osnovno_ucilishte: 'Дедо Иљо Малешевски'
      }
    ];
    this.dataList = list.sort(function (a, b) {
      return a.opshtina.localeCompare(b.opshtina);
    });
    this.filteredSuggestions = this.dataList;
  }

  handleSelection(event: any) {
    const formArray: FormArray = this.filterForm.get('filterDataType') as FormArray;

    //clear checked elements
    formArray.controls.forEach((ctrl: any, i) => {
      formArray.removeAt(i);
    });

    formArray.push(new FormControl(+event.target.value));

    this.selectedKey = +event.target.value;

    const data = this.dataList.find(filterDataType => filterDataType.filteredDataTypeId === this.selectedKey);

    // console.log(data?.opshtina);
    if(data){
      // this.dataservice.loadCSV(data!.opshtina).subscribe();
      this.dataservice.setLocations(data!.opshtina);
      this.dataservice.loadmodelOpshtiniCSV(data!.opshtina).subscribe()
    }
  }

  // Filter the dataList based on the input value
 // Filter the dataList based on the input value
handleFilterChange() {
  let input = this.filterForm.controls['filter'].value;
  // console.log(input);

  if (input.length === 0) {
    this.filteredSuggestions = this.dataList; // Return original list when input is empty
    return;
  }

  // Normalize the input for comparison
  const normalizedInput = this.normalizeCyrillic(input);

  // Fuse.js options
  const options = {
    includeMatches: true,
    minMatchCharLength: 1,
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    keys: [
      { name: 'opshtina', weight: 2 },
      { name: 'naseleno_mesto', weight: 2 },
      { name: 'osnovno_ucilishte', weight: 2 },
    ],
    findAllMatches: false,
  };

  // Normalize the dataList for search but preserve original data
  const normalizedDataList = this.dataList.map(item => ({
    original: item,  // Keep the original data for returning
    opshtina: !!item.opshtina ? this.normalizeCyrillic(item.opshtina) : '',
    naseleno_mesto: !!item.naseleno_mesto ? this.normalizeCyrillic(item.naseleno_mesto) : '',
    osnovno_ucilishte: !!item.osnovno_ucilishte ? this.normalizeCyrillic(item.osnovno_ucilishte) : '',
  }));
  // console.log(this.dataList);
  // console.log(normalizedDataList);

  // Initialize Fuse.js with normalized data
  const fuse = new Fuse(normalizedDataList, options);

  // Search using normalized input
  const results = fuse.search(normalizedInput).map((result) => ({
    data: result.item.original,  // Return original data
    matches: result.matches,
    score: result.score,
  }));

  // Determine if the input is in Cyrillic or Latin and return appropriate script
  if (this.isCyrillic(input)) {
    // Return results in Cyrillic (original data)
    this.filteredSuggestions = results.map(result => result.data);
  } else {
    // Return results in Latin (normalized)
    this.filteredSuggestions = results.map(result => ({
      ...result.data,
      opshtina: !!result.data.opshtina ? this.normalizeCyrillic(result.data.opshtina) : '',
    naseleno_mesto: !!result.data.naseleno_mesto ? this.normalizeCyrillic(result.data.naseleno_mesto) : '',
    osnovno_ucilishte: !!result.data.osnovno_ucilishte ? this.normalizeCyrillic(result.data.osnovno_ucilishte) : '',
    }));
  }
}

// Utility function to check if the input is in Cyrillic
isCyrillic(input: string): boolean {
  // This function returns true if most characters are Cyrillic
  return /[А-яЁё]/.test(input);
}

  
  // Utility function to normalize Cyrillic to Latin or vice versa
  normalizeCyrillic(input: string): string {
    const cyrillicToLatinMap: { [key: string]: string } = {
      'А': 'A', 'а': 'a',
      'Б': 'B', 'б': 'b',
      'В': 'V', 'в': 'v',
      'Г': 'G', 'г': 'g',
      'Д': 'D', 'д': 'd',
      'Ѓ': 'Gj', 'ѓ': 'gj',
      'Е': 'E', 'е': 'e',
      'Ж': 'Zh', 'ж': 'zh',
      'З': 'Z', 'з': 'z',
      'Ѕ': 'Dz', 'ѕ': 'dz',
      'И': 'I', 'и': 'i',
      'Ј': 'J', 'ј': 'j',
      'К': 'K', 'к': 'k',
      'Л': 'L', 'л': 'l',
      'Љ': 'Lj', 'љ': 'lj',
      'М': 'M', 'м': 'm',
      'Н': 'N', 'н': 'n',
      'Њ': 'Nj', 'њ': 'nj',
      'О': 'O', 'о': 'o',
      'П': 'P', 'п': 'p',
      'Р': 'R', 'р': 'r',
      'С': 'S', 'с': 's',
      'Т': 'T', 'т': 't',
      'Ќ': 'Kj', 'ќ': 'kj',
      'У': 'U', 'у': 'u',
      'Ф': 'F', 'ф': 'f',
      'Х': 'h', 'х': 'h',
      'Ц': 'Ts', 'ц': 'ts',
      'Ч': 'Ch', 'ч': 'ch',
      'Џ': 'Dj', 'џ': 'dj',
      'Ш': 'Sh', 'ш': 'sh',
    };
  
    return input.split('').map(char => cyrillicToLatinMap[char] || char).join('');
  }

  isItemSelected(filteredDataTypeId: number): boolean {
    const formArray: FormArray = this.filterForm.get('filterDataType') as FormArray;
    return formArray.controls.some((control) => control.value === filteredDataTypeId);
  }


}
