# راهنمای تست‌های پروژه EDX CRM WEB FOV

## 📋 نصب وابستگی‌های تست

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## 🧪 اجرای تست‌ها

### حالت Watch (توسعه)
```bash
npm test
```

### اجرای یکباره
```bash
npm run test:run
```

### با رابط کاربری
```bash
npm run test:ui
```

### با گزارش Coverage
```bash
npm run test:coverage
```

## 📁 ساختار تست‌ها

```
src/
├── test/
│   ├── setup.ts              # تنظیمات اولیه تست
│   └── README.md             # این فایل
├── utils/
│   └── __tests__/
│       ├── rateLimiter.test.ts
│       └── csrfProtection.test.ts
└── components/
    └── __tests__/
        └── ErrorBoundary.test.tsx
```

## ✅ تست‌های موجود

### 1. Rate Limiter Tests
- ✅ بررسی اجازه دسترسی اولیه
- ✅ ردیابی تلاش‌های ناموفق
- ✅ مسدود کردن بعد از تلاش‌های زیاد
- ✅ ریست کردن محدودیت
- ✅ فرمت کردن زمان باقیمانده

### 2. CSRF Protection Tests
- ✅ تولید توکن معتبر
- ✅ بازگرداندن توکن یکسان
- ✅ اعتبارسنجی توکن صحیح
- ✅ رد کردن توکن نادرست
- ✅ رفرش توکن
- ✅ پاک کردن توکن

### 3. Error Boundary Tests
- ✅ نمایش children در صورت عدم خطا
- ✅ نمایش UI خطا هنگام بروز خطا
- ✅ نمایش پیام خطا
- ✅ نمایش دکمه‌های اکشن
- ✅ استفاده از fallback سفارشی

## 📝 نوشتن تست جدید

### مثال: تست یک Utility Function

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFunction';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### مثال: تست یک Component

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 🎯 Coverage Goals

- **Utilities**: 80%+ coverage
- **Services**: 70%+ coverage
- **Components**: 60%+ coverage
- **Overall**: 70%+ coverage

## 🔧 Mocks موجود

در `setup.ts` این موارد mock شده‌اند:
- ✅ `window.matchMedia`
- ✅ `IntersectionObserver`
- ✅ `ResizeObserver`
- ✅ `crypto.getRandomValues`
- ✅ `sessionStorage`
- ✅ `localStorage`

## 📊 نکات بهینه‌سازی

1. **تست‌های سریع**: از mock استفاده کنید
2. **تست‌های ایزوله**: هر تست باید مستقل باشد
3. **نام‌گذاری واضح**: توضیح دهید چه چیزی را تست می‌کنید
4. **Cleanup**: از `afterEach(cleanup)` استفاده کنید

## 🚀 CI/CD Integration

برای استفاده در CI/CD:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## 📖 منابع بیشتر

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
