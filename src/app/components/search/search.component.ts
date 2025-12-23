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

  // Search form
  searchForm!: FormGroup;

  // District options
  districts = signal<string[]>([]);

  // Day of week options
  readonly daysOfWeek = DAYS_OF_WEEK;

  // Sort options
  readonly sortOptions = [
    { value: 'id', label: 'sort.id' },
    { value: 'seq', label: 'sort.seq' },
    { value: 'name', label: 'sort.name' },
    { value: 'district', label: 'sort.district' },
    { value: 'openHour', label: 'sort.openAt' },
    { value: 'closeHour', label: 'sort.closeAt' },
  ];

  // Output event: emitted when search criteria changes
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
   * Initialize form
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
   * Load district list
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
   * Setup form listeners
   */
  private setupFormListeners(): void {
    // Listen to search text changes (use debounce to avoid excessive requests)
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        console.log('Search text changed');
        this.emitSearchChange();
      });

    // Listen to other field changes - use setTimeout to ensure form value is updated
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
   * Emit search criteria change event
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
   * Clear all filter criteria
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
   * Get translated text
   */
  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
