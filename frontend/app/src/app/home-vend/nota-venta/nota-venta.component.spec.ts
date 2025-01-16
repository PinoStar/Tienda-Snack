import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaVentaComponent } from './nota-venta.component';

describe('NotaVentaComponent', () => {
  let component: NotaVentaComponent;
  let fixture: ComponentFixture<NotaVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
