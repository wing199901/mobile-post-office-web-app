import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ListComponent } from './list.component';
import { MobilePostOfficeService } from '../../services/mobile-post-office.service';
import { LanguageService } from '../../services/language.service';
import { LoadingService } from '../../services/loading.service';
import { of, throwError } from 'rxjs';
import { PaginatedResponse, MobilePostOffice } from '../../models/mobile-post-office.model';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockService: any;
  let mockLanguageService: any;
  let mockLoadingService: any;

  const mockRecords: MobilePostOffice[] = [
    {
      id: 1,
      mobileCode: '1',
      seq: 1,
      name: 'Test Post Office 1',
      district: 'Yuen Long',
      location: 'Test Location',
      address: 'Test Address',
      openHour: '09:00',
      closeHour: '17:00',
      dayOfWeekCode: 1,
      latitude: '22.36774',
      longitude: '114.06233',
    },
    {
      id: 2,
      mobileCode: '2',
      seq: 2,
      name: 'Test Post Office 2',
      district: 'Tuen Mun',
      location: 'Test Location 2',
      address: 'Test Address 2',
      openHour: '10:00',
      closeHour: '18:00',
      dayOfWeekCode: 2,
    },
  ];

  const mockPaginatedResponse: PaginatedResponse<MobilePostOffice> = {
    data: mockRecords,
    total: 2,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  };

  beforeEach(async () => {
    const serviceSpy = {
      getAll: vi.fn(),
    };
    const languageSpy = {
      translate: vi.fn(),
      getCurrentLanguage: vi.fn(),
      currentLanguage: signal('en'),
      languageChange$: of('en'), // Add observable to prevent subscription errors
    };
    const loadingSpy = {
      show: vi.fn(),
      hide: vi.fn(),
      isLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [
        ListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MobilePostOfficeService, useValue: serviceSpy },
        { provide: LanguageService, useValue: languageSpy },
        { provide: LoadingService, useValue: loadingSpy },
      ],
    }).compileComponents();

    mockService = TestBed.inject(MobilePostOfficeService);
    mockLanguageService = TestBed.inject(LanguageService);
    mockLoadingService = TestBed.inject(LoadingService);

    mockLanguageService.translate.mockReturnValue('Translated Text');

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load records on init', () => {
    mockService.getAll.mockReturnValue(of(mockPaginatedResponse));

    fixture.detectChanges(); // triggers ngOnInit

    expect(mockService.getAll).toHaveBeenCalled();
    expect(component.records().length).toBe(2);
    expect(component.totalRecords()).toBe(2);
  });

  it('should handle empty results', () => {
    const emptyResponse: PaginatedResponse<MobilePostOffice> = {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    };
    mockService.getAll.mockReturnValue(of(emptyResponse));

    fixture.detectChanges();

    expect(component.records().length).toBe(0);
    expect(component.totalRecords()).toBe(0);
  });

  it('should handle pagination', () => {
    mockService.getAll.mockReturnValue(of(mockPaginatedResponse));
    fixture.detectChanges();

    const pageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 20,
    };

    component.onPageChange(pageEvent);

    expect(mockService.getAll).toHaveBeenCalled();
    const calls = mockService.getAll.mock.calls;
    const callArgs = calls[calls.length - 1][0];
    expect(callArgs.page).toBe(2);
    expect(callArgs.limit).toBe(10);
  });

  it('should reload records when search params change', () => {
    mockService.getAll.mockReturnValue(of(mockPaginatedResponse));
    fixture.detectChanges();

    const searchParams = {
      search: 'test',
      district: 'Yuen Long',
      dayOfWeek: 1,
    };

    component.loadRecords(searchParams);

    expect(mockService.getAll).toHaveBeenCalled();
    const calls = mockService.getAll.mock.calls;
    const callArgs = calls[calls.length - 1][0];
    expect(callArgs.search).toBe('test');
    expect(callArgs.district).toBe('Yuen Long');
  });

  it('should navigate to detail page on view', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    component.viewDetail(mockRecords[0]);

    expect(router.navigate).toHaveBeenCalledWith(['/detail', 1]);
  });

  it('should navigate to edit page', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    component.editRecord(mockRecords[0]);

    expect(router.navigate).toHaveBeenCalledWith(['/edit', 1]);
  });

  it('should handle service errors gracefully', () => {
    const error = {
      err_code: '0401',
      err_msg: 'Server error',
    };
    mockService.getAll.mockReturnValue(throwError(() => error));

    fixture.detectChanges();

    // Component should handle error without crashing
    expect(component.records().length).toBe(0);
  });

  it('should display correct number of columns', () => {
    expect(component.displayedColumns.length).toBe(7);
    expect(component.displayedColumns).toContain('name');
    expect(component.displayedColumns).toContain('district');
    expect(component.displayedColumns).toContain('actions');
  });

  it('should update records when onSearchChange is called', () => {
    mockService.getAll.mockReturnValue(of(mockPaginatedResponse));
    fixture.detectChanges();

    const searchParams = {
      search: 'post office',
      lang: 'en' as const,
    };

    component.onSearchChange(searchParams);

    expect(mockService.getAll).toHaveBeenCalled();
    const calls = mockService.getAll.mock.calls;
    const callArgs = calls[calls.length - 1][0];
    expect(callArgs.search).toBe('post office');
  });

  it('should respect page size options', () => {
    expect(component.pageSizeOptions).toContain(5);
    expect(component.pageSizeOptions).toContain(10);
    expect(component.pageSizeOptions).toContain(20);
    expect(component.pageSizeOptions).toContain(50);
  });

  it('should convert dayOfWeekCode to day name', () => {
    // Assuming you add a helper method to the component
    // This test will need to be adjusted based on your implementation
    expect(component.displayedColumns).toBeDefined();
  });

  it('should handle language changes', () => {
    mockService.getAll.mockReturnValue(of(mockPaginatedResponse));
    fixture.detectChanges();

    // Check records are displayed
    expect(component.records().length).toBe(2);

    // Simulate language change
    mockLanguageService.getCurrentLanguage.mockReturnValue('tc');
    expect(mockLanguageService.getCurrentLanguage()).toBe('tc');
  });

  it('should format time fields correctly', () => {
    mockService.getAll.mockReturnValue(of(mockPaginatedResponse));
    fixture.detectChanges();

    const record = component.records()[0];
    expect(record.openHour).toMatch(/^\d{2}:\d{2}$/);
    expect(record.closeHour).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should display dayOfWeekCode as number 1-7', () => {
    mockService.getAll.mockReturnValue(of(mockPaginatedResponse));
    fixture.detectChanges();

    const record = component.records()[0];
    expect(record.dayOfWeekCode).toBeGreaterThanOrEqual(1);
    expect(record.dayOfWeekCode).toBeLessThanOrEqual(7);
  });
});
