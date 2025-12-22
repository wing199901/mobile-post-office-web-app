import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private scriptLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  /**
   * Load Google Maps API dynamically
   */
  load(): Promise<void> {
    // If already loaded, return immediately
    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Create and load the script
    this.loadingPromise = new Promise<void>((resolve, reject) => {
      // Check if google maps is already loaded (e.g., from index.html)
      if (typeof google !== 'undefined' && google.maps) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        this.loadingPromise = null;
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

  /**
   * Check if Google Maps API is loaded
   */
  isLoaded(): boolean {
    return this.scriptLoaded;
  }
}
