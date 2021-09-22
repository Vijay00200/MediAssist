import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDictionaryComponent } from './mat-dictionary.component';

describe('MatDictionaryComponent', () => {
  let component: MatDictionaryComponent;
  let fixture: ComponentFixture<MatDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatDictionaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
