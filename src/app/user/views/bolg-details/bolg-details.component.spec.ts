import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BolgDetailsComponent } from './bolg-details.component';

describe('BolgDetailsComponent', () => {
  let component: BolgDetailsComponent;
  let fixture: ComponentFixture<BolgDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BolgDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BolgDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
