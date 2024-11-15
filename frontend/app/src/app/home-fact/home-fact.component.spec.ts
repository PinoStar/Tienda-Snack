import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFactComponent } from './home-fact.component';

describe('HomeFactComponent', () => {
  let component: HomeFactComponent;
  let fixture: ComponentFixture<HomeFactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
