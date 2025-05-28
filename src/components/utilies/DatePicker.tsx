import React, { useEffect, useState, useRef } from "react";
import { CalendarToday, Clear } from "@mui/icons-material";
import { useToast } from "../../context/ToastContext";
import i18next from "i18next";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  beforeVal?: string;
  clearButtonIcon?: React.ReactNode;
  calendarIcon?: React.ReactNode;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText = "",
  fullWidth = true,
  className = "",
  minDate,
  maxDate,
  required = false,
  disabled = false,
  id,
  name,
  beforeVal,
  clearButtonIcon = <Clear />,
  calendarIcon = <CalendarToday />,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayInputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const { addToast } = useToast();
  const currentLanguage = i18next.language;
  const isRTL = currentLanguage === "ar";

  // Open the native date picker
  const handleClick = () => {
    if (inputRef.current && !disabled) {
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
      setFocused(true);
    }
  };

  // Clear the selected date
  const handleClearDate = () => {
    if (inputRef.current && displayInputRef.current) {
      inputRef.current.value = "";
      displayInputRef.current.value = "";
      onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Format date based on language
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();

    if (currentLanguage === "ar") {
      const arabicMonthNames = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
      ];
      const month = arabicMonthNames[date.getMonth()];
      const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
      const formatArabicNumber = (num: number) =>
        String(num).replace(/\d/g, (d) => arabicNumerals[parseInt(d)]);
      return `${formatArabicNumber(day)} ${month} ${formatArabicNumber(year)}`;
    } else {
      const englishMonthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const month = englishMonthNames[date.getMonth()];
      return `${day} ${month} ${year}`;
    }
  };

  // Handle date selection from native picker
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (displayInputRef.current) {
      displayInputRef.current.value = formatDate(e.target.value);
    }
    onChange(e);
  };

  // Set proper max and min dates
  const calculatedMaxDate = maxDate || beforeVal || undefined;

  // Toast for errors
  useEffect(() => {
    if (error) {
      addToast({
        id: Date.now().toString(),
        message: `${helperText} : ${label}`,
        type: "error",
      });
    }
  }, [error, helperText, label, addToast]);

  return (
    <div
      className={`relative ${fullWidth ? "w-full" : "max-w-sm"} ${className} text-black font-sans`}
      onClick={handleClick}
    >
      {/* Label */}
      <label
        className={`absolute left-3 top-0 text-gray-600  transition-all duration-300 ease-in-out rtl:right-14 ${
          value || focused
            ? "text-xs rtl:right-8    text-primary font-medium"
            : "text-base top-3 "
        }`}
      >
        {label}
      </label>

      {/* Input Container */}
      <div
        className={`flex items-center border min-h-[50px] ${
          error ? "border-red-500 ring-1 ring-red-200" : "border-gray-300"
        } rounded-lg px-4 py-3 ${disabled ? "bg-gray-100 right-6" : "bg-white"} 
        cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 
        max-sm:rounded-full max-sm:w-full focus-within:ring-2 focus-within:ring-primary focus-within:border-primary`}
      >
        {/* Calendar Icon */}
        <span
          className={`text-gray-500 mr-3 rtl:ml-3 transition-colors duration-200 ${
            focused ? "text-primary" : ""
          }`}
        >
          {calendarIcon}
        </span>

        {/* Display Input (Formatted Day Mon Year or Helper Text as Placeholder) */}
        <input
          type="text"
          value={value ? formatDate(value) : ""}
          placeholder={value ? "" : helperText ||  isRTL ? "اختر تايخ" :   "Select a date"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`appearance-none w-full  focus:outline-none bg-transparent cursor-pointer text-gray-800 font-medium placeholder-gray-400 ${
            isRTL ? `text-right  ${!value && "absolute rtl:right-24 mr-2"}  ` : `text-left ${!value && "absolute rtl:right-24 mr-2"} `
          }`}
          readOnly
          ref={displayInputRef}
          aria-label={label}
        />

        {/* Hidden Native Date Input */}
        <input
          type="date"
          id={id}
          name={name}
          value={value}
          onChange={handleDateChange}
          className="absolute opacity-0 w-0 h-0"
          min={calculatedMaxDate}
          max={minDate}
          required={required}
          disabled={disabled}
          ref={inputRef}
          autoComplete="off"
          aria-invalid={error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>

      {/* Clear Button */}
      {value && !disabled && (
        <button
          onClick={handleClearDate}
          className="text-red-500 hover:text-red-600 ltr:ml-2 rtl:mr-2 absolute rtl:left-3 top-3 ltr:right-3 max-sm:top-3 transition-colors duration-200"
          aria-label="Clear date"
        >
          {clearButtonIcon}
        </button>
      )}

      {/* Helper Text for Errors */}
      {helperText && error && (
        <p
          id={`${id}-error`}
          className={`text-red-500 text-xs mt-2  ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default DatePicker;