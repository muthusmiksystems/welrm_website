import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPartnerComponent } from './hotel-partner.component';

describe('HotelPartnerComponent', () => {
  let component: HotelPartnerComponent;
  let fixture: ComponentFixture<HotelPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
