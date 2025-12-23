# List Component Tests

## Test File
`list.component.spec.ts`

## Purpose
Test the list view component that displays paginated mobile post office records.

## Test Cases (15 tests)

### Component Initialization
- ✅ Should create component
- ✅ Should display correct number of columns

### Data Loading
- ✅ Should load records on initialization
- ✅ Should handle empty results
- ✅ Should reload records when search params change

### Pagination
- ✅ Should handle pagination changes
- ✅ Should respect page size options

### Navigation
- ✅ Should navigate to detail page on view
- ✅ Should navigate to edit page

### Error Handling
- ✅ Should handle service errors gracefully

### Search & Filtering
- ✅ Should update records when onSearchChange is called

### Language Support
- ✅ Should handle language changes
- ✅ Should convert dayOfWeekCode to day name

### Data Formatting
- ✅ Should format time fields correctly
- ✅ Should display dayOfWeekCode as number 1-7

## Mock Data Structure

```typescript
{
  id: 1,
  mobileCode: '1',
  seq: 1,
  name: 'Test Post Office 1',
  district: 'Yuen Long',
  location: 'Test Location',
  address: 'Test Address',
  openHour: '09:00',
  closeHour: '17:00',
  dayOfWeekCode: 1,
  latitude: '22.36774',
  longitude: '114.06233'
}
```

## Dependencies Mocked
- MobilePostOfficeService
- LanguageService (with `languageChange$` observable)
- LoadingService
- Router

## Running Tests

```bash
# Run only list component tests
npm test -- src/app/components/list/list.component.spec.ts

# Run with watch mode
npm test -- --watch src/app/components/list/list.component.spec.ts
```

## Key Test Patterns

### Testing Data Loading
```typescript
mockService.getAll.mockReturnValue(of(mockPaginatedResponse));
component.loadRecords();
expect(component.records()).toEqual(mockRecords);
```

### Testing Navigation
```typescript
component.viewRecord(1);
expect(router.navigate).toHaveBeenCalledWith(['/detail', 1]);
```

### Testing Search Changes
```typescript
component.onSearchChange({ search: 'test', lang: 'en' });
expect(component.records().length).toBeGreaterThan(0);
```

---

**Last Updated**: December 23, 2025
