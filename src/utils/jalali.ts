/**
 * Accurate Gregorian to Jalali (Solar Hijri) conversion algorithms
 */

export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

const persianWeekDays = [
  'یک‌شنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
  'شنبه',
];

export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (w) => persianDigits[parseInt(w, 10)]);
}

export function getTehranDate(date: Date = new Date()): Date {
  try {
    // Convert to Asia/Tehran local representation
    const tehranString = date.toLocaleString('en-US', { timeZone: 'Asia/Tehran' });
    return new Date(tehranString);
  } catch {
    return date;
  }
}

export function getCurrentJalaliDate(date: Date = new Date(), useTehran = true): {
  year: number;
  month: number;
  day: number;
  monthName: string;
  weekDayName: string;
  formatted: string;
  formattedWithPersianDigits: string;
  shortFormatted: string;
} {
  const targetDate = useTehran ? getTehranDate(date) : date;
  const [jy, jm, jd] = gregorianToJalali(targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate());
  const monthName = persianMonths[jm - 1];
  const weekDayName = persianWeekDays[targetDate.getDay()];

  return {
    year: jy,
    month: jm,
    day: jd,
    monthName,
    weekDayName,
    formatted: `${weekDayName}، ${jd} ${monthName} ${jy}`,
    formattedWithPersianDigits: `${weekDayName}، ${toPersianDigits(jd)} ${monthName} ${toPersianDigits(jy)}`,
    shortFormatted: `${weekDayName}، ${toPersianDigits(jd)} ${monthName}`,
  };
}

export function formatLiveTime(
  date: Date = new Date(),
  usePersianDigits = true,
  includeSeconds = true,
  useTehran = true
): string {
  const targetDate = useTehran ? getTehranDate(date) : date;
  const hours = String(targetDate.getHours()).padStart(2, '0');
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');
  const seconds = String(targetDate.getSeconds()).padStart(2, '0');
  const timeStr = includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
  return usePersianDigits ? toPersianDigits(timeStr) : timeStr;
}
