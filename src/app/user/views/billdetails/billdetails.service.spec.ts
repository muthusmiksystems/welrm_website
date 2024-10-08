import { TestBed } from '@angular/core/testing';

import { BilldetailsService } from './billdetails.service';

describe('BilldetailsService', () => {
  let service: BilldetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BilldetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
