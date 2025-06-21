import React from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import i18next from 'i18next';

interface DateTimeDisplayProps {
  value: string;
  isLined?: boolean;
  type?: 'datetime' | 'date' | 'time';
  locale?: 'en-US' | 'ar-EG'; // ممكن نحذفه نهائياً لو هنعتمد كلياً على i18next
}

const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

const formatArabicDate = (date: Date, type: 'datetime' | 'date' | 'time') => {
  const day = date.getDate();
  const month = arabicMonths[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  let period = '';
  let hourStr = hours;

  if (type !== 'date') {
    if (hours < 12) {
      period = 'صباحًا';
    } else {
      period = 'مساءً';
    }

    hourStr = hours % 12 || 12; // تحويل لـ 12 ساعة
  }

  if (type === 'date') {
    return `${day} ${month} ${year}`;
  }

  if (type === 'time') {
    return `${hourStr}:${minutes} ${period}`;
  }

  return `${day} ${month} ${year} - ${hourStr}:${minutes} ${period}`;
};

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({
  value,
  isLined= false,
  type = 'datetime',
  locale, // قابل للإزالة لو مش هتستخدمه
}) => {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return <span className="text-red-500 font-medium">⛔ تاريخ غير صالح</span>;
  }

  const currentLang = locale || i18next.language || 'en-US';
  const isArabic = currentLang.startsWith('ar');

  const formatted = isArabic
    ? formatArabicDate(date, type)
    : date.toLocaleString(currentLang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(type !== 'date' && {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      });

  return (
    <div
      className={`inline-flex items-center gap-2 text-sm text-gray-800${isLined && 'text-nowrap items-start w-full flex-nowrap'} ${
        isArabic ? 'rtl text-right' : 'ltr text-left'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {type === 'time' ? (
        <AccessTimeIcon fontSize="small" className="text-blue-600" />
      ) : (
        <CalendarTodayIcon fontSize="small" className="text-green-600" />
      )}
      <span className={`${isLined && 'text-nowrap items-start w-full flex-nowrap'}`}>{formatted}</span>
    </div>
  );
};

export default DateTimeDisplay;
