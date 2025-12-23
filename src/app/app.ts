import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LanguageService } from './services/language.service';
import { LoadingService } from './services/loading.service';
import { Language } from './models/mobile-post-office.model';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  protected languageService = inject(LanguageService);
  protected loadingService = inject(LoadingService);

  protected readonly title = signal('mobile-post-office-web-app');

  /**
   * Change language
   */
  changeLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }

  /**
   * Navigate to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigate to create page
   */
  goCreate(): void {
    this.router.navigate(['/create']);
  }

  /**
   * Get translated text
   */
  translate(key: string): string {
    return this.languageService.translate(key);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.languageService.getCurrentLanguage();
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return this.languageService.availableLanguages;
  }
}
