import React from "react";

interface CheckboxFilterProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onChange: (updatedValues: string[]) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ title, options, selectedValues, onChange }) => {
  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    const updatedValues = isChecked
      ? [...selectedValues, value]
      : selectedValues.filter((selected) => selected !== value);
    onChange(updatedValues);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      <div className="mt-1">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              value={option}
              checked={selectedValues.includes(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxFilter;
