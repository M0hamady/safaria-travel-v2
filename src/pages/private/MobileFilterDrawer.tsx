import { FC, useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";
import { FilterCheckbox } from "../../components/utilies/FilterCheckbox";

export const MobileFilterDrawer: FC<{
  visible: boolean;
  onClose: () => void;
  companies: string[];
  busTypes: string[];
  selectedCompany: string[];
  setSelectedCompany: (val: string[]) => void;
  selectedPriceRange: [number, number];
  setSelectedPriceRange: (val: [number, number]) => void;
  selectedBusType: string[];
  setSelectedBusType: (val: string[]) => void;
  resetFilters: () => void;
}> = ({
  visible,
  onClose,
  companies,
  busTypes,
  selectedCompany,
  setSelectedCompany,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedBusType,
  setSelectedBusType,
  resetFilters,
}) => {
  const handleMinChange = (value: number) => {
    const [min, max] = selectedPriceRange;
    const newMin = Math.min(value, max);
    setSelectedPriceRange([newMin, max]);
  };
    const { t } = useTranslation();

const [open, setopen] = useState(visible)
  const handleMaxChange = (value: number) => {
    const [min, max] = selectedPriceRange;
    const newMax = Math.max(value, min);
    setSelectedPriceRange([min, newMax]);
  };
  const isSelected = useCallback(
    (list: string[], item: string) => list.includes(item),
    []
  );

  const toggleItem = useCallback(
    (list: string[], item: string, setter: (val: string[]) => void) => {
      const updated = list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item];
      setter(updated);
    },
    []
  );
  const [min, max] = selectedPriceRange;
    useEffect(() => {
      setopen(!open)
    if (visible) {
      const el = document.getElementById("company-filter");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300); // wait for slide-down animation
      }
    }
  }, [visible]);

  if (!visible) return null;



  return (
    <div className="fixed inset-0 bg-black/50 z-30 flex justify-center items-start pt-20 px-4"  id="company-filter">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative space-y-9 ">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={onClose}
        >
          <CloseIcon fontSize="large"   />
        </button>

        <div className="flex justify-between items-center mb-6 ">
          <h2 className="text-xl font-bold text-gray-800">{t("filters.title")}</h2>
          <button
            onClick={resetFilters}
            className="text-gray-500 hover:text-blue-600 transition absolute right-14 top-4 "
          >
            <RefreshIcon  fontSize="large" />
          </button>
        </div>

        {/* Company Filter */}
        <div className="pb-4 mb-4  mt-2 border-b-2 ">
          <h3 className="text-lg font-medium mb-3">{t("filters.company")}</h3>
          <div className="flex flex-col gap-2">
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

        <div>
          <h3 className="text-lg font-medium mb-3">{t("filters.priceRange")}</h3>
          {/* Labels */}
          <div className="w-full px-4 flex justify-between text-xs text-[#1e1e1e] font-normal leading-[18px]">
            <span>{max.toLocaleString()} {t("filters.currency")}</span>
            <span>{min.toLocaleString()} {t("filters.currency")}</span>
          </div>
          {/* Slider */}
          <div className="relative w-full h-[100px] mb-4 mt-2 border-b-2 ">
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
                bottom: "16px",
              }}
            />
            <div
              className="absolute w-[22px] h-[22px] bottom-0 bg-primary rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{
                left: `calc(${(max / 10000) * 100}% - 11px)`,
                bottom: "16px",
              }}
            />
          </div>
        </div>

        {/* Bus Type Filter */}
        <div className="mb-4 border-b-2 ">
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
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-xl font-medium shadow-md"
        >
          Apply
        </button>
      </div>
    </div>
  );
};
