import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SearchService } from './search.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators,
} from "@angular/forms";

import { DataMessageService } from 'src/app/message.service'

interface AutoCompleteCompleteEvent {
	originalEvent: Event;
	query: string;
}

@Component({
	selector: 'app-hotel-search',
	templateUrl: './hotel-search.component.html',
	styleUrls: ['./hotel-search.component.scss'],
	providers: [DatePipe],
})
export class HotelSearchComponent implements OnInit {
	@ViewChild('calendarRef') private calendarRef: any;
	@Input() allLocation: any;
	@Output() searchQueryChange = new EventEmitter<string>();
	searchQuery: string = '';
	numOfGuest!: number;
	mindate = new Date();
	startDate!: any;
	endDate!: any;
	lastSelectedCheckInDate: any;
	dates!: Date[];
	rangeDates!: Date[];
	invalidDates!: Array<Date>;
	hoveredDate: any;
	items: any[] | undefined;
	selectedItem: any;
	suggestions: any[] = [];
	personCountV: boolean = false;
	adults = 2;
	childs = 0;
	childlastvalue = 0;
	childages = 0;
	room: number = 1;
	minimumDate = new Date();
	minimumDatecIn = new Date();
	date: Date | undefined;
	responsiveOptions: any[] | undefined;
	selectedCity: string | undefined;
	checkInDate: any;
	checkOutDate: any;
	searchForm: boolean = false;
	isRoomDetailsRoute: boolean;
	isListRoute: boolean = false;
	currentRoute: any;
	showChild: boolean = false;
	searchDataCities: any;
	searchDataHotels: any;
	searchDataLocations: any;
	showSearch: boolean = false;
	form = new FormGroup({
		cityOrhotelOrneighborhood: new FormControl("", [Validators.required]),
		checkInDate: new FormControl("", [Validators.required]),
		checkOutDate: new FormControl("", [Validators.required]),
		petFriendly: new FormControl(""),
	});

	paramiterForhotelSearch: any;
	cityOrhotelOrneighborhood: any = '';

	browserName = '';
	browserVersion = '';
	routerEvents: any;
	slugUrl: any;
	childArr: any = [];
	// rangeDates = new Date();

	childAge: any = [
		{ id: '<1', name: '<1', selected: null },
		{ id: '1', name: '1', selected: null },
		{ id: '2', name: '2', selected: null },
		{ id: '3', name: '3', selected: null },
		{ id: '4', name: '4', selected: null },
		{ id: '5', name: '5', selected: null },
		{ id: '6', name: '6', selected: null },
		{ id: '7', name: '7', selected: null },
		{ id: '8', name: '8', selected: null },
		{ id: '9', name: '9', selected: null },
		{ id: '10', name: '10', selected: null },
		{ id: '11', name: '11', selected: null },
		{ id: '12', name: '12', selected: null },
	];
	searchCities = [
		{ name: 'Delhi' },
		{ name: 'Mumbai' },
		{ name: 'Bangaluru' },
		{ name: 'Goa' },
		{ name: 'Chennai' },
		{ name: 'Punjab' },
	];
	@Output() searchChange = new EventEmitter<boolean>();

