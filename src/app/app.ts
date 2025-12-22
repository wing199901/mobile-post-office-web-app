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
   * 切換語言
   */
  changeLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }

  /**
   * 導航到首頁
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * 導航到新增頁面
   */
  goCreate(): void {
    this.router.navigate(['/create']);
  }

  /**
   * 取得翻譯文字
   */
  translate(key: string): string {
    return this.languageService.translate(key);
  }

  /**
   * 取得當前語言
   */
  getCurrentLanguage(): Language {
    return this.languageService.getCurrentLanguage();
  }

  /**
   * 取得可用語言
   */
  getAvailableLanguages() {
    return this.languageService.availableLanguages;
  }
}
