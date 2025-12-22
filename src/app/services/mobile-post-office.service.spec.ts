import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MobilePostOfficeService } from './mobile-post-office.service';
import {
  ApiResponse,
  MobilePostOffice,
  MobilePostOfficeForm,
  ApiError,
} from '../models/mobile-post-office.model';
import { environment } from '../../environments/environment';

describe('MobilePostOfficeService', () => {
  let service: MobilePostOfficeService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/mobileposts`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MobilePostOfficeService],
    });
    service = TestBed.inject(MobilePostOfficeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    it('should return paginated list of records with default parameters', () => {
      const mockResponse: ApiResponse<MobilePostOffice[]> = {
        header: { success: true, message: '12 records retrieved' },
        meta: { page: 1, limit: 20, total: 12, totalPages: 1, lang: 'en' },
        result: [
          {
            id: 123,
            mobileCode: '1',
            seq: 7,
            name: 'Mobile Post Offices 1',
            district: 'Yuen Long',
            location: 'Sham Tseng',
            address: 'Close to Rhine Garden, Castle Peak Road',
            openHour: '09:00',
            closeHour: '09:30',
            dayOfWeekCode: 1,
            latitude: '22.36774',
            longitude: '114.06233',
          },
        ],
      };

      service.getAll().subscribe((response) => {
        expect(response.data.length).toBe(1);
        expect(response.total).toBe(12);
        expect(response.page).toBe(1);
        expect(response.pageSize).toBe(20);
        expect(response.data[0].name).toBe('Mobile Post Offices 1');
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle lang=all and include all language-specific fields', () => {
      const mockResponse: ApiResponse<MobilePostOffice[]> = {
        header: { success: true, message: '1 record retrieved' },
        meta: { page: 1, limit: 10, total: 1, totalPages: 1, lang: 'all' },
        result: [
          {
            id: 123,
            mobileCode: '1',
            seq: 7,
            name: 'Mobile Post Offices 1',
            nameEN: 'Mobile Post Offices 1',
            nameTC: '流動郵政局 1',
            nameSC: '流动郵政局 1',
            district: 'Yuen Long',
            districtEN: 'Yuen Long',
            districtTC: '元朗區',
            districtSC: '元朗区',
            location: 'Sham Tseng',
            locationEN: 'Sham Tseng',
            locationTC: '深井',
            locationSC: '深井',
            address: 'Close to Rhine Garden',
            addressEN: 'Close to Rhine Garden',
            addressTC: '青山公路深井段',
            addressSC: '青山公路深井段',
            openHour: '09:00',
            closeHour: '09:30',
            dayOfWeekCode: 1,
            latitude: '22.36774',
            longitude: '114.06233',
          },
        ],
      };

      service.getAll({ lang: 'all' }).subscribe((response) => {
        expect(response.data[0].nameEN).toBe('Mobile Post Offices 1');
        expect(response.data[0].nameTC).toBe('流動郵政局 1');
        expect(response.data[0].nameSC).toBe('流动郵政局 1');
      });

      const req = httpMock.expectOne(`${apiUrl}?lang=all`);
      req.flush(mockResponse);
    });

    it('should handle search and filter parameters correctly', () => {
      const mockResponse: ApiResponse<MobilePostOffice[]> = {
        header: { success: true, message: '2 records retrieved' },
        meta: { page: 1, limit: 10, total: 2, totalPages: 1, lang: 'en' },
        result: [],
      };

      const queryParams = {
        search: 'post office',
        district: 'Yuen Long',
        dayOfWeek: 1,
        openAt: '09:00',
        page: 2,
        limit: 10,
        sortBy: 'name' as const,
        sortDir: 'asc' as const,
        lang: 'tc' as const,
      };

      service.getAll(queryParams).subscribe();

      const req = httpMock.expectOne(
        `${apiUrl}?page=2&limit=10&search=post%20office&district=Yuen%20Long&dayOfWeek=1&openAt=09:00&sortBy=name&sortDir=asc&lang=tc`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error response with err_code', () => {
      const errorResponse = {
        header: {
          success: false,
          err_code: '0105',
          err_msg: 'Invalid lang value',
        },
        result: null,
      };

      service.getAll({ lang: 'invalid' as any }).subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0105');
          expect(error.err_msg).toBe('Invalid lang value');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}?lang=invalid`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getById', () => {
    it('should return a single record', () => {
      const mockResponse: ApiResponse<MobilePostOffice> = {
        header: { success: true, message: 'record found' },
        result: {
          id: 123,
          mobileCode: '1',
          seq: 7,
          name: 'Mobile Post Offices 1',
          district: 'Yuen Long',
          location: 'Sham Tseng',
          address: 'Close to Rhine Garden',
          openHour: '09:00',
          closeHour: '09:30',
          dayOfWeekCode: 1,
          latitude: '22.36774',
          longitude: '114.06233',
        },
      };

      service.getById(123).subscribe((record) => {
        expect(record.id).toBe(123);
        expect(record.name).toBe('Mobile Post Offices 1');
      });

      const req = httpMock.expectOne(`${apiUrl}/123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle not found error (0201)', () => {
      const errorResponse = {
        header: {
          success: false,
          err_code: '0201',
          err_msg: 'record not found for id 999',
        },
        result: null,
      };

      service.getById(999).subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0201');
          expect(error.err_msg).toContain('not found');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
    });

    it('should include lang parameter when provided', () => {
      const mockResponse: ApiResponse<MobilePostOffice> = {
        header: { success: true, message: 'record found' },
        result: {
          id: 123,
          name: '流動郵政局 1',
          district: '元朗區',
          location: '深井',
          address: '青山公路深井段',
          openHour: '09:00',
          closeHour: '09:30',
          dayOfWeekCode: 1,
        },
      };

      service.getById(123, 'tc').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/123?lang=tc`);
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new record and return id', () => {
      const formData: MobilePostOfficeForm = {
        mobileCode: '2',
        seq: 124,
        nameEN: 'Mobile Post Offices 2',
        nameTC: '流動郵政局 2',
        nameSC: '流动郵政局 2',
        districtEN: 'Tuen Mun',
        districtTC: '屯門區',
        districtSC: '屯门区',
        locationEN: 'Gold Coast',
        addressEN: 'Outside Gold Coast Piazza',
        openHour: '09:50',
        closeHour: '10:05',
        dayOfWeekCode: 1,
        latitude: '22.37184',
        longitude: '113.99305',
      };

      const mockResponse: ApiResponse<{ id: number }> = {
        header: { success: true, message: 'created' },
        result: { id: 124 },
      };

      service.create(formData).subscribe((result) => {
        expect(result.id).toBe(124);
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);
      req.flush(mockResponse);
    });

    it('should handle validation error (0101)', () => {
      const invalidData: MobilePostOfficeForm = {
        openHour: '09:00',
        closeHour: '10:00',
        dayOfWeekCode: 1,
      };

      const errorResponse = {
        header: {
          success: false,
          err_code: '0101',
          err_msg: 'missing required field: nameEN or nameTC or nameSC',
        },
        result: null,
      };

      service.create(invalidData).subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0101');
          expect(error.err_msg).toContain('missing required field');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle invalid time format error (0104)', () => {
      const invalidData: MobilePostOfficeForm = {
        nameEN: 'Test',
        districtEN: 'Test',
        openHour: '25:00', // Invalid hour
        closeHour: '10:00',
        dayOfWeekCode: 1,
      };

      const errorResponse = {
        header: {
          success: false,
          err_code: '0104',
          err_msg: 'Invalid time format (expect HH:MM)',
        },
        result: null,
      };

      service.create(invalidData).subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0104');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('should perform partial update', () => {
      const updateData: Partial<MobilePostOfficeForm> = {
        openHour: '10:00',
        nameSC: '流动郵政局 2',
      };

      const mockResponse: ApiResponse<{ id: number }> = {
        header: { success: true, message: 'updated' },
        result: { id: 124 },
      };

      service.update(124, updateData).subscribe((result) => {
        expect(result.id).toBe(124);
      });

      const req = httpMock.expectOne(`${apiUrl}/124`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });

    it('should handle no updatable fields error (0102)', () => {
      const errorResponse = {
        header: {
          success: false,
          err_code: '0102',
          err_msg: 'No updatable fields provided in PUT',
        },
        result: null,
      };

      service.update(124, {}).subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0102');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/124`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle not found error on update (0201)', () => {
      const errorResponse = {
        header: {
          success: false,
          err_code: '0201',
          err_msg: 'record not found',
        },
        result: null,
      };

      service.update(999, { openHour: '10:00' }).subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0201');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete', () => {
    it('should delete a record', () => {
      const mockResponse: ApiResponse<null> = {
        header: { success: true, message: 'deleted' },
        result: null,
      };

      service.delete(124).subscribe((result) => {
        expect(result).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/124`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle not found error on delete (0201)', () => {
      const errorResponse = {
        header: {
          success: false,
          err_code: '0201',
          err_msg: 'record not found',
        },
        result: null,
      };

      service.delete(999).subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0201');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getDistricts', () => {
    it('should return list of districts', () => {
      const mockResponse: ApiResponse<Array<{ district: string }>> = {
        header: { success: true, message: 'districts retrieved' },
        result: [
          { district: 'Yuen Long' },
          { district: 'Tuen Mun' },
          { district: 'Tsuen Wan' },
        ],
      };

      service.getDistricts().subscribe((districts) => {
        expect(districts.length).toBe(3);
        expect(districts).toContain('Yuen Long');
      });

      const req = httpMock.expectOne(`${apiUrl}/districts/all`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include lang parameter', () => {
      const mockResponse: ApiResponse<Array<{ district: string }>> = {
        header: { success: true, message: 'districts retrieved' },
        result: [
          { district: '元朗區' },
          { district: '屯門區' },
          { district: '荃灣區' },
        ],
      };

      service.getDistricts('tc').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/districts/all?lang=tc`);
      req.flush(mockResponse);
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', () => {
      service.getAll().subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0401');
          expect(error.err_msg).toContain('Http failure response');
        },
      });

      const req = httpMock.expectOne((request) => request.url.includes('/mobileposts'));
      req.flush(
        { message: 'Network error' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });

    it('should extract error from API envelope format', () => {
      const errorResponse = {
        header: {
          success: false,
          err_code: '0106',
          err_msg: 'Invalid numeric value',
        },
        result: null,
      };

      service.getAll().subscribe({
        next: () => expect.fail('should have failed'),
        error: (error: ApiError) => {
          expect(error.err_code).toBe('0106');
          expect(error.err_msg).toBe('Invalid numeric value');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });
});