	constructor(
		private datePipe: DatePipe,
		private searchService: SearchService,
		private eRef: ElementRef,
		private router: Router,
		private route: ActivatedRoute,
		private messageService: DataMessageService,
		private cookieService: CookieService,
		private messageService1: MessageService) {
		this.routerEvents = this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationEnd) {
				this.slugUrl = event.url;

				// Check if the URL is exactly '/list'
				this.isListRoute = this.slugUrl === '/list' || this.slugUrl.includes('room-details/getroom') ? true : false;
				console.log("scroll event", this.isListRoute);
				this.currentRoute = this.slugUrl;
				if (this.slugUrl === '/') {
					localStorage.removeItem('paramiterForhotelSearch');
					localStorage.removeItem('bookingData');
				}
			}
		});

		this.router.events.subscribe(() => {
			this.isRoomDetailsRoute = this.router.url.includes('room-details/getroom');
			localStorage.setItem('isRoomDetailsRoute', JSON.stringify(this.isRoomDetailsRoute)); // Store as a string

		});
		this.browserName = this.detectBrowserName();
		this.browserVersion = this.detectBrowserVersion();

		// if(localStorage.getItem('browserName')==null || localStorage.getItem('browserName')!=this.browserName)
		// {
		// 	localStorage.setItem('browserName', JSON.stringify(this.browserName));
		// }

		// if(localStorage.getItem('browserVersion')==null || localStorage.getItem('browserVersion')!=this.browserVersion)
		// {
		// 	localStorage.setItem('browserVersion', JSON.stringify(this.browserVersion));
		// }
	}

	detectBrowserName() {
		const agent = window.navigator.userAgent.toLowerCase()
		switch (true) {
			case agent.indexOf('edge') > -1:
				return 'edge';
			case agent.indexOf('opr') > -1 && !!(<any>window).opr:
				return 'opera';
			case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
				return 'chrome';
			case agent.indexOf('trident') > -1:
				return 'ie';
			case agent.indexOf('firefox') > -1:
				return 'firefox';
			case agent.indexOf('safari') > -1:
				return 'safari';
			default:
				return 'other';
		}
	}

	detectBrowserVersion() {
		var userAgent = navigator.userAgent, tem,
			matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

		if (/trident/i.test(matchTest[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
			return 'IE ' + (tem[1] || '');
		}
		if (matchTest[1] === 'Chrome') {
			tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
			if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);
		return matchTest.join(' ');
	}

	get f() {
		return this.form.controls;
	}

	getFormattedDate(dateString: any) {
		const d = new Date(dateString);
		const day = d.getDate(); // Get the day as a number
		const month = d.toLocaleString('default', { month: 'short' }); // Get abbreviated month name (e.g., "Oct")
		const year = d.getFullYear(); // Get the full year

		return `${day} ${month} ${year}`;
	}

	ngOnInit(): void {
		this.isRoomDetailsRoute = localStorage.getItem('isRoomDetailsRoute') === 'true' ? true : false
		this.route.url.subscribe(url => {
			const currentRoute = url.join('/');
			console.log('Current route name:', currentRoute);

			// Check if the current route is 'list' or starts with 'list/'
			this.isListRoute = currentRoute === 'list' || currentRoute.startsWith('list/');
		});
		this.messageService.getMessage().subscribe(message => {
			console.log("messageservice", message)

			if (message.event == 'paramiterForhotelSearch') {
				this.paramiterForhotelSearch = message.data;
				console.log("messagedata", message.data)
				localStorage.setItem('paramiterForhotelSearch', message.data);

				const paramiterForhotelSearchArray = this.paramiterForhotelSearch.split("@#$&");
				this.cityOrhotelOrneighborhood = paramiterForhotelSearchArray[0]
				this.checkInDate = paramiterForhotelSearchArray[1]
				this.checkOutDate = paramiterForhotelSearchArray[2]
				this.adults = paramiterForhotelSearchArray[3]
				this.childs = paramiterForhotelSearchArray[4]
				this.room = paramiterForhotelSearchArray[5]
				this.form.patchValue({
					cityOrhotelOrneighborhood: this.cityOrhotelOrneighborhood,
					checkInDate: this.checkInDate,
					checkOutDate: this.checkOutDate
				});
				this.childlastvalue = this.childs;
			}
		});

		if (localStorage.getItem('paramiterForhotelSearch') == null) {
			const today = new Date() // get today's date
			const tomorrow = new Date(today)

			this.form.patchValue({
				cityOrhotelOrneighborhood: '',
				checkInDate: this.formatDate(new Date()),
				checkOutDate: this.formatDate(tomorrow.setDate(tomorrow.getDate() + 1))
			});
		} else {
			this.paramiterForhotelSearch = localStorage.getItem('paramiterForhotelSearch');

			const paramiterForhotelSearchArray = this.paramiterForhotelSearch.split("@#$&");
			this.cityOrhotelOrneighborhood = paramiterForhotelSearchArray[0]
			this.checkInDate = paramiterForhotelSearchArray[1]
			this.checkOutDate = paramiterForhotelSearchArray[2]
			this.adults = paramiterForhotelSearchArray[3]
			this.childs = paramiterForhotelSearchArray[4]
			this.room = paramiterForhotelSearchArray[5]

			this.form.patchValue({
				cityOrhotelOrneighborhood: this.cityOrhotelOrneighborhood,
				checkInDate: this.checkInDate,
				checkOutDate: this.checkOutDate
			});
		}
		this.showChild = this.childs > 0 ? true : false
		this.setTodayDate(100);

		this.handleChild();

	}

	ngAfterViewInit() {
	}

	search(event: AutoCompleteCompleteEvent) {
		this.suggestions = this.allLocation.map((obj: { name: any; }) => obj.name.toLowerCase());
	}

	onSearch() {
		this.searchService.searchFilterData(this.searchQuery, this.startDate, this.endDate, this.numOfGuest).subscribe((response: any) => {
			const dataArray = response.data;
			this.router.navigate(['/list'], { state: { data: dataArray } });
		})
	}
	// onSearchQueryChange(query: string) {
	// 	this.searchQuery = query;
	// 	if (query) {
	// 	  this.apiService.searchData(query).subscribe((data: any) => {
	// 		this.results = data.data.result;
	// 		this.results.forEach((element: any, index: number) => {
	// 		  element['slug'] = this.convertToSlug(`${element['hotelName']}`);
	// 		})
	// 	  });
	// 	} else {
	// 	  this.results = [];
	// 	}

	//   }
	onDateSelect(selectedValue: Date) {
		console.log('onDateSelect', this.rangeDates)
		if (this.rangeDates[1]) {
			this.startDate = this.formatDate(this.rangeDates[0]);
			this.endDate = this.formatDate(this.rangeDates[1]);

			this.calendarRef.hideOverlay();
		};
	}

	personCountF() {
		this.personCountV = this.personCountV == true ? false : true;
	}

	adultIncreseF() {
		this.adults = this.adults * 1 + 1;
	}

	adultDeceaseF() {
		if (this.adults > 1) {
			this.adults = this.adults - 1;
		} else {
			this.adults = 1
		}
	}

	childIncreseF() {
		this.childs = this.childs * 1 + 1;
		this.childArr.push({ id: this.childs, selected: '' });
		this.showChild = true;
	}

	childDeceaseF() {
		console.log("this.childs", this.childs)
		if (this.childs === 1) {
			// 	this.childs = this.childs - 1;
			// 	this.childages = 0
			this.showChild = false;
		}
		if (this.childs > 0) {
			this.childArr.pop();
			this.childs = this.childs - 1;
			this.childages = 0
		} else {
			this.showChild = false;
			this.childs = 0;
			this.childages = 0
		}
	}

	roomIncreseF() {
		this.room = this.room * 1 + 1;
	}

	roomDeceaseF() {
		if (this.room > 1) {
			this.room = this.room - 1;
		} else {
			this.room = 1;
		}
	}

	selectCheckIndate(v: any) {
		console.log("v---", v);
		const checkInDate = this.form.get('checkInDate')?.value;
		this.minimumDatecIn = v;
		console.log('vv--', this.form.controls.checkInDate.value)
		this.form.patchValue({
			checkInDate: this.formatDate(v)
		})
		if (this.calendarRef) {
			this.calendarRef.showOverlay();

		}
		this.form.patchValue({
			checkOutDate: ''
		});
		this.onSelectClose(v)
	}


	submit(isdropdown?) {
		var checkInDate = '';
		this.searchForm = true;
		this.personCountV = false;

		if (this.form.value.checkInDate) {
			checkInDate = this.convert(this.form.value.checkInDate)
		}

		var checkOutDate = '';
		if (this.form.value.checkOutDate) {
			checkOutDate = this.convert(this.form.value.checkOutDate)
		}

		var paramsString = this.form.value.cityOrhotelOrneighborhood + '@#$&' + checkInDate + '@#$&' + checkOutDate + '@#$&' + this.adults + '@#$&' + this.childs + '@#$&' + this.room;
		if (this.form.valid && this.searchForm && !this.isChildeAge()) {
			let islocationChange = false;
			if (this.cityOrhotelOrneighborhood !== this.form.value.cityOrhotelOrneighborhood) {
				islocationChange = true;
			}

			this.searchChange.emit(true);
			if (!islocationChange) this.searchQueryChange.emit(paramsString);
			setTimeout(() => {
				this.messageService.sendMessage('paramiterForhotelSearch', paramsString);
			}, 100);

			if (this.slugUrl == '/list') {
				//location.reload();
				this.messageService.sendMessage('hotelSearchApicall', 'hotelSearchApicall');
			} else if (this.slugUrl.includes('/room-details/getroom') && !islocationChange) {
				this.messageService.sendMessage('paramiterForhotelSearchh', paramsString);
			} else {
				this.router.navigate([`list`]);
			}
		} else {
			console.log('this.isChildeAge(): ', this.isChildeAge());
			if (this.form.controls.cityOrhotelOrneighborhood.status == 'INVALID') {
				this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Fill your search first' });
			} else if (this.form.controls.checkInDate.status == 'INVALID') {
				this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Check In field is required' });
			} else if (this.form.controls.checkOutDate.status == 'INVALID') {
				this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Check Out field is required' });
			}
			this.checkChildAge(isdropdown);
		}
	}




	convert(str: any) {
		const d = new Date(str);
		const day = d.getDate(); // Get the day as a number
		const month = d.toLocaleString('default', { month: 'short' }); // Get abbreviated month name (e.g., "Oct")
		const year = d.getFullYear(); // Get the full year

		return `${day} ${month} ${year}`;
	}
	formatDate(date: any) {
		const d = new Date(date);
		return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
	}




	handleChild() {
		this.childArr = [];
		for (let i = 0; i < this.childs; i++) {
			this.childArr.push({ id: i + 1, selected: '' });
		}
	}

	selectCity(city) {
		this.form.get("cityOrhotelOrneighborhood")?.setValue(city);
		this.cityOrhotelOrneighborhood = city;
		this.showSearch = false;
	}

	setTodayDate(time?: any) {
		setTimeout(() => {
			let date1: any = document.getElementById('checkInDate');
			let date2: any = document.getElementById('checkOutDate');
			let formatDate1 = date1.children[0].children[0]
			let formatDate2 = date2.children[0].children[0]

			if (!formatDate1?.value) {
				formatDate1.value = this.form.value.checkInDate;
			}
			if (!formatDate2?.value) {
				formatDate2.value = this.form.value.checkOutDate;
			}
			console.log(this.form)
		}, time);
	}


	onSelectClose(event?: any) {
		const checkInDateControl = this.form.controls.checkInDate;
		console.log("kkkk")
		this.minimumDatecIn = event;
		this.setTodayDate(0);
		this.form.patchValue({
			checkOutDate: ''
		});
	}

	isChildeAge() {
		let childs = this.childArr?.filter(f => f.selected === '');
		return childs?.length ? true : false;
	}

	checkChildAge(isTrue?) {
		let isSelect = this.isChildeAge();
		if (isSelect) {
			if (isTrue) isTrue.open();
			this.childArr?.forEach(el => {
				if (el.selected === '') {
					el.msg = 'required child age';
				} else {
					el.msg = '';
				}
			});
		} else {
			this.childArr?.forEach(el => { el.msg = ''; });
			isTrue.close();
		}
		console.log(this.childArr[0]?.selected ? this.childArr[0]?.selected : 0)
		this.childages = this.childArr[0]?.selected ? this.childArr[0]?.selected : 0;
	}
	searchResults() {
		const searchTerm = this.form.get('cityOrhotelOrneighborhood')?.value?.trim();

		if (!searchTerm) {
			this.showSearch = false;
			return;
		}

		const data = { query: searchTerm };

		if (searchTerm.length > 2) {
			this.searchService.searchResults(data).subscribe(
				(response: any) => {
					this.searchDataCities = response.results.cities || [];
					this.searchDataHotels = response.results.hotels || [];
					this.searchDataLocations = response.results.location || [];
					this.showSearch = this.searchDataCities.length > 0 || this.searchDataHotels.length > 0 || this.searchDataLocations.length > 0;
				},
				(error) => {
					console.error("Error fetching search results:", error);
					this.showSearch = false;
				}
			);
		} else {
			this.showSearch = false;
		}
	}

	@HostListener('document:click', ['$event'])
	handleClickOutside(event: Event) {
		if (!this.eRef.nativeElement.contains(event.target)) {
			this.showSearch = false; // Hide search list when clicking outside
		}
	}


}
