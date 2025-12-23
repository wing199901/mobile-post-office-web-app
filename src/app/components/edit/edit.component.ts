import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DAYS_OF_WEEK } from '../../models/mobile-post-office.model';
import { MobilePostOfficeService } from '../../services/mobile-post-office.service';
import { LanguageService } from '../../services/language.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mobilePostOfficeService = inject(MobilePostOfficeService);
  private languageService = inject(LanguageService);
  protected loadingService = inject(LoadingService);
  private snackBar = inject(MatSnackBar);

  // Form
  editForm!: FormGroup;

  // Edit mode (true = edit, false = create)
  isEditMode = signal<boolean>(false);

  // Record ID (used in edit mode)
  recordId = signal<number | null>(null);

  // District options (multi-language)
  districtsEN = signal<string[]>([]);
  districtsTC = signal<string[]>([]);
  districtsSC = signal<string[]>([]);

  // Loading record flag (prevent triggering sync during load)
  private isLoadingRecord = false;

  // Day of week options
  readonly daysOfWeek = DAYS_OF_WEEK;

  ngOnInit(): void {
    this.initForm();
    this.loadAllDistricts();
    this.setupDistrictSync();

    // Check if in edit mode
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode.set(true);
        this.recordId.set(+id);
        this.loadRecord(+id);
      }
    });
  }

  /**
   * Initialize form
   */
  private initForm(): void {
    this.editForm = this.fb.group(
      {
        mobileCode: [''],
        seq: [null, [Validators.min(0)]],
        nameEN: [''],
        nameTC: [''],
        nameSC: [''],
        districtEN: ['', Validators.required],
        districtTC: ['', Validators.required],
        districtSC: ['', Validators.required],
        locationEN: [''],
        locationTC: [''],
        locationSC: [''],
        addressEN: [''],
        addressTC: [''],
        addressSC: [''],
        openHour: ['09:00', [Validators.required, this.timeFormatValidator]],
        closeHour: ['17:00', [Validators.required, this.timeFormatValidator]],
        dayOfWeekCode: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
        latitude: [null, [Validators.min(-90), Validators.max(90)]],
        longitude: [null, [Validators.min(-180), Validators.max(180)]],
      },
      {
        validators: [
          this.timeRangeValidator,
          this.atLeastOneNameValidator,
          this.atLeastOneLocationValidator,
          this.atLeastOneAddressValidator,
        ],
      }
    );
  }

  /**
   * 時間格式驗證器 (HH:MM format with valid time 00:00-23:59)
   */
  private timeFormatValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(control.value)) {
      return { timeFormat: true };
    }

    // Validate the time is in correct range
    const [hours, minutes] = control.value.split(':').map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return { timeFormat: true };
    }

    return null;
  }

  /**
   * Time range validator
   */
  private timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const openHour = group.get('openHour')?.value;
    const closeHour = group.get('closeHour')?.value;

    if (!openHour || !closeHour) return null;

    return closeHour > openHour ? null : { timeRange: true };
  }

  /**
   * At least one name field required (nameEN/nameTC/nameSC)
   */
  private atLeastOneNameValidator(group: AbstractControl): ValidationErrors | null {
    const nameEN = group.get('nameEN')?.value;
    const nameTC = group.get('nameTC')?.value;
    const nameSC = group.get('nameSC')?.value;

    if (!nameEN && !nameTC && !nameSC) {
      return { atLeastOneName: true };
    }
    return null;
  }

  /**
   * At least one district field required (districtEN/districtTC/districtSC)
   */
  private atLeastOneDistrictValidator(group: AbstractControl): ValidationErrors | null {
    const districtEN = group.get('districtEN')?.value;
    const districtTC = group.get('districtTC')?.value;
    const districtSC = group.get('districtSC')?.value;

    if (!districtEN && !districtTC && !districtSC) {
      return { atLeastOneDistrict: true };
    }
    return null;
  }

  /**
   * At least one location field required (locationEN/locationTC/locationSC)
   */
  private atLeastOneLocationValidator(group: AbstractControl): ValidationErrors | null {
    const locationEN = group.get('locationEN')?.value;
    const locationTC = group.get('locationTC')?.value;
    const locationSC = group.get('locationSC')?.value;

    if (!locationEN && !locationTC && !locationSC) {
      return { atLeastOneLocation: true };
    }
    return null;
  }

  /**
   * At least one address field required (addressEN/addressTC/addressSC)
   */
  private atLeastOneAddressValidator(group: AbstractControl): ValidationErrors | null {
    const addressEN = group.get('addressEN')?.value;
    const addressTC = group.get('addressTC')?.value;
    const addressSC = group.get('addressSC')?.value;

    if (!addressEN && !addressTC && !addressSC) {
      return { atLeastOneAddress: true };
    }
    return null;
  }

  /**
   * Setup district field synchronization
   */
  private setupDistrictSync(): void {
    // When districtEN changes, find and set corresponding TC and SC values
    this.editForm.get('districtEN')?.valueChanges.subscribe((enValue) => {
      if (enValue && !this.isLoadingRecord) {
        const enIndex = this.districtsEN().indexOf(enValue);
        if (enIndex !== -1) {
          const tcDistricts = this.districtsTC();
          const scDistricts = this.districtsSC();

          if (tcDistricts[enIndex]) {
            this.editForm.get('districtTC')?.setValue(tcDistricts[enIndex], { emitEvent: false });
          }
          if (scDistricts[enIndex]) {
            this.editForm.get('districtSC')?.setValue(scDistricts[enIndex], { emitEvent: false });
          }
        }
      }
    });

    // When districtTC changes, find and set corresponding EN and SC values
    this.editForm.get('districtTC')?.valueChanges.subscribe((tcValue) => {
      if (tcValue && !this.isLoadingRecord) {
        const tcIndex = this.districtsTC().indexOf(tcValue);
        if (tcIndex !== -1) {
          const enDistricts = this.districtsEN();
          const scDistricts = this.districtsSC();

          if (enDistricts[tcIndex]) {
            this.editForm.get('districtEN')?.setValue(enDistricts[tcIndex], { emitEvent: false });
          }
          if (scDistricts[tcIndex]) {
            this.editForm.get('districtSC')?.setValue(scDistricts[tcIndex], { emitEvent: false });
          }
        }
      }
    });

    // When districtSC changes, find and set corresponding EN and TC values
    this.editForm.get('districtSC')?.valueChanges.subscribe((scValue) => {
      if (scValue && !this.isLoadingRecord) {
        const scIndex = this.districtsSC().indexOf(scValue);
        if (scIndex !== -1) {
          const enDistricts = this.districtsEN();
          const tcDistricts = this.districtsTC();

          if (enDistricts[scIndex]) {
            this.editForm.get('districtEN')?.setValue(enDistricts[scIndex], { emitEvent: false });
          }
          if (tcDistricts[scIndex]) {
            this.editForm.get('districtTC')?.setValue(tcDistricts[scIndex], { emitEvent: false });
          }
        }
      }
    });
  }

  /**
   * 載入所有語言的地區列表
   */
  private loadAllDistricts(): void {
    // Load English districts
    this.mobilePostOfficeService.getDistricts('en').subscribe({
      next: (districts) => {
        console.log('Edit component - EN districts loaded:', districts);
        this.districtsEN.set(districts);
      },
      error: (error) => {
        console.error('Edit component - Failed to load EN districts:', error);
      },
    });

    // Load Traditional Chinese districts
    this.mobilePostOfficeService.getDistricts('tc').subscribe({
      next: (districts) => {
        console.log('Edit component - TC districts loaded:', districts);
        this.districtsTC.set(districts);
      },
      error: (error) => {
        console.error('Edit component - Failed to load TC districts:', error);
      },
    });

    // Load Simplified Chinese districts
    this.mobilePostOfficeService.getDistricts('sc').subscribe({
      next: (districts) => {
        console.log('Edit component - SC districts loaded:', districts);
        this.districtsSC.set(districts);
      },
      error: (error) => {
        console.error('Edit component - Failed to load SC districts:', error);
      },
    });
  }

  /**
   * 載入記錄 (編輯模式)
   */
  private loadRecord(id: number): void {
    this.isLoadingRecord = true;
    this.loadingService.show();

    // Use lang=all to get all language fields
    this.mobilePostOfficeService.getById(id, 'all').subscribe({
      next: (record) => {
        this.editForm.patchValue({
          mobileCode: record.mobileCode || '',
          seq: record.seq || null,
          nameEN: record.nameEN || record.name || '',
          nameTC: record.nameTC || '',
          nameSC: record.nameSC || '',
          districtEN: record.districtEN || record.district || '',
          districtTC: record.districtTC || '',
          districtSC: record.districtSC || '',
          locationEN: record.locationEN || record.location || '',
          locationTC: record.locationTC || '',
          locationSC: record.locationSC || '',
          addressEN: record.addressEN || record.address || '',
          addressTC: record.addressTC || '',
          addressSC: record.addressSC || '',
          openHour: record.openHour,
          closeHour: record.closeHour,
          dayOfWeekCode: record.dayOfWeekCode,
          latitude: record.latitude ? parseFloat(record.latitude) : null,
          longitude: record.longitude ? parseFloat(record.longitude) : null,
        });
        this.loadingService.hide();
        this.isLoadingRecord = false;
      },
      error: (error) => {
        console.error('Failed to load record:', error);
        this.snackBar.open('Failed to load record', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
        this.loadingService.hide();
        this.isLoadingRecord = false;
        this.router.navigate(['/']);
      },
    });
  }

  /**
   * 提交表單
   */
  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.loadingService.show();
    const formData = this.editForm.value;

    console.log('=== Form Submission ===');
    console.log('Form Data:', formData);
    console.log('Is Edit Mode:', this.isEditMode());

    if (this.isEditMode() && this.recordId()) {
      // Update record
      this.mobilePostOfficeService.update(this.recordId()!, formData).subscribe({
        next: (record) => {
          this.loadingService.hide();
          this.snackBar.open(this.translate('message.updateSuccess'), 'OK', {
            duration: 3000,
          });
          this.router.navigate(['/detail', record.id]);
        },
        error: (error) => {
          this.loadingService.hide();
          this.snackBar.open(error.message || this.translate('message.error'), 'OK', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      // Create record
      this.mobilePostOfficeService.create(formData).subscribe({
        next: (record) => {
          this.loadingService.hide();
          this.snackBar.open(this.translate('message.createSuccess'), 'OK', {
            duration: 3000,
          });
          this.router.navigate(['/detail', record.id]);
        },
        error: (error) => {
          this.loadingService.hide();
          this.snackBar.open(error.message || this.translate('message.error'), 'OK', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }

  /**
   * Cancel editing
   */
  onCancel(): void {
    if (this.isEditMode() && this.recordId()) {
      this.router.navigate(['/detail', this.recordId()]);
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Get field error message
   */
  getErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return this.translate('form.required');
    }
    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    }
    if (field.errors['timeFormat']) {
      return 'Time must be in HH:MM format (00:00-23:59)';
    }
    if (field.errors['min']) {
      const min = field.errors['min'].min;
      if (fieldName === 'latitude') return 'Latitude must be at least -90';
      if (fieldName === 'longitude') return 'Longitude must be at least -180';
      if (fieldName === 'seq') return 'Sequence must be at least 0';
      if (fieldName === 'dayOfWeekCode') return 'Day of week must be between 1-7';
      return `Minimum value is ${min}`;
    }
    if (field.errors['max']) {
      const max = field.errors['max'].max;
      if (fieldName === 'latitude') return 'Latitude must not be greater than 90';
      if (fieldName === 'longitude') return 'Longitude must not be greater than 180';
      if (fieldName === 'dayOfWeekCode') return 'Day of week must be between 1-7';
      return `Maximum value is ${max}`;
    }

    return '';
  }

  /**
   * Get form level error message
   */
  getFormErrorMessage(): string {
    if (this.editForm.errors?.['timeRange']) {
      return this.translate('form.timeRange');
    }
    if (this.editForm.errors?.['atLeastOneName']) {
      return 'At least one name field (EN/TC/SC) is required';
    }
    if (this.editForm.errors?.['atLeastOneDistrict']) {
      return 'At least one district field (EN/TC/SC) is required';
    }
    if (this.editForm.errors?.['atLeastOneLocation']) {
      return 'At least one location field (EN/TC/SC) is required';
    }
    if (this.editForm.errors?.['atLeastOneAddress']) {
      return 'At least one address field (EN/TC/SC) is required';
    }
    return '';
  }

  /**
   * Get translated text
   */
  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
