import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrSidebarComponent } from './pr-sidebar.component';

describe('PrSidebarComponent', () => {
  let component: PrSidebarComponent;
  let fixture: ComponentFixture<PrSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
