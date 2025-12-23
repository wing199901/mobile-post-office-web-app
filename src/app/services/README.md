# Service Tests

## Test File
`mobile-post-office.service.spec.ts`

## Purpose
Test the service layer that handles all API communication for mobile post office data.

## Test Cases (19 tests)

### GET Operations (7 tests)
- ✅ Should return paginated list of records with default parameters
- ✅ Should handle lang=all and include all language-specific fields
- ✅ Should handle search and filter parameters correctly
- ✅ Should handle error response with err_code
- ✅ Should return a single record
- ✅ Should handle not found error (0201)
- ✅ Should include lang parameter when provided

### POST Operations (3 tests)
- ✅ Should create a new record and return id
- ✅ Should handle validation error (0101)
- ✅ Should handle invalid time format error (0104)

### PUT Operations (3 tests)
- ✅ Should perform partial update
- ✅ Should handle no updatable fields error (0102)
- ✅ Should handle not found error on update (0201)

### DELETE Operations (2 tests)
- ✅ Should delete a record
- ✅ Should handle not found error on delete (0201)

### Districts API (2 tests)
- ✅ Should return list of districts
- ✅ Should include lang parameter

### Error Handling (2 tests)
- ✅ Should handle network errors
- ✅ Should extract error from API envelope format

## API Endpoints Tested

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/mobileposts` | List all records with pagination |
| GET | `/api/mobileposts/:id` | Get single record by ID |
| POST | `/api/mobileposts` | Create new record |
| PUT | `/api/mobileposts/:id` | Update existing record |
| DELETE | `/api/mobileposts/:id` | Delete record |
| GET | `/api/mobileposts/districts/all` | Get list of districts |

## API Response Format

### Success Response
```typescript
{
  header: {
    success: true,
    message: 'Operation successful'
  },
  result: { /* data */ },
  meta: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5,
    lang: 'en'
  }
}
```

### Error Response
```typescript
{
  header: {
    success: false,
    err_code: '0201',
    err_msg: 'Record not found'
  },
  result: null
}
```

## Error Codes Tested

| Code | Description |
|------|-------------|
| 0101 | Validation error (missing required fields) |
| 0102 | No updatable fields provided |
| 0104 | Invalid time format |
| 0201 | Record not found |
| 0401 | Network/Server error |

## Running Tests

```bash
# Run only service tests
npm test -- src/app/services/mobile-post-office.service.spec.ts

# Run with coverage
npm test -- --coverage src/app/services/mobile-post-office.service.spec.ts
```

## Key Test Patterns

### Testing HTTP GET
```typescript
service.getAll().subscribe(result => {
  expect(result.data.length).toBe(1);
  expect(result.total).toBe(12);
});

const req = httpMock.expectOne((request) => 
  request.url.includes('/mobileposts')
);
expect(req.request.method).toBe('GET');
req.flush(mockResponse);
```

### Testing HTTP POST
```typescript
service.create(testData).subscribe(result => {
  expect(result).toBe(124);
});

const req = httpMock.expectOne(`${apiUrl}`);
expect(req.request.method).toBe('POST');
expect(req.request.body).toEqual(expectedPayload);
req.flush(mockResponse);
```

### Testing Error Handling
```typescript
service.delete(999).subscribe({
  next: () => expect.fail('should have failed'),
  error: (error: ApiError) => {
    expect(error.err_code).toBe('0201');
    expect(error.err_msg).toBe('record not found');
  }
});

const req = httpMock.expectOne(`${apiUrl}/999`);
req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
```

## Recent Fixes (2025-12-21)

### Fixed Issues
1. **Districts API endpoint** - Changed from `/districts` to `/districts/all`
2. **Districts response format** - Updated from `string[]` to `Array<{ district: string }>`
3. **Network error handling** - Removed duplicate HTTP expectations
4. **Delete method return** - Changed assertion from `undefined` to `null`

---

**Last Updated**: December 23, 2025
