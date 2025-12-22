import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MobilePostOffice } from '../../models/mobile-post-office.model';
import { MobilePostOfficeService } from '../../services/mobile-post-office.service';
import { LanguageService } from '../../services/language.service';
import { LoadingService } from '../../services/loading.service';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { dayOfWeekCodeToName } from '../../utils/date-utils';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    GoogleMapsModule,
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mobilePostOfficeService = inject(MobilePostOfficeService);
  private languageService = inject(LanguageService);
  protected loadingService = inject(LoadingService);
  private googleMapsLoader = inject(GoogleMapsLoaderService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // 記錄資料
  record = signal<MobilePostOffice | null>(null);

  // 錯誤訊息
  errorMessage = signal<string>('');

  // Store current record ID
  private currentRecordId: number | null = null;

  // Show all language data flag
  showAllLang = signal<boolean>(false);

  // Google Maps loaded status
  mapsLoaded = signal<boolean>(false);

  // Map options and marker position
  mapOptions: google.maps.MapOptions = {};
  mapCenter: google.maps.LatLngLiteral = { lat: 22.28, lng: 114.17 };
  markerPosition: google.maps.LatLngLiteral = { lat: 22.28, lng: 114.17 };

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  ngOnInit(): void {
    // Load Google Maps API dynamically
    this.googleMapsLoader.load().then(() => {
      // Wait a bit to ensure google.maps is fully loaded
      setTimeout(() => {
        if (typeof google !== 'undefined' && google.maps) {
          this.mapOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          };
          this.mapsLoaded.set(true);
        }
      }, 100);
    }).catch(error => {
      console.error('Failed to load Google Maps:', error);
      this.mapsLoaded.set(false);
    });

    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.currentRecordId = id;
        this.loadRecord(id);
      }
    });

    // Subscribe to language change event to reload data
    this.languageService.languageChange$.subscribe(() => {
      console.log('Detail page - Language changed, reloading data');
      if (this.currentRecordId) {
        this.loadRecord(this.currentRecordId);
      }
    });
  }

  /**
   * 載入記錄詳情
   */
  private loadRecord(id: number): void {
    this.loadingService.show();
    const lang = this.showAllLang() ? 'all' : this.languageService.getCurrentLanguage();

    console.log('Detail page - Loading record:', id, 'with language:', lang);

    this.mobilePostOfficeService.getById(id, lang).subscribe({
      next: (record) => {
        console.log('Detail page - Record loaded:', record);
        this.record.set(record);
        this.errorMessage.set('');

        // Update map position if coordinates exist
        if (record.latitude && record.longitude) {
          const lat =
            typeof record.latitude === 'string' ? parseFloat(record.latitude) : record.latitude;
          const lng =
            typeof record.longitude === 'string' ? parseFloat(record.longitude) : record.longitude;
          this.mapCenter = { lat, lng };
          this.markerPosition = { lat, lng };
        }

        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Detail page - Failed to load record:', error);
        this.errorMessage.set(error.message || this.translate('message.error'));
        this.loadingService.hide();
      },
    });
  }

  /**
   * 返回列表頁
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * 編輯記錄
   */
  editRecord(): void {
    const id = this.record()?.id;
    if (id) {
      this.router.navigate(['/edit', id]);
    }
  }

  /**
   * 刪除記錄
   */
  deleteRecord(): void {
    const record = this.record();
    if (!record) return;

    // 開啟確認對話框
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate('confirm.delete'),
        message: `${record.name} - ${record.district}`,
        confirmText: this.translate('confirm.yes'),
        cancelText: this.translate('confirm.no'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.performDelete(record.id);
      }
    });
  }

  /**
   * 執行刪除
   */
  private performDelete(id: number): void {
    this.loadingService.show();

    this.mobilePostOfficeService.delete(id).subscribe({
      next: () => {
        this.loadingService.hide();
        this.snackBar.open(this.translate('message.deleteSuccess'), 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loadingService.hide();
        this.snackBar.open(error.message || this.translate('message.error'), 'OK', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * 取得翻譯文字
   */
  translate(key: string): string {
    return this.languageService.translate(key);
  }

  /**
   * 轉換 dayOfWeekCode 為星期名稱
   */
  getDayName(code: number): string {
    return dayOfWeekCodeToName(code, (key: string) => this.translate(key));
  }

  /**
   * Toggle show all language data
   */
  toggleShowAllLang(checked: boolean): void {
    this.showAllLang.set(checked);
    console.log('Detail page - Show all lang toggled:', checked);
    if (this.currentRecordId) {
      this.loadRecord(this.currentRecordId);
    }
  }

  /**
   * Open info window on marker
   */
  openInfoWindow(marker: MapMarker): void {
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }
}
