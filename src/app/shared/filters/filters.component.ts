// filters.component.ts
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

interface AppliedFilter {
  title: string;
  label: string;
}

interface FilterGroup {
  title: string;
  child: FilterItem[];
}

interface FilterItem {
  label: string;
  count: string;
  checked: boolean;
}

interface PriceFilter {
  name: string;
  value: string;
  label: string;
  min: number;
  max: number;
  checked: boolean;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  minValue: number = 500;
  maxValue: number = 25000;
  appliedFilters: AppliedFilter[] = [];
  options: Options = {
    floor: 500,
    ceil: 25000,
    translate: (value: number, label: LabelType): string => {
      return `<span class="rupee">₹ </span>` + value;
    }
  };

  // Define price filters
  priceFilters: PriceFilter[] = [
    { name: 'range1', value: '2001-4000', label: '2001 - 4000', min: 2001, max: 4000, checked: false },
    { name: 'range2', value: '4001-5000', label: '4001 - 5000', min: 4001, max: 5000, checked: false },
    { name: 'range3', value: '5001-6000', label: '5001 - 6000', min: 5001, max: 6000, checked: false },
    { name: 'range4', value: 'above-6001', label: 'Above 6001', min: 6001, max: 10000, checked: false },
  ];

  filterList: FilterGroup[] = [
    {
      title: 'Star Rating',
      child: [
        { label: '5 Star', count: '41', checked: false },
        { label: '4 Star', count: '88', checked: false },
        { label: '3 Star', count: '118', checked: false },
      ]
    },
    {
      title: 'Facilities',
      child: [
        { label: 'Hot tub', count: '16402', checked: false },
        { label: 'Air conditioner', count: '16402', checked: false },
        { label: 'Sea view', count: '16402', checked: false },
        { label: 'Parking', count: '16402', checked: false },
        { label: 'Free wifi', count: '16402', checked: false },
        { label: 'Restaurant', count: '16402', checked: false },
        { label: 'Room Service', count: '16402', checked: false },
      ]
    },
    {
      title: 'Landmarks',
      child: [
        { label: 'Hidimba Devi', count: '16402', checked: false },
        { label: 'Laxman Hula', count: '16402', checked: false },
        { label: 'Golden Temple', count: '16402', checked: false },
        { label: 'Jallianwala Bagh', count: '16402', checked: false },
        { label: 'Infant aria', count: '16402', checked: false },
        { label: 'Jaialmer fort', count: '16402', checked: false },
        { label: 'Bharathi Park', count: '16402', checked: false },
      ]
    },
    {
      title: 'Property Type',
      child: [
        { label: 'Hotels', count: '16402', checked: false },
        { label: 'Entire home & apartment', count: '1602', checked: false },
        { label: 'Homestay', count: '1602', checked: false },
        { label: 'Resort', count: '1602', checked: false },
        { label: 'Apartments', count: '1602', checked: false },
        { label: 'Guest house', count: '1602', checked: false },
        { label: 'Bharathi Park', count: '1602', checked: false },
      ]
    },
    {
      title: 'Top destinations in India',
      child: [
        { label: 'Delhi NCR', count: '16402', checked: false },
        { label: 'Uttar Pradesh', count: '16402', checked: false },
        { label: 'Maharashtra', count: '16402', checked: false },
        { label: 'Rajasthan', count: '16402', checked: false },
        { label: 'Tamil Nadu', count: '16402', checked: false },
        { label: 'Kerala', count: '16402', checked: false },
        { label: 'Goa', count: '16402', checked: false },
      ]
    },
  ];

  @Output() changeRangeSlider: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void { }

  onChangeSlider(event: any) {
    this.changeRangeSlider.emit(event);
    // Optionally, add slider changes to appliedFilters
    // But ensure to handle them appropriately
  }

  toggleFilter(itemTitle: string, filter: FilterItem) {
    console.log('itemTitle', itemTitle)
    console.log('filter', filter)
    // Toggle the checked state
    filter.checked = !filter.checked;

    if (!filter.checked) {
      // Add to applied filters only if it was unchecked before
      this.appliedFilters.push({ title: itemTitle, label: filter.label });
    } else {
      // Remove from applied filters only if it was checked before
      this.appliedFilters = this.appliedFilters.filter(f => f.label !== filter.label);
    }

    // Optionally, emit the change to parent component
    // this.changeRangeSlider.emit(this.appliedFilters);
  }


  togglePriceFilter(minValue: number, maxValue: number, itemTitle: string, isChecked: boolean) {
    if (isChecked) {
      // Emit selected price range
      this.changeRangeSlider.emit({ value: minValue, highValue: maxValue });
      // Add to applied filters
      this.appliedFilters.push({ title: itemTitle, label: `₹ ${minValue} - ₹ ${maxValue}` });
    } else {
      // Emit default slider values to clear
      this.changeRangeSlider.emit({ value: this.minValue, highValue: this.maxValue });
      // Remove from applied filters
      this.appliedFilters = this.appliedFilters.filter(f => f.label !== `₹ ${minValue} - ₹ ${maxValue}`);
    }
  }

  clearAllFilters(): void {
    // Clear the applied filters array
    this.appliedFilters = [];

    // Uncheck all filters
    this.filterList.forEach(group => {
      group.child.forEach(filter => filter.checked = false);
    });

    // Uncheck all price filters
    this.priceFilters.forEach(price => price.checked = false);

    // Reset slider values
    this.minValue = 500;
    this.maxValue = 25000;
    this.changeRangeSlider.emit({ value: this.minValue, highValue: this.maxValue });
  }

  removeFilter(filter: AppliedFilter): void {
    // Remove the filter from appliedFilters array
    this.appliedFilters = this.appliedFilters.filter(f => f.label !== filter.label);

    // Loop through the filterList to find the corresponding filter and uncheck it
    this.filterList.forEach(group => {
      group.child.forEach(childFilter => {
        if (childFilter.label === filter.label) {
          childFilter.checked = false;
        }
      });
    });

    // Additionally, handle price filters
    this.priceFilters.forEach(price => {
      if (`₹ ${price.min} - ₹ ${price.max}` === filter.label || price.label === filter.label) {
        price.checked = false;
        // Emit default slider values if a price filter is removed
        this.changeRangeSlider.emit({ value: this.minValue, highValue: this.maxValue });
      }
    });
  }
}
