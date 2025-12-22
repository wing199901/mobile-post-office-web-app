import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  // 載入狀態
  private loading = signal<boolean>(false);

  // 載入計數器 (支援多個並行請求)
  private loadingCount = 0;

  /**
   * 取得載入狀態
   */
  isLoading() {
    return this.loading();
  }

  /**
   * 顯示載入指示器
   */
  show(): void {
    this.loadingCount++;
    this.loading.set(true);
  }

  /**
   * 隱藏載入指示器
   */
  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loading.set(false);
    }
  }

  /**
   * 重設載入狀態
   */
  reset(): void {
    this.loadingCount = 0;
    this.loading.set(false);
  }
}
