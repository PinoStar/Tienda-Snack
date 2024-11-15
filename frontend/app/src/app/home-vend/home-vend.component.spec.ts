import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVendComponent } from './home-vend.component';

describe('HomeVendComponent', () => {
  let component: HomeVendComponent;
  let fixture: ComponentFixture<HomeVendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeVendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeVendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
