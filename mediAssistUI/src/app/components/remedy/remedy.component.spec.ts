import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemedyComponent } from './remedy.component';

describe('RemedyComponent', () => {
  let component: RemedyComponent;
  let fixture: ComponentFixture<RemedyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemedyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemedyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
