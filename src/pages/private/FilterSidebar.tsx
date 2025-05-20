import { FC, useCallback, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";
import { FilterCheckbox } from "../../components/utilies/FilterCheckbox";

interface FilterSidebarProps {
  companies: string[];
  busTypes: string[];
  selectedCompany: string[];
  setSelectedCompany: (val: string[]) => void;
  selectedPriceRange: [number, number];
  setSelectedPriceRange: (val: [number, number]) => void;
  selectedBusType: string[];
  setSelectedBusType: (val: string[]) => void;
  resetFilters: () => void;
    isOpen: boolean;

}

export const FilterSidebar: FC<FilterSidebarProps> = ({
  companies,
  busTypes,
  selectedCompany,
  setSelectedCompany,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedBusType,
  setSelectedBusType,
  resetFilters,
    isOpen,

}) => {
  const toggleItem = useCallback(
    (list: string[], item: string, setter: (val: string[]) => void) => {
      const updated = list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item];
      setter(updated);
    },
    []
  );

  const isSelected = useCallback((list: string[], item: string) => list.includes(item), []);

  const handleMinChange = (value: number) => {
    const [min, max] = selectedPriceRange;
    const newMin = Math.min(value, max);
    setSelectedPriceRange([newMin, max]);
  };
const { t } = useTranslation();

  const handleMaxChange = (value: number) => {
    const [min, max] = selectedPriceRange;
    const newMax = Math.max(value, min);
    setSelectedPriceRange([min, newMax]);
  };

  const [min, max] = selectedPriceRange;
  // scroll into view on open (mobile only)

  return (
    <aside className="hidden md:block sticky top-4 bg-white p-6 rounded-2xl shadow-md space-y-6 w-[285px] font-cairo">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("filters.title")}</h2>
        <button onClick={resetFilters} className="text-gray-500 hover:text-gray-800">
          <RefreshIcon />
        </button>
      </div>

      {/* Company Filter */}
      <div  >
        <h3 className="text-lg font-medium mb-3">{t("filters.company")}</h3>
        <div className="flex flex-col gap-2" >
          {companies.map((company) => (
             <FilterCheckbox
        key={company}
        label={company}
        checked={selectedCompany.includes(company)}
        onChange={() =>
          toggleItem(selectedCompany, company, setSelectedCompany)
        }
      />
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="" dir="ltr" >
        <h3 className="text-lg font-medium mb-3">{t("filters.priceRange")}</h3>
        {/* Labels */}
        <div className="w-full px-4 flex justify-between text-xs text-[#1e1e1e] font-normal leading-[18px]">
          <span>{min.toLocaleString()}  {t("filters.currency")}</span>
          <span>{max.toLocaleString()}  {t("filters.currency")}</span>
        </div>

        {/* Slider */}
        <div className="relative w-full h-[140px] mt-2">
          {/* Track background */}
          <div className="relative   rounded-full" />

          {/* Min slider behind */}
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={min}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="absolute appearance-none  bg-primary rounded-full opacity-10 w-full h-[12px]  top-[5px] left-0 pointer-events-auto"
            style={{ zIndex: 8 }}
          />

          {/* Max slider on top */}
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={max}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="absolute appearance-none w-full h-[12px]  bottom-[20px] bg-primary rounded-full opacity-10  left-0  pointer-events-auto"
            style={{ zIndex: 9 }}
          />

          {/* Thumbs */}
          <div
            className="absolute w-[22px] h-[22px] top-0 bg-primary rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{
              left: `calc(${(min / 10000) * 100}% - 11px)`,
              bottom: '16px',
            }}
          />
          <div
            className="absolute w-[22px] h-[22px] bottom-0 bg-primary rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{
              left: `calc(${(max / 10000) * 100}% - 11px)`,
              bottom: '16px',
            }}
          />
        </div>
      </div>

      {/* Bus Type Filter */}
      <div>
        <h3 className="text-lg font-medium mb-3">{t("filters.busType")}</h3>
        <div className="flex flex-wrap gap-3">
          {busTypes.map((type) => (
 <FilterCheckbox
        key={type}
        label={type}
        checked={selectedBusType.includes(type)}
        onChange={() =>
          toggleItem(selectedBusType, type, setSelectedBusType)
        }
      />
          ))}
        </div>
      </div>
    </aside>
  );
};
