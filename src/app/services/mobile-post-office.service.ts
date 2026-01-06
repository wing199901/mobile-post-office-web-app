import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  MobilePostOffice,
  PaginatedResponse,
  QueryParams,
  MobilePostOfficeForm,
  ApiError,
  ApiResponse,
} from '../models/mobile-post-office.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MobilePostOfficeService {
  private http = inject(HttpClient);

  // API endpoint matching spec
  private readonly apiUrl = `${environment.apiUrl}/api/mobileposts`;

  /**
   * Get all mobile post office records with optional query parameters
   */
  getAll(queryParams: QueryParams = {}): Observable<PaginatedResponse<MobilePostOffice>> {
    let params = new HttpParams();

    // Build query parameters - using API spec parameter names
    if (queryParams.page) {
      params = params.set('page', queryParams.page.toString());
    }
    if (queryParams.limit) {
      params = params.set('limit', queryParams.limit.toString());
    }
    if (queryParams.search) {
      params = params.set('search', queryParams.search);
    }
    if (queryParams.district) {
      params = params.set('district', queryParams.district);
    }
    if (queryParams.dayOfWeek) {
      params = params.set('dayOfWeek', queryParams.dayOfWeek.toString());
    }
    if (queryParams.openAt) {
      params = params.set('openAt', queryParams.openAt);
    }
    if (queryParams.mobileCode) {
      params = params.set('mobileCode', queryParams.mobileCode);
    }
    if (queryParams.seq) {
      params = params.set('seq', queryParams.seq.toString());
    }
    if (queryParams.sortBy) {
      params = params.set('sortBy', queryParams.sortBy);
    }
    if (queryParams.sortDir) {
      params = params.set('sortDir', queryParams.sortDir);
    }
    if (queryParams.lang) {
      params = params.set('lang', queryParams.lang);
    }

    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('=== API CALL: getAll ===');
    console.log('URL:', url);
    console.log('Query Params:', queryParams);
    console.log('HTTP Params:', params.toString());

    return this.http.get<ApiResponse<MobilePostOffice[]>>(this.apiUrl, { params }).pipe(
      map((response) => {
        console.log('=== API RESPONSE: getAll ===');
        console.log('Response:', response);

        // Check if request was successful
        if (!response.header.success) {
          console.error('API Error:', response.header);
          throw new Error(response.header.err_msg || 'Request failed');
        }

        // Transform API envelope to legacy format for compatibility
        const result = {
          data: response.result,
          total: response.meta?.total || 0,
          page: response.meta?.page || 1,
          pageSize: response.meta?.limit || 20,
          totalPages: response.meta?.totalPages || 0,
        };
        console.log('Transformed Result:', result);
        return result;
      }),
      catchError((error) => {
        console.error('=== API ERROR: getAll ===');
        console.error('Error:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * 依 ID 取得單一移動郵局記錄
   */
  getById(id: number, lang?: string): Observable<MobilePostOffice> {
    let params = new HttpParams();
    if (lang) {
      params = params.set('lang', lang);
    }

    const url = `${this.apiUrl}/${id}?${params.toString()}`;
    console.log('=== API CALL: getById ===');
    console.log('URL:', url);
    console.log('ID:', id, 'Lang:', lang);

    return this.http.get<ApiResponse<MobilePostOffice>>(`${this.apiUrl}/${id}`, { params }).pipe(
      map((response) => {
        console.log('=== API RESPONSE: getById ===');
        console.log('Response:', response);

        if (!response.header.success) {
          console.error('API Error:', response.header);
          throw new Error(response.header.err_msg || 'Request failed');
        }
        return response.result;
      }),
      catchError((error) => {
        console.error('=== API ERROR: getById ===');
        console.error('Error:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * 新增移動郵局記錄
   */
  create(data: MobilePostOfficeForm): Observable<{ id: number }> {
    console.log('=== API CALL: create ===');
    console.log('URL:', this.apiUrl);
    console.log('Data:', data);

    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, data).pipe(
      map((response) => {
        console.log('=== API RESPONSE: create ===');
        console.log('Response:', response);

        if (!response.header.success) {
          console.error('API Error:', response.header);
          throw new Error(response.header.err_msg || 'Request failed');
        }
        return response.result;
      }),
      catchError((error) => {
        console.error('=== API ERROR: create ===');
        console.error('Error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error response:', error.error);
        return this.handleError(error);
      })
    );
  }

  /**
   * 更新移動郵局記錄
   */
  update(id: number, data: Partial<MobilePostOfficeForm>): Observable<{ id: number }> {
    const url = `${this.apiUrl}/${id}`;
    console.log('=== API CALL: update ===');
    console.log('URL:', url);
    console.log('ID:', id);
    console.log('Data:', data);

    return this.http.put<ApiResponse<{ id: number }>>(url, data).pipe(
      map((response) => {
        console.log('=== API RESPONSE: update ===');
        console.log('Response:', response);

        if (!response.header.success) {
          console.error('API Error:', response.header);
          throw new Error(response.header.err_msg || 'Request failed');
        }
        return response.result;
      }),
      catchError((error) => {
        console.error('=== API ERROR: update ===');
        console.error('Error:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * 刪除移動郵局記錄
   */
  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('=== API CALL: delete ===');
    console.log('URL:', url);
    console.log('ID:', id);

    return this.http.delete<ApiResponse<void>>(url).pipe(
      map((response) => {
        console.log('=== API RESPONSE: delete ===');
        console.log('Response:', response);

        if (!response.header.success) {
          console.error('API Error:', response.header);
          throw new Error(response.header.err_msg || 'Request failed');
        }
        return response.result;
      }),
      catchError((error) => {
        console.error('=== API ERROR: delete ===');
        console.error('Error:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get all districts list (for filtering)
   * Use: /api/mobileposts/districts/all?lang={lang}
   */
  getDistricts(lang?: string): Observable<string[]> {
    let params = new HttpParams();
    if (lang) {
      params = params.set('lang', lang);
    }

    const url = `${this.apiUrl}/districts/all`;
    console.log('Fetching districts from:', url, 'with lang:', lang);

    return this.http.get<ApiResponse<Array<{ district: string }>>>(url, { params }).pipe(
      map((response) => {
        console.log('Districts API response:', response);
        if (!response.header.success) {
          throw new Error(response.header.err_msg || 'Request failed');
        }
        // Extract district strings from array of objects
        const districts = response.result.map((item) => item.district);
        console.log('Extracted districts:', districts);
        return districts;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 錯誤處理 - handles new API error format
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let apiError: ApiError;

    if (error.error instanceof ErrorEvent) {
      // Client or network error
      apiError = {
        err_code: '0000',
        err_msg: `Error: ${error.error.message}`,
      };
    } else {
      // Backend error - extract from API envelope
      if (error.error?.header) {
        apiError = {
          err_code: error.error.header.err_code || '0401',
          err_msg: error.error.header.err_msg || 'Unknown server error',
        };
      } else {
        apiError = {
          err_code: '0401',
          err_msg: error.message || 'Unknown server error',
        };
      }
    }

    return throwError(() => apiError);
  }
}
