import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPediComponent } from './history-pedi.component';

describe('HistoryPediComponent', () => {
  let component: HistoryPediComponent;
  let fixture: ComponentFixture<HistoryPediComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPediComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryPediComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
