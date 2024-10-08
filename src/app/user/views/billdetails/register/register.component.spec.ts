import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredComponent } from './register.component';

describe('RegisteredComponent', () => {
  let component: RegisteredComponent;
  let fixture: ComponentFixture<RegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
