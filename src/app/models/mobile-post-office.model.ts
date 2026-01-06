// Mobile post office record interface
export interface MobilePostOffice {
  id: number;
  mobileCode: string;
  seq: number;
  name: string;
  district: string;
  location: string;
  address: string;
  openHour: string; // Opening time (HH:MM format)
  closeHour: string; // Closing time (HH:MM format)
  dayOfWeekCode: number; // Day of week code (1-7)
  latitude?: string;
  longitude?: string;
  // Language-specific fields (when lang=all)
  nameEN?: string;
  nameTC?: string;
  nameSC?: string;
  districtEN?: string;
  districtTC?: string;
  districtSC?: string;
  locationEN?: string;
  locationTC?: string;
  locationSC?: string;
  addressEN?: string;
  addressTC?: string;
  addressSC?: string;
}

// API Response Header
export interface ApiHeader {
  success: boolean;
  message?: string;
  err_code?: string;
  err_msg?: string;
}

// API Response Meta (for paginated responses)
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  lang: string;
}

// API Response Envelope
export interface ApiResponse<T> {
  header: ApiHeader;
  meta?: ApiMeta;
  result: T;
}

// Legacy type alias for compatibility
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  district?: string;
  dayOfWeek?: number; // 1-7
  openAt?: string; // HH:MM format
  mobileCode?: string;
  seq?: number;
  sortBy?: 'id' | 'seq' | 'district' | 'openHour' | 'closeHour' | 'name';
  sortDir?: 'asc' | 'desc';
  lang?: 'en' | 'tc' | 'sc' | 'all';
}

// Form data for API submission
export interface MobilePostOfficeForm {
  mobileCode?: string;
  seq?: number;
  nameEN?: string;
  nameTC?: string;
  nameSC?: string;
  districtEN?: string;
  districtTC?: string;
  districtSC?: string;
  locationEN?: string;
  locationTC?: string;
  locationSC?: string;
  addressEN?: string;
  addressTC?: string;
  addressSC?: string;
  openHour: string;
  closeHour: string;
  dayOfWeekCode: number;
  latitude?: string;
  longitude?: string;
}

// API error response
export interface ApiError {
  err_code: string;
  err_msg: string;
}

// Language options
export type Language = 'en' | 'tc' | 'sc' | 'all';

// Day of week options (1=Monday, 7=Sunday)
export const DAYS_OF_WEEK = [
  { code: 1, name: 'Monday' },
  { code: 2, name: 'Tuesday' },
  { code: 3, name: 'Wednesday' },
  { code: 4, name: 'Thursday' },
  { code: 5, name: 'Friday' },
  { code: 6, name: 'Saturday' },
  { code: 7, name: 'Sunday' },
] as const;

export type DayOfWeekCode = 1 | 2 | 3 | 4 | 5 | 6 | 7;
