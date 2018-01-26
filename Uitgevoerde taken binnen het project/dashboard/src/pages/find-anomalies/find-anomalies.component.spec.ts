import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAnomaliesComponent } from './find-anomalies.component';

describe('FindAnomaliesComponent', () => {
  let component: FindAnomaliesComponent;
  let fixture: ComponentFixture<FindAnomaliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindAnomaliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindAnomaliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
