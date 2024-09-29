import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsnovnoModalComponent } from './osnovno-modal.component';

describe('OsnovnoModalComponent', () => {
  let component: OsnovnoModalComponent;
  let fixture: ComponentFixture<OsnovnoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsnovnoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsnovnoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
