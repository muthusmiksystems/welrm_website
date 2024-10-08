import { TestBed } from '@angular/core/testing';

import { BookinghistoryService } from './bookinghistory.service';

describe('BookinghistoryService', () => {
  let service: BookinghistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookinghistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
