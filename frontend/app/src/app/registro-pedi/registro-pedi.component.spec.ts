import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPediComponent } from './registro-pedi.component';

describe('RegistroPediComponent', () => {
  let component: RegistroPediComponent;
  let fixture: ComponentFixture<RegistroPediComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPediComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPediComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
