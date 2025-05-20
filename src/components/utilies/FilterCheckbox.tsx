export const FilterCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <label className="inline-flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:border-primary bg-white cursor-pointer transition">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-primary rounded focus:ring-primary"
    />
    <span className="text-sm text-gray-800">{label}</span>
  </label>
);
