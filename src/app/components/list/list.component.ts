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

  // 接收搜尋參數
  searchParams = input<QueryParams>({});

  // 資料列表
  records = signal<MobilePostOffice[]>([]);

  // 分頁資訊
  totalRecords = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  // Store last search params to preserve across pagination
  private lastSearchParams: QueryParams = {};

  // 顯示的欄位 (基本欄位)
  private baseColumns: string[] = [
    'name',
    'district',
    'location',
    'dayOfWeek',
    'openHour',
    'closeHour',
    'actions',
  ];

  // 多語言欄位
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

  // 顯示的欄位
  displayedColumns: string[] = this.baseColumns;

  // 分頁大小選項
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];

  ngOnInit(): void {
    this.loadRecords();

    // Subscribe to language change event to reload data
    this.languageService.languageChange$.subscribe(() => {
      this.loadRecords();
    });
  }

  /**
   * 載入記錄
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
   * 處理分頁變更
   */
  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    console.log('Pagination changed, using last search params:', this.lastSearchParams);
    this.loadRecords(this.lastSearchParams);
  }

  /**
   * 查看詳細資訊
   */
  viewDetail(record: MobilePostOffice): void {
    this.router.navigate(['/detail', record.id]);
  }

  /**
   * 編輯記錄
   */
  editRecord(record: MobilePostOffice): void {
    this.router.navigate(['/edit', record.id]);
  }

  /**
   * 取得翻譯文字
   */
  translate(key: string): string {
    return this.languageService.translate(key);
  }

  /**
   * 當搜尋參數改變時重新載入
   */
  onSearchChange(params: QueryParams): void {
    this.currentPage.set(1); // 重設為第一頁
    this.lastSearchParams = { ...params };
    this.loadRecords(params);
  }

  /**
   * 轉換 dayOfWeekCode 為星期名稱
   */
  getDayName(code: number): string {
    return dayOfWeekCodeToName(code);
  }
}
