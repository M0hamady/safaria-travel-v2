import React from 'react';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface DateTimeInputProps {
  value: string;
  onChange: (v: string) => void;
  label: string;
  minDate?: string;
}

const RenderDateTimeInput: React.FC<DateTimeInputProps> = ({ value, onChange, label, minDate }) => {
  const handleChange = (newValue: Date | null) => {
    if (newValue) {
      const isoString = newValue.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
      onChange(isoString);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value ? new Date(value) : null}
        onChange={handleChange}
        minDateTime={minDate ? new Date(minDate) : undefined}
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default RenderDateTimeInput;
