import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleproducComponent } from './detalleproduc.component';

describe('DetalleproducComponent', () => {
  let component: DetalleproducComponent;
  let fixture: ComponentFixture<DetalleproducComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleproducComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleproducComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
