import { TestBed } from '@angular/core/testing';

import { GetroomService } from './getroom.service';

describe('GetroomService', () => {
  let service: GetroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
