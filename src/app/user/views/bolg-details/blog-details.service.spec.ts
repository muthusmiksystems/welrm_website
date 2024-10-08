import { TestBed } from '@angular/core/testing';

import { BlogDetailsService } from './blog-details.service';

describe('BlogDetailsService', () => {
  let service: BlogDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
