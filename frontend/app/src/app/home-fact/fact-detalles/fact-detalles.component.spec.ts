import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactDetallesComponent } from './fact-detalles.component';

describe('FactDetallesComponent', () => {
  let component: FactDetallesComponent;
  let fixture: ComponentFixture<FactDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactDetallesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
