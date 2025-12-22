# Mobile Post Office Web App - Test Documentation

## Status

✅ **All tests passing** (Last updated: 2025-12-21)
- **Test Files**: 3 passed
- **Total Tests**: 36 passed
- **Failures**: 0
- **Errors**: 0

## Test Overview

This document provides comprehensive information about the test suite for the Mobile Post Office Web Application.

## Test Framework

- **Framework**: Vitest (recommended by Angular 21)
- **Test Types**: Unit Tests, Component Tests, Service Tests
- **Coverage**: Components, Services, Models

## Test Structure

```
src/
├── app/
│   ├── app.spec.ts                                    # App root component tests
│   ├── components/
│   │   └── list/
│   │       └── list.component.spec.ts                 # List component tests
│   └── services/
│       └── mobile-post-office.service.spec.ts        # Service tests
```

## Test Files

### 1. App Component Tests (`app.spec.ts`)

**Purpose**: Test the root application component

**Test Cases**:
- ✅ Should create the app
- ✅ Should render router-outlet

**Coverage**: 
- App component initialization
- Router outlet rendering

---

### 2. List Component Tests (`list.component.spec.ts`)

**Purpose**: Test the list view component that displays paginated records

**Test Cases**:
- ✅ Should create component
- ✅ Should load records on initialization
- ✅ Should display records in table
- ✅ Should handle pagination changes
- ✅ Should navigate to detail page
- ✅ Should navigate to edit page
- ✅ Should handle search parameter changes
- ✅ Should handle service errors gracefully

**Mock Data**:
```typescript
{
  id: 1,
  name: 'Test Post Office 1',
  district: 'Yuen Long',
  location: 'Test Location',
  openHour: '09:00',
  closeHour: '17:00',
  dayOfWeekCode: 1,
  latitude: '22.36774',
  longitude: '114.06233'
}
```

**Dependencies Mocked**:
- MobilePostOfficeService
- LanguageService
- LoadingService
- Router

---

### 3. Mobile Post Office Service Tests (`mobile-post-office.service.spec.ts`)

**Purpose**: Test the service layer that handles API communication

**Test Cases**:

#### GET Operations
- ✅ Should return paginated list with default parameters
- ✅ Should return paginated list with custom query parameters
- ✅ Should handle HTTP errors gracefully
- ✅ Should get record by ID
- ✅ Should handle not found errors
- ✅ Should support multi-language requests (lang=all)

#### POST Operations
- ✅ Should create new record successfully
- ✅ Should handle validation errors
- ✅ Should transform form data correctly

#### PUT Operations
- ✅ Should update existing record
- ✅ Should handle update conflicts

#### DELETE Operations
- ✅ Should delete record successfully
- ✅ Should handle delete errors

#### Districts API
- ✅ Should get districts list
- ✅ Should handle districts errors

**API Endpoints Tested**:
- `GET /api/mobileposts` - List all records
- `GET /api/mobileposts/:id` - Get single record
- `POST /api/mobileposts` - Create record
- `PUT /api/mobileposts/:id` - Update record
- `DELETE /api/mobileposts/:id` - Delete record
- `GET /api/mobileposts/districts/all` - Get districts

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- src/app/app.spec.ts
```

---

## Test Configuration

### Key Dependencies
```json
{
  "@angular/core": "^21.0.0",
  "vitest": "latest",
  "@vitest/ui": "latest"
}
```

### Test Setup
- **HTTP Testing**: Uses `HttpClientTestingModule` for mocking HTTP requests
- **Router Testing**: Uses `RouterTestingModule` for navigation tests
- **Animations**: Uses `BrowserAnimationsModule` for component tests

---

## Test Patterns

### 1. Component Testing Pattern
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName, ...dependencies],
      providers: [mockProviders]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });
  
  it('should...', () => {
    // Test implementation
  });
});
```

### 2. Service Testing Pattern
```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceName]
    });
    service = TestBed.inject(ServiceName);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should...', () => {
    // Test implementation with HTTP mocking
  });
});
```

---

## Coverage Goals

| Area | Target Coverage |
|------|----------------|
| Services | 90%+ |
| Components | 80%+ |
| Models | 100% |
| Utilities | 90%+ |

---

## Missing Test Coverage

### Components Needing Tests
- ❌ `DetailComponent` - Detail view tests
- ❌ `EditComponent` - Form validation tests
- ❌ `SearchComponent` - Search/filter tests
- ❌ `HomeComponent` - Home component tests
- ❌ `ConfirmationDialogComponent` - Dialog tests

### Services Needing Tests
- ❌ `LanguageService` - Translation tests
- ❌ `LoadingService` - Loading state tests
- ❌ `GoogleMapsLoaderService` - Map loading tests

### Utilities Needing Tests
- ❌ `date-utils.ts` - Date formatting tests

---

## Best Practices

### 1. Isolation
- Each test should be independent
- Use mocks for external dependencies
- Reset state between tests

### 2. Clarity
- Use descriptive test names
- Follow "should..." naming convention
- Group related tests with `describe` blocks

### 3. Coverage
- Test happy paths and error cases
- Test edge cases and boundary conditions
- Verify error handling

### 4. Mock Data
- Keep mock data consistent
- Use realistic data structures
- Store complex mocks in separate files

### 5. Assertions
- Make specific assertions
- Test observable emissions
- Verify HTTP request parameters

---

## Common Issues & Solutions

### Issue: Tests fail with "NullInjectorError"
**Solution**: Ensure all required providers are included in TestBed configuration

### Issue: HTTP tests fail
**Solution**: Remember to call `httpMock.verify()` in `afterEach`

### Issue: Async tests timeout
**Solution**: Use `async/await` or `fakeAsync/tick` for async operations

### Issue: Component tests fail on render
**Solution**: Include `BrowserAnimationsModule` for Material components

---

## Continuous Integration

### GitHub Actions (Recommended)
```yaml
- name: Run tests
  run: npm test -- --run --coverage
```

### Coverage Reports
- Coverage reports are generated in `coverage/` directory
- Use `--coverage` flag to generate reports
- Integrate with Codecov or similar services for tracking

---

## Future Improvements

- [ ] Add E2E tests with Playwright or Cypress
- [ ] Increase component test coverage to 90%+
- [ ] Add visual regression tests
- [ ] Implement performance tests
- [ ] Add accessibility tests (a11y)
- [ ] Create test data factories for easier mock generation
- [ ] Add integration tests for critical user flows

---

## Recent Fixes (2025-12-21)

The following issues were identified and fixed:

### 1. getDistricts Tests
- **Issue**: Test expected `/districts` but actual API was `/districts/all`
- **Fix**: Updated test expectations to match actual API endpoint
- **Issue**: Test expected `string[]` but API returns `Array<{ district: string }>`
- **Fix**: Updated mock data structure and type expectations

### 2. Network Error Handling Test
- **Issue**: Duplicate HTTP expectations causing test failures
- **Fix**: Removed duplicate `expectOne` call, kept single error flush

### 3. Delete Method Test
- **Issue**: Expected `undefined` but service returns `null` from API
- **Fix**: Changed assertion from `toBeUndefined()` to `toBeNull()`

### 4. List Component Tests
- **Issue**: `languageChange$` observable missing in mock service
- **Fix**: Added `languageChange$: of('en')` to language service mock

All tests now passing successfully! ✅

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Testing Best Practices](https://angular.dev/guide/testing/best-practices)

---

**Last Updated**: December 21, 2025
**Maintained By**: Development Team
