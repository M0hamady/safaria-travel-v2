import React, { useEffect, useState } from "react";
import { CalendarToday, Clear } from "@mui/icons-material"; // Import icons
import { useToast } from "../../context/ToastContext";

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
  type?: 'date' | 'datetime-local'; // add this
  beforeVal?: string; // New prop added
  clearButtonIcon?: React.ReactNode; // Customizable clear button icon
  calendarIcon?: React.ReactNode; // Customizable calendar icon
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  type,
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
  beforeVal, // Destructure the new prop
  clearButtonIcon = <Clear />, // Default clear icon
  calendarIcon = <CalendarToday />, // Default calendar icon
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  // Open the date picker when clicking anywhere on the input container
   const { addToast } = useToast();
  const handleClick = () => {
    if (inputRef.current && !disabled) {
      // Try to open the native date picker
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      } else {
        // Fallback: Focus the input field (works on most devices)
        inputRef.current.focus();
      }
    }
  };

  // Clear the selected date
  const handleClearDate = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input value
      onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>); // Trigger onChange
    }
  };

  // Set proper max and min dates
  const calculatedMaxDate = maxDate || beforeVal || undefined;

  // Format the selected date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  useEffect(() => {
    if (error) {
      addToast({
        message: `${helperText} : ${label}`,
        type: "error",
      });
    }
  }, [error, helperText])
  

  return (
    <div
      className={`relative ${fullWidth ? "w-full" : ""} ${className} text-black`}
      onClick={handleClick}
    >
      {/* Label */}
      <label
        className={`absolute left-3 top-0 text-gray-500 transition-all duration-300 rtl:right-4  ${
          value || focused ? "text-xs top-1 text-primary" : "text-base top-1"
        }`}
      >
        {label}
      </label>

      {/* Input Container */}
      <div
        className={`flex items-center border h-[55px] ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md px-3 py-2 ${disabled ? "bg-gray-100" : "bg-white"} 
        cursor-pointer max-sm:rounded-full max-sm:w-full `}
      >
        {/* Calendar Icon */}

        {/* Input Field */}
        <input
          type={type || 'date'} // Add a `type` prop and default it to "date"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="appearance-none w-full focus:outline-none bg-transparent cursor-pointer min-h-[50px] pt-4 text-gray-700"
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
            className="text-red-500 ltr:ml-2 rtl:mr-2 absolute rtl:left-3 top-0 ltr:right-3 max-sm:top-2 max-sm:bottom-2"
            aria-label="Clear date"
          >
            {clearButtonIcon}
          </button>
        )}
      
    </div>
  );
};

export default DatePicker;