import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdcutosHisComponent } from './prodcutos-his.component';

describe('ProdcutosHisComponent', () => {
  let component: ProdcutosHisComponent;
  let fixture: ComponentFixture<ProdcutosHisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdcutosHisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdcutosHisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
