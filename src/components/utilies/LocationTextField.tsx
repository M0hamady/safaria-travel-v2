import { useState, useEffect, useRef } from "react";
import { Location } from "../../types/types";
import { CancelOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext";

interface LocationTextFieldProps {
  icon: React.ReactNode;
  title: string;
  locations: Location[];
  onSelect: (location: Location | null) => void; // Allow null to clear selection
  value: string;
  className?: string;
  clearButtonIcon?: React.ReactNode; // Customizable clear button icon
  loading?: boolean; // Loading state for async locations
  error?: string; // Error message
}

const LocationTextField = ({
  icon,
  title,
  locations,
  onSelect,
  value,
  className,
  clearButtonIcon = <CancelOutlined />,
  loading = false,
  error,
}: LocationTextFieldProps) => {
  const { i18n } = useTranslation();
  const [inputValue, setInputValue] = useState(value);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // For keyboard navigation
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
   const { addToast } = useToast();

  // Handle input change with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue) {
        const filtered = locations.filter(
          (location) =>
            location.name_en.toLowerCase().includes(inputValue.toLowerCase()) ||
            location.name_ar.includes(inputValue)
        );
        setFilteredLocations(filtered);
      } else {
        setFilteredLocations(locations); // Show all locations when empty
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [inputValue, locations,]);
useEffect(() => {
  setInputValue(value)
}, [value])

  // Handle location selection
  const handleSelectLocation = (location: Location) => {
    const displayName = i18n.language === "ar" ? location.name_ar : location.name_en;
    setInputValue(displayName);
    onSelect(location);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  // Clear selection
  const handleClearSelection = () => {
    setInputValue("");
    setFilteredLocations(locations);
    onSelect(null);
    setShowDropdown(true);
    inputRef.current?.focus(); // Focus back on the input
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev < filteredLocations.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredLocations.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSelectLocation(filteredLocations[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (error) {
      addToast({
        id: Date.now().toString(),
        message: `${error} : ${title}`,
        type: "error",
      });
    }
  }, [error, error])

  return (
    <div className={`relative ${className}`}>
      {/* Input Field */}
      <div className="flex items-center border h-[55px] max-sm:rounded-full border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
        {/* Icon */}
        <div className="pl-3 pr-2 text-gray-500">{icon}</div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={title}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="w-full py-2 pr-3 rounded-lg outline-none"
          autoComplete="off"
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
        />

        {/* Clear Selection Button */}
        {inputValue && (
          <button
            onClick={handleClearSelection}
            className="mr-3 max-sm:mr-12 text-gray-500 hover:text-red-500"
            aria-label="Clear selection"
          >
            {clearButtonIcon}
          </button>
        )}
      </div>

      {/* Dropdown for filtered locations */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {loading ? (
            <div className="px-4 py-2 text-gray-500">Loading...</div>
          ) : filteredLocations.length > 0 ? (
            <ul>
              {filteredLocations.map((location, index) => (
                <li
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    index === activeIndex ? "bg-gray-100" : ""
                  }`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <div className="font-medium">
                    {i18n.language === "ar" ? location.name_ar : location.name_en}
                  </div>
                  <div className="text-sm text-gray-500">
                    {i18n.language === "ar" ? location.name_en : location.name_ar}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-500">No matching locations found.</div>
          )}
        </div>
      )}

      {/* Error Message */}
    </div>
  );
};

export default LocationTextField;