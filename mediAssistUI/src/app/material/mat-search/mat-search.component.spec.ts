import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSearchComponent } from './mat-search.component';

describe('MatSearchComponent', () => {
  let component: MatSearchComponent;
  let fixture: ComponentFixture<MatSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
