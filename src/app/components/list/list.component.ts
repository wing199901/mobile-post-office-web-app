import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MobilePostOffice, QueryParams } from '../../models/mobile-post-office.model';
import { MobilePostOfficeService } from '../../services/mobile-post-office.service';
import { LanguageService } from '../../services/language.service';
import { LoadingService } from '../../services/loading.service';
import { dayOfWeekCodeToName } from '../../utils/date-utils';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  private router = inject(Router);
  private mobilePostOfficeService = inject(MobilePostOfficeService);
  private languageService = inject(LanguageService);
  protected loadingService = inject(LoadingService);

  // Receive search parameters
  searchParams = input<QueryParams>({});

  // Data list
  records = signal<MobilePostOffice[]>([]);

  // Pagination info
  totalRecords = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  // Store last search params to preserve across pagination
  private lastSearchParams: QueryParams = {};

  // Displayed columns (base columns)
  private baseColumns: string[] = [
    'name',
    'district',
    'location',
    'dayOfWeek',
    'openHour',
    'closeHour',
    'actions',
  ];

  // Multi-language columns
  private allLangColumns: string[] = [
    'nameEN',
    'nameTC',
    'nameSC',
    'districtEN',
    'districtTC',
    'districtSC',
    'locationEN',
    'locationTC',
    'locationSC',
    'dayOfWeek',
    'openHour',
    'closeHour',
    'actions',
  ];

  // Displayed columns
  displayedColumns: string[] = this.baseColumns;

  // Page size options
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];

  ngOnInit(): void {
    this.loadRecords();

    // Subscribe to language change event to reload data
    this.languageService.languageChange$.subscribe(() => {
      this.loadRecords();
    });
  }

  /**
   * Load records
   */
  loadRecords(queryParams: QueryParams = {}): void {
    this.loadingService.show();

    console.log('=== List Component loadRecords ===');
    console.log('Input queryParams:', queryParams);
    console.log('searchParams():', this.searchParams());

    const params: QueryParams = {
      ...this.searchParams(),
      ...queryParams,
      page: this.currentPage(),
      limit: this.pageSize(),
      // Don't override lang if it's already set in queryParams
      lang: queryParams.lang || this.languageService.getCurrentLanguage(),
    };

    console.log('Final params sent to API:', params);

    this.mobilePostOfficeService.getAll(params).subscribe({
      next: (response) => {
        this.records.set(response.data);
        this.totalRecords.set(response.total);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to load records:', error);
        this.records.set([]);
        this.totalRecords.set(0);
        this.loadingService.hide();
      },
    });
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    console.log('Pagination changed, using last search params:', this.lastSearchParams);
    this.loadRecords(this.lastSearchParams);
  }

  /**
   * View detail information
   */
  viewDetail(record: MobilePostOffice): void {
    this.router.navigate(['/detail', record.id]);
  }

  /**
   * Edit record
   */
  editRecord(record: MobilePostOffice): void {
    this.router.navigate(['/edit', record.id]);
  }

  /**
   * Get translated text
   */
  translate(key: string): string {
    return this.languageService.translate(key);
  }

  /**
   * Reload when search parameters change
   */
  onSearchChange(params: QueryParams): void {
    this.currentPage.set(1); // Reset to first page
    this.lastSearchParams = { ...params };
    this.loadRecords(params);
  }

  /**
   * Convert dayOfWeekCode to day name
   */
  getDayName(code: number): string {
    return dayOfWeekCodeToName(code);
  }
}
