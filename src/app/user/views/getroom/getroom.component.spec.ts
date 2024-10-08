import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetroomComponent } from './getroom.component';

describe('GetroomComponent', () => {
  let component: GetroomComponent;
  let fixture: ComponentFixture<GetroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetroomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
