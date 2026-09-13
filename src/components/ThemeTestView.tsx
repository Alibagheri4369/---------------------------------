import { useTheme } from '../theme/ThemeProvider';
import { ThemeCard, ThemeButton, ThemeBox } from './ThemeBox';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

const COLOR_THEMES = [
  { id: 'default', name: 'پیش‌فرض (زرد طلایی)', color: '#f59e0b' },
  { id: 'blue', name: 'آبی فنی', color: '#3b82f6' },
  { id: 'indigo', name: 'نیلی', color: '#6366f1' },
  { id: 'purple', name: 'بنفش مدرن', color: '#8b5cf6' },
  { id: 'emerald', name: 'سبز پایدار', color: '#10b981' },
  { id: 'teal', name: 'فیروزه‌ای', color: '#14b8a6' },
  { id: 'orange', name: 'نارنجی پرانرژی', color: '#f97316' },
  { id: 'rose', name: 'صورتی', color: '#f43f5e' },
  { id: 'slate', name: 'خاکستری', color: '#64748b' },
] as const;

export default function ThemeTestView() {
  const { themeMode, colorTheme, setThemeMode, setColorTheme, resolvedTheme } = useTheme();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
          🎨 آزمایشگاه تم‌ها
        </h1>
        <p style={{ color: 'var(--muted-foreground)' }}>
          تمام ترکیب‌های رنگی و تم‌ها را اینجا تست کنید
        </p>
        <div className="text-sm" style={{ color: 'var(--primary)' }}>
          تم فعلی: <strong>{resolvedTheme === 'dark' ? 'تیره' : 'روشن'}</strong> | 
          رنگ: <strong>{COLOR_THEMES.find(t => t.id === colorTheme)?.name}</strong>
        </div>
      </div>

      {/* Theme Mode Selector */}
      <ThemeCard className="p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
          حالت روشنایی:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setThemeMode('dark')}
            className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3"
            style={{
              backgroundColor: themeMode === 'dark' ? 'var(--primary)' : 'var(--surface-secondary)',
              color: themeMode === 'dark' ? 'var(--primary-foreground)' : 'var(--foreground)',
              borderColor: themeMode === 'dark' ? 'var(--primary)' : 'var(--border)',
            }}
          >
            <Moon className="w-8 h-8" />
            <span className="font-bold">تیره (Dark)</span>
            {themeMode === 'dark' && <Check className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setThemeMode('light')}
            className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3"
            style={{
              backgroundColor: themeMode === 'light' ? 'var(--primary)' : 'var(--surface-secondary)',
              color: themeMode === 'light' ? 'var(--primary-foreground)' : 'var(--foreground)',
              borderColor: themeMode === 'light' ? 'var(--primary)' : 'var(--border)',
            }}
          >
            <Sun className="w-8 h-8" />
            <span className="font-bold">روشن (Light)</span>
            {themeMode === 'light' && <Check className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setThemeMode('system')}
            className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3"
            style={{
              backgroundColor: themeMode === 'system' ? 'var(--primary)' : 'var(--surface-secondary)',
              color: themeMode === 'system' ? 'var(--primary-foreground)' : 'var(--foreground)',
              borderColor: themeMode === 'system' ? 'var(--primary)' : 'var(--border)',
            }}
          >
            <Monitor className="w-8 h-8" />
            <span className="font-bold">سیستم (Auto)</span>
            {themeMode === 'system' && <Check className="w-5 h-5" />}
          </button>
        </div>
      </ThemeCard>

      {/* Color Theme Selector */}
      <ThemeCard className="p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
          پالت رنگی:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setColorTheme(theme.id as any)}
              className="p-3 rounded-lg border-2 transition-all flex items-center gap-3"
              style={{
                backgroundColor: colorTheme === theme.id ? 'var(--primary)' : 'var(--surface-secondary)',
                color: colorTheme === theme.id ? 'var(--primary-foreground)' : 'var(--foreground)',
                borderColor: colorTheme === theme.id ? 'var(--primary)' : 'var(--border)',
              }}
            >
              <div
                className="w-6 h-6 rounded-full shrink-0"
                style={{ backgroundColor: theme.color }}
              />
              <span className="text-sm font-semibold truncate">{theme.name}</span>
              {colorTheme === theme.id && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>
      </ThemeCard>

      {/* Preview Section */}
      <ThemeCard className="p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
          پیش‌نمایش اجزای UI:
        </h2>
        
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--muted-foreground)' }}>
              دکمه‌ها:
            </h3>
            <div className="flex flex-wrap gap-3">
              <ThemeButton variant="primary" className="px-4 py-2 rounded-lg font-bold">
                دکمه اصلی
              </ThemeButton>
              <ThemeButton variant="secondary" className="px-4 py-2 rounded-lg font-bold">
                دکمه ثانویه
              </ThemeButton>
              <ThemeButton variant="ghost" className="px-4 py-2 rounded-lg font-bold">
                دکمه شفاف
              </ThemeButton>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--muted-foreground)' }}>
              کارت‌ها:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ThemeCard className="p-4">
                <h4 className="font-bold mb-2" style={{ color: 'var(--foreground)' }}>کارت ۱</h4>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  این یک کارت نمونه است با تم فعلی
                </p>
              </ThemeCard>
              <ThemeCard className="p-4">
                <h4 className="font-bold mb-2" style={{ color: 'var(--foreground)' }}>کارت ۲</h4>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  رنگ‌ها به صورت خودکار تغییر می‌کنند
                </p>
              </ThemeCard>
              <ThemeCard className="p-4">
                <h4 className="font-bold mb-2" style={{ color: 'var(--foreground)' }}>کارت ۳</h4>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  همه چیز responsive و زیباست
                </p>
              </ThemeCard>
            </div>
          </div>

          {/* Boxes */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--muted-foreground)' }}>
              جعبه‌ها:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ThemeBox variant="default" className="p-4 rounded-lg text-center font-bold">
                پیش‌فرض
              </ThemeBox>
              <ThemeBox variant="surface" className="p-4 rounded-lg text-center font-bold border">
                سطح
              </ThemeBox>
              <ThemeBox variant="surface-secondary" className="p-4 rounded-lg text-center font-bold border">
                سطح ۲
              </ThemeBox>
              <ThemeBox variant="muted" className="p-4 rounded-lg text-center font-bold">
                کم‌رنگ
              </ThemeBox>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--muted-foreground)' }}>
              تایپوگرافی:
            </h3>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                عنوان بزرگ (H1)
              </h1>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                عنوان متوسط (H2)
              </h2>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                عنوان کوچک (H3)
              </h3>
              <p style={{ color: 'var(--foreground)' }}>
                متن عادی - لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم
              </p>
              <p style={{ color: 'var(--muted-foreground)' }}>
                متن کم‌رنگ - این متن با رنگ muted نمایش داده می‌شود
              </p>
              <p style={{ color: 'var(--primary)' }}>
                متن با رنگ اصلی - این متن با رنگ primary نمایش داده می‌شود
              </p>
            </div>
          </div>
        </div>
      </ThemeCard>

      {/* CSS Variables Display */}
      <ThemeCard className="p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
          متغیرهای CSS فعال:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--muted-foreground)' }}>--background</div>
            <div style={{ color: 'var(--foreground)' }} className="font-bold">
              {getComputedStyle(document.documentElement).getPropertyValue('--background')}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--muted-foreground)' }}>--surface</div>
            <div style={{ color: 'var(--foreground)' }} className="font-bold">
              {getComputedStyle(document.documentElement).getPropertyValue('--surface')}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
            <div style={{ color: 'var(--primary-foreground)' }}>--primary</div>
            <div style={{ color: 'var(--primary-foreground)' }} className="font-bold">
              {getComputedStyle(document.documentElement).getPropertyValue('--primary')}
            </div>
          </div>
        </div>
      </ThemeCard>

      {/* Status */}
      <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--success)', color: 'white' }}>
        <p className="font-bold text-lg">✅ سیستم تم به درستی کار می‌کند!</p>
        <p className="text-sm mt-2">تمام رنگ‌ها و حالت‌های روشنایی به صورت پویا تغییر می‌کنند</p>
      </div>
    </div>
  );
}
