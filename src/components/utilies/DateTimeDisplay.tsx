import React from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface DateTimeDisplayProps {
  value: string;
  type?: 'datetime' | 'date' | 'time';
  locale?: 'en-US' | 'ar-EG';
}

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({
  value,
  type = 'datetime',
  locale = 'en-US',
}) => {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return <span className="text-red-500 font-medium">⛔ Invalid date</span>;
  }

  const isArabic = locale.startsWith('ar');

  let options: Intl.DateTimeFormatOptions;
  switch (type) {
    case 'date':
      options = { year: 'numeric', month: 'long', day: 'numeric' };
      break;
    case 'time':
      options = { hour: '2-digit', minute: '2-digit', hour12: true };
      break;
    default:
      options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
  }

  const formatted = date.toLocaleString(locale, options);

  return (
    <div
      className={`inline-flex items-center gap-2 text-sm text-gray-800 ${
        isArabic ? 'rtl text-right' : 'ltr text-left'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {type === 'time' ? (
        <AccessTimeIcon fontSize="small" className="text-blue-600" />
      ) : (
        <CalendarTodayIcon fontSize="small" className="text-green-600" />
      )}
      <span>{formatted}</span>
    </div>
  );
};

export default DateTimeDisplay;
