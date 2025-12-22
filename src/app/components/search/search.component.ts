import { Component, OnInit, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QueryParams, DAYS_OF_WEEK } from '../../models/mobile-post-office.model';
import { LanguageService } from '../../services/language.service';
import { MobilePostOfficeService } from '../../services/mobile-post-office.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private languageService = inject(LanguageService);
  private mobilePostOfficeService = inject(MobilePostOfficeService);

  // 搜尋表單
  searchForm!: FormGroup;

  // 地區選項
  districts = signal<string[]>([]);

  // 星期選項
  readonly daysOfWeek = DAYS_OF_WEEK;

  // 排序選項
  readonly sortOptions = [
    { value: 'id', label: 'sort.id' },
    { value: 'seq', label: 'sort.seq' },
    { value: 'name', label: 'sort.name' },
    { value: 'district', label: 'sort.district' },
    { value: 'openHour', label: 'sort.openAt' },
    { value: 'closeHour', label: 'sort.closeAt' },
  ];

  // 輸出事件：當搜尋條件變更時
  searchChange = output<QueryParams>();

  ngOnInit(): void {
    this.initForm();
    this.loadDistricts();
    this.setupFormListeners();
    // Emit initial search after a small delay to ensure form is ready
    setTimeout(() => {
      this.emitSearchChange();
    }, 0);
  }

  /**
   * 初始化表單
   */
  private initForm(): void {
    this.searchForm = this.fb.group({
      search: [''],
      district: [''],
      dayOfWeek: [''],
      openAt: [''],
      sortBy: ['name'],
      sortDir: ['asc'],
    });
  }

  /**
   * 載入地區列表
   */
  private loadDistricts(): void {
    const lang = this.languageService.getCurrentLanguage();
    console.log('Loading districts with language:', lang);
    this.mobilePostOfficeService.getDistricts(lang).subscribe({
      next: (districts) => {
        console.log('Districts loaded:', districts);
        this.districts.set(districts);
      },
      error: (error) => {
        console.error('Failed to load districts:', error);
        console.error('Error details:', JSON.stringify(error));
      },
    });
  }

  /**
   * 設定表單監聽器
   */
  private setupFormListeners(): void {
    // 監聽搜尋文字變更 (使用 debounce 避免過多請求)
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        console.log('Search text changed');
        this.emitSearchChange();
      });

    // 監聽其他欄位變更 - use setTimeout to ensure form value is updated
    ['district', 'dayOfWeek', 'openAt', 'sortBy', 'sortDir'].forEach((field) => {
      this.searchForm.get(field)?.valueChanges.subscribe((value) => {
        console.log(`Field ${field} changed to:`, value);
        // Use setTimeout to ensure the form value is fully updated before emitting
        setTimeout(() => {
          this.emitSearchChange();
        }, 0);
      });
    });
  }

  /**
   * 發送搜尋條件變更事件
   */
  private emitSearchChange(): void {
    const formValue = this.searchForm.value;

    console.log('=== emitSearchChange called ===');
    console.log('Full form value:', formValue);
    console.log('District value:', formValue.district);
    console.log('District type:', typeof formValue.district);
    console.log('District is empty string?', formValue.district === '');
    console.log('District is truthy?', !!formValue.district);

    const queryParams: QueryParams = {
      search: formValue.search || undefined,
      district: formValue.district || undefined,
      dayOfWeek: formValue.dayOfWeek || undefined,
      openAt: formValue.openAt || undefined,
      sortBy: formValue.sortBy || 'name',
      sortDir: formValue.sortDir || 'asc',
      lang: this.languageService.getCurrentLanguage(),
    };
    console.log('Emitting search params:', queryParams);
    this.searchChange.emit(queryParams);
  }

  /**
   * 清除所有篩選條件
   */
  clearFilters(): void {
    this.searchForm.patchValue({
      search: '',
      district: '',
      dayOfWeek: '',
      openAt: '',
      sortBy: 'name',
      sortDir: 'asc',
    });
  }

  /**
   * 取得翻譯文字
   */
  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
