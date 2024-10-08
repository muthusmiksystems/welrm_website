import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotficationComponent } from './notfication.component';

describe('NotficationComponent', () => {
  let component: NotficationComponent;
  let fixture: ComponentFixture<NotficationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotficationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotficationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
