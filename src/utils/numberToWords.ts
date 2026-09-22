/**
 * تبدیل عدد به حروف فارسی
 * مثال: 234000 -> "دویست و سی و چهار هزار"
 */

const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];

function convertThreeDigits(num: number): string {
  if (num === 0) return '';
  
  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;
  
  let result = hundreds[h];
  
  if (t === 1) {
    // اعداد 10 تا 19
    if (result) result += ' و ';
    result += teens[o];
  } else {
    if (t > 0) {
      if (result) result += ' و ';
      result += tens[t];
    }
    if (o > 0) {
      if (result) result += ' و ';
      result += ones[o];
    }
  }
  
  return result;
}

export function numberToWords(num: number): string {
  if (num === 0) return 'صفر';
  if (num < 0) return 'منفی ' + numberToWords(-num);
  
  // محدودیت برای اعداد خیلی بزرگ
  if (num >= 1000000000000) return 'عدد خیلی بزرگ';
  
  const billion = Math.floor(num / 1000000000);
  const million = Math.floor((num % 1000000000) / 1000000);
  const thousand = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;
  
  let result = '';
  
  if (billion > 0) {
    result += convertThreeDigits(billion) + ' میلیارد';
  }
  
  if (million > 0) {
    if (result) result += ' و ';
    result += convertThreeDigits(million) + ' میلیون';
  }
  
  if (thousand > 0) {
    if (result) result += ' و ';
    result += convertThreeDigits(thousand) + ' هزار';
  }
  
  if (remainder > 0) {
    if (result) result += ' و ';
    result += convertThreeDigits(remainder);
  }
  
  return result;
}

/**
 * تبدیل ریال به تومان و نمایش به حروف
 * مثال: 2340000 ریال -> "دویست و سی و چهار هزار تومان"
 */
export function rialToTomanWords(rial: number): string {
  if (rial === 0) return 'صفر تومان';
  
  const toman = Math.floor(rial / 10);
  if (toman === 0) return 'کمتر از یک تومان';
  
  return numberToWords(toman) + ' تومان';
}

/**
 * فرمت کردن عدد با جداکننده هزارگان (کاما)
 * مثال: 234000 -> "234,000"
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
