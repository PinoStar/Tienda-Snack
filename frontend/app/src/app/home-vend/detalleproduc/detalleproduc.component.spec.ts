import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleProducComponent } from '../detalleproduc/detalleproduc.component';

describe('DetalleproducComponent', () => {
  let component: DetalleProducComponent;
  let fixture: ComponentFixture<DetalleProducComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleProducComponent] // Aquí se coloca el componente
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleProducComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
