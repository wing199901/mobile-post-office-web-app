import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  // Loading state
  private loading = signal<boolean>(false);

  // Loading counter (supports multiple concurrent requests)
  private loadingCount = 0;

  /**
   * Get loading state
   */
  isLoading() {
    return this.loading();
  }

  /**
   * Show loading indicator
   */
  show(): void {
    this.loadingCount++;
    this.loading.set(true);
  }

  /**
   * Hide loading indicator
   */
  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loading.set(false);
    }
  }

  /**
   * Reset loading state
   */
  reset(): void {
    this.loadingCount = 0;
    this.loading.set(false);
  }
}
