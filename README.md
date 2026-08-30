# Mobile Post Office Web Application (UWE Assignment)

A production-ready Single Page Application (SPA) built with Angular 21 and Angular Material for managing Mobile Post Office information.

[![Angular](https://img.shields.io/badge/Angular-21.0-red.svg)](https://angular.io/)
[![Material](https://img.shields.io/badge/Material-21.0-blue.svg)](https://material.angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-36%20passing-green.svg)](./src/app)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Integration](#-api-integration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Architecture](#-architecture)

## ✨ Features

### Core Functionality
- ✅ **CRUD Operations** - Full create, read, update, delete support
- ✅ **Search & Filter** - Text search with district and day filters
- ✅ **Pagination** - Configurable page sizes (5, 10, 20, 50, 100)
- ✅ **Sorting** - Multi-column sorting with asc/desc (triggers API reload)
- ✅ **Multilingual** - English, Traditional Chinese, Simplified Chinese
- ✅ **Show All Language Data** - Display all translations in table view
- ✅ **Language Persistence** - Selected language persists across sessions
- ✅ **Responsive** - Mobile-first design with Material components
- ✅ **Real-time Validation** - Reactive forms with instant feedback
- ✅ **Error Handling** - Comprehensive error codes (0101-0501)

### User Experience
- 🎨 Modern Material Design UI
- 🌍 Language switching with auto data reload (EN/TC/SC)
- 🔄 Show all language data checkbox (displays EN/TC/SC columns)
- 💾 Language preference stored in localStorage
- 📊 Dynamic table columns based on language mode
- 📱 Mobile & Desktop optimized
- ⚡ Fast loading with lazy loading
- 🔄 Auto-refresh on data changes
- 💾 Confirmation dialogs for destructive actions

## 🛠 Tech Stack

### Frontend Framework
- **Angular 21.0** - Latest version with standalone components
- **Angular Material 21.0** - UI component library
- **RxJS 7.8** - Reactive programming
- **TypeScript 5.9** - Type-safe development

### Development Tools
- **Vitest 4.0** - Fast unit testing
- **Angular CLI 21.0** - Project tooling
- **TailwindCSS 4.1** - Utility-first CSS
- **ESLint** - Code quality

### Backend Integration
- **HttpClient** - RESTful API communication
- **Environment Config** - Multi-environment support
- **API Envelope Format** - Structured responses

## 📁 Project Structure

```
mobile-post-office-web-app/
├── src/
│   ├── app/
│   │   ├── components/          # UI Components
│   │   │   ├── home/            # Landing page
│   │   │   ├── list/            # Record listing (table + pagination)
│   │   │   ├── detail/          # Record details view
│   │   │   ├── edit/            # Create/Edit form
│   │   │   ├── search/          # Search & filter panel
│   │   │   └── confirmation-dialog/  # Delete confirmation
│   │   ├── services/            # Business Logic
│   │   │   ├── mobile-post-office.service.ts  # API integration
│   │   │   ├── language.service.ts            # i18n support
│   │   │   └── loading.service.ts             # Loading state
│   │   ├── models/              # TypeScript Interfaces
│   │   │   └── mobile-post-office.model.ts
│   │   ├── utils/               # Helper Functions
│   │   │   └── date-utils.ts   # Day code conversions
│   │   └── app.ts              # Root component
│   ├── environments/            # Environment Configs
│   │   ├── environment.ts       # Development
│   │   └── environment.prod.ts  # Production
│   └── styles.css              # Global styles
├── tests/                       # Test Files (36 passing)
└── docs/                        # Documentation

📊 Project Scale:
- 6 Components
- 3 Services  
- 17 TypeScript Files
- ~6,100 Lines of Code
- 36 Unit Tests
```

## 🚀 Quick Start

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
```

### Installation

```bash
# Clone the repository
git clone https://github.com/wing199901/mobile-post-office-web-app.git
cd mobile-post-office-web-app

# Install dependencies
npm install

# Configure API endpoint (if needed)
# Edit src/environments/environment.ts
```

### Development Server

```bash
# Start dev server
npm start

# Open browser
http://localhost:4200
```

The app will automatically reload on file changes.

### Build for Production

```bash
# Build optimized bundle
npm run build

# Output location
dist/mobile-post-office-web-app/
```

## 🧪 Testing

### Test Status

✅ **All tests passing** (Last updated: 2025-12-23)
- **Test Files**: 3 passed
- **Total Tests**: 36 passed
- **Failures**: 0
- **Errors**: 0

**Test Breakdown:**
```
✓ Service Tests: 19 passed
✓ App Tests: 2 passed  
✓ Component Tests: 15 passed
─────────────────────────────
✅ Total: 36/36 passing
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/app/app.spec.ts
```

### Test Framework

- **Framework**: Vitest (recommended by Angular 21)
- **Test Types**: Unit Tests, Component Tests, Service Tests
- **Coverage**: Components, Services, Models

### Coverage Goals

| Area | Target Coverage |
|------|----------------|
| Services | 90%+ |
| Components | 80%+ |
| Models | 100% |
| Utilities | 90%+ |

### Best Practices

#### 1. Isolation
- Each test should be independent
- Use mocks for external dependencies
- Reset state between tests

#### 2. Clarity
- Use descriptive test names
- Follow "should..." naming convention
- Group related tests with `describe` blocks

#### 3. Coverage
- Test happy paths and error cases
- Test edge cases and boundary conditions
- Verify error handling

### Common Issues & Solutions

#### Issue: Tests fail with "NullInjectorError"
**Solution**: Ensure all required providers are included in TestBed configuration

#### Issue: HTTP tests fail
**Solution**: Remember to call `httpMock.verify()` in `afterEach`

#### Issue: Async tests timeout
**Solution**: Use `async/await` or `fakeAsync/tick` for async operations

#### Issue: Component tests fail on render
**Solution**: Include `BrowserAnimationsModule` for Material components

### Test Documentation

Detailed test documentation is available in component and service folders:
- [List Component Tests](src/app/components/list/README.md) - 15 test cases
- [Service Tests](src/app/services/README.md) - 19 test cases

### References

- [Vitest Documentation](https://vitest.dev/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Testing Best Practices](https://angular.dev/guide/testing/best-practices)

## 🔌 API Integration

### API Endpoint Configuration

**Environment File** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',  // Backend base URL
  defaultLanguage: 'en',
  defaultPageSize: 10,
  enableDebugMode: true
};
```

### API Envelope Format

All API responses follow this structure:

```typescript
{
  header: {
    success: boolean,
    message: string,
    err_code?: string,  // e.g., "0101", "0201"
    err_msg?: string
  },
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    lang: 'en' | 'tc' | 'sc' | 'all'
  },
  result: T  // Your data
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mobileposts` | List all records (with pagination) |
| GET | `/api/mobileposts/:id` | Get single record |
| POST | `/api/mobileposts` | Create new record |
| PUT | `/api/mobileposts/:id` | Update record |
| DELETE | `/api/mobileposts/:id` | Delete record |
| GET | `/api/mobileposts/districts/all?lang={lang}` | Get district list (multi-language) |

### Query Parameters

```typescript
{
  page?: number,           // Page number (default: 1)
  limit?: number,          // Items per page (default: 20)
  search?: string,         // Full-text search
  district?: string,       // Filter by district
  dayOfWeek?: number,      // Filter by day (1-7)
  openAt?: string,         // Filter by opening time (HH:MM)
  sortBy?: string,         // Sort field
  sortDir?: 'asc'|'desc',  // Sort direction
  lang?: 'en'|'tc'|'sc'    // Language
}
```

### Error Codes

| Code | Description |
|------|-------------|
| 0101 | Missing required field |
| 0102 | No updatable fields |
| 0103 | Invalid dayOfWeekCode |
| 0104 | Invalid time format |
| 0105 | Invalid lang value |
| 0106 | Invalid numeric value |
| 0201 | Record not found |
| 0401 | Server error |
| 0501 | Database error |

### Field Changes (API v2)

| Old Field | New Field | Type | Format |
|-----------|-----------|------|--------|
| `openAt` | `openHour` | string | HH:MM |
| `closeAt` | `closeHour` | string | HH:MM |
| `dayOfWeek` | `dayOfWeekCode` | number | 1-7 |
| `pageSize` | `limit` | number | - |
| `sortOrder` | `sortDir` | string | asc/desc |

### Multi-Language Support

#### Language Switching
- Language selection persists in `localStorage`
- Changing language triggers automatic data reload
- Available languages: English (en), Traditional Chinese (tc), Simplified Chinese (sc)

#### Show All Language Data Feature
When the "Show all language data" checkbox is checked:

**API Behavior:**
- Sends `lang=all` parameter to API
- Backend returns all language fields for each record

**Table Display:**
- Shows additional columns for each language
- Example columns: `Name`, `Name (EN)`, `名稱 (繁)`, `名称 (简)`
- Applies to: name, district, location, address fields

**Districts API:**
- Endpoint: `GET /api/mobileposts/districts/all?lang={lang}`
- Returns districts in selected language
- Response format:
```json
{
  "header": {
    "success": true,
    "message": "18 districts retrieved"
  },
  "result": [
    { "district": "Central and Western" },
    { "district": "Eastern" },
    ...
  ]
}
```

**Supported Languages:**
- `lang=en` - English names
- `lang=tc` - Traditional Chinese (繁體中文)
- `lang=sc` - Simplified Chinese (简体中文)
- `lang=all` - Returns all language fields (nameEN, nameTC, nameSC, etc.)

## 🧪 Testing

### Test Coverage

**Service Tests** (`mobile-post-office.service.spec.ts`):
- ✅ All CRUD operations
- ✅ API envelope unwrapping
- ✅ Error code handling (0101-0501)
- ✅ Language parameter variations
- ✅ Network error handling

**Component Tests** (`list.component.spec.ts`):
- ✅ Component creation
- ✅ Data loading & display
- ✅ Pagination functionality
- ✅ Navigation between views
- ✅ Error handling

### Testing Framework

- **Vitest 4.0** - Fast unit test runner
- **Angular Testing Utilities** - ComponentFixture, TestBed
- **HttpClientTestingModule** - Mock HTTP requests

### Test Commands

```bash
# Run once
npm test

# Watch mode (auto-rerun on changes)
npm test -- --watch

# Coverage report
npm test -- --coverage

# Specific test file
npm test -- src/app/services/mobile-post-office.service.spec.ts
```

### Migration from Jasmine to Vitest

The project uses **Vitest** (not Jasmine). Key differences:

| Jasmine | Vitest |
|---------|--------|
| `jasmine.createSpyObj()` | `{ method: vi.fn() }` |
| `.and.returnValue()` | `.mockReturnValue()` |
| `spyOn()` | `vi.spyOn()` |
| `fail()` | `expect.fail()` |

## 🏗 Architecture

### Component Architecture

```
┌─────────────────────────────────────┐
│         App Component               │
│    (Router Outlet + Navigation)     │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌─────▼──────┐
│    Home     │  │    List    │
│  Component  │  │ Component  │◄───┐
└─────────────┘  └─────┬──────┘    │
                       │            │
            ┌──────────┼────────┐   │
            │          │        │   │
       ┌────▼───┐ ┌───▼────┐ ┌─▼───▼───┐
       │ Detail │ │  Edit  │ │ Search  │
       └────────┘ └────────┘ └─────────┘
```

### Service Layer

```
┌────────────────────────────────┐
│   MobilePostOfficeService      │
│  (API Communication Layer)     │
└────────────┬───────────────────┘
             │
   ┌─────────┼─────────┐
   │         │         │
┌──▼────┐ ┌─▼──────┐ ┌▼─────────┐
│Language│ │Loading │ │Validation│
│Service │ │Service │ │ Utils    │
└────────┘ └────────┘ └──────────┘
```

### Data Flow

```
User Action → Component → Service → HttpClient → Backend API
                  ↓           ↓
              UI Update ← Observable ← Response
```

### State Management

- **Signals** - Angular 21 reactive primitives
- **RxJS** - Async data streams
- **Service State** - Shared state via services
- **Route Params** - Navigation state

## 📦 Deployment

### Development

```bash
npm start
# Access: http://localhost:4200
```

### Production Build

```bash
# Build optimized bundle
npm run build

# Output: dist/mobile-post-office-web-app/
# - Minified JavaScript
# - Optimized CSS
# - Tree-shaken dependencies
# - AOT compiled templates
```

### Environment Configuration

**Development** (`environment.ts`):
```typescript
{
  production: false,
  apiUrl: 'http://localhost:3000',
  enableDebugMode: true
}
```

**Production** (`environment.prod.ts`):
```typescript
{
  production: true,
  apiUrl: 'https://api.yourdomain.com',
  enableDebugMode: false
}
```

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
   ```bash
   npm run build
   # Deploy dist/ folder
   ```

2. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY . .
   RUN npm ci && npm run build
   CMD ["npm", "start"]
   ```

3. **Server (Nginx)**
   ```nginx
   server {
     listen 80;
     root /var/www/dist/mobile-post-office-web-app;
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

## 📝 Key Features Implementation

### 1. Day of Week Code Conversion

**Utility Function** (`utils/date-utils.ts`):
```typescript
export function dayOfWeekCodeToName(code: number): string {
  const days = ['', 'Monday', 'Tuesday', 'Wednesday', 
                'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[code] || 'Unknown';
}
```

### 2. API Response Unwrapping

**Service** (`mobile-post-office.service.ts`):
```typescript
getAll(params?: QueryParams): Observable<PaginatedResponse> {
  return this.http.get<ApiResponse<MobilePostOffice[]>>(this.apiUrl, { params })
    .pipe(
      map(response => ({
        data: response.result,
        total: response.meta.total,
        page: response.meta.page,
        pageSize: response.meta.limit
      })),
      catchError(this.handleError)
    );
}
```

### 3. Form Validation

**Custom Validator**:
```typescript
timeRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const openHour = group.get('openHour')?.value;
    const closeHour = group.get('closeHour')?.value;
    
    if (openHour && closeHour && closeHour <= openHour) {
      return { timeRange: 'Closing time must be after opening time' };
    }
    return null;
  };
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**wing199901**
- GitHub: [@wing199901](https://github.com/wing199901)
- Repository: [mobile-post-office-web-app](https://github.com/wing199901/mobile-post-office-web-app)

## 🙏 Acknowledgments

- Angular Team for the excellent framework
- Material Design Team for the UI components
- All contributors and testers

---

**Built with ❤️ using Angular 21**
