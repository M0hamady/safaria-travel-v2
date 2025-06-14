import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../../../context/SearchContext";
import { useTranslation } from "react-i18next";
import { FilterCheckbox } from "../../../components/utilies/FilterCheckbox";

// Helper functions
const convertTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

const BusSearchFilters: React.FC = () => {
  const { trips, tripFilters, setTripFilters, setSearchValues } = useSearchContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compute unique filter options based on raw trips
  const companyOptions = useMemo(() => {
    return Array.from(new Set(trips.map((trip) => trip.company)));
  }, [trips]);

  // Deduplicate departure stations by name
  const departureStationOptions = useMemo(() => {
    return Array.from(
      new Set(trips.flatMap((trip) => trip.stations_from.map((s) => s.name)))
    );
  }, [trips]);

  // Deduplicate arrival stations by name
  const arrivalStationOptions = useMemo(() => {
    return Array.from(
      new Set(trips.flatMap((trip) => trip.stations_to.map((s) => s.name)))
    );
  }, [trips]);

  // Compute min and max price range
  const priceRange = useMemo(() => {
    if (trips.length === 0) return { min: 0, max: 0 };
    const prices = trips.map((trip) => trip.price_start_with);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [trips]);

  // Common handler for filter changes
  const handleFilterChange = (field: string, value: string | number) => {
    setTripFilters({
      ...tripFilters,
      [field]: value,
    });
  };
  const { t, i18n } = useTranslation();

  // The grid of filter sections. The `alwaysOpen` prop forces sections to be expanded
  // (useful in the modal view so users can access all controls).
  const FilterSectionsContent = ({ alwaysOpen = true }: { alwaysOpen?: boolean }) => (
    <div className="grid grid-cols-1 gap-8">
      {/* Company Filter */}
      <FilterSection title={t("companies")} alwaysOpen={alwaysOpen}>
        {companyOptions.map((company) => (
          <FilterCheckbox
            key={company}
            label={company}
            checked={tripFilters.company === company}
            onChange={() =>
              handleFilterChange(
                "company",
                tripFilters.company === company ? "" : company
              )
            }
          />
        ))}
      </FilterSection>

      {/* Departure Stations Filter */}
      <FilterSection title="departureStations" alwaysOpen={alwaysOpen}>
        {departureStationOptions.map((station) => (
          <FilterCheckbox
            key={station}
            label={station}
            checked={tripFilters.stationFrom === station}
            onChange={() =>
              handleFilterChange(
                "stationFrom",
                tripFilters.stationFrom === station ? "" : station
              )
            }
          />
        ))}
      </FilterSection>

      {/* Arrival Stations Filter */}
      <FilterSection title="arrivalStations" alwaysOpen={alwaysOpen}>
        {arrivalStationOptions.map((station) => (
          <FilterCheckbox
            key={station}
            label={station}
            checked={tripFilters.stationTo === station}
            onChange={() =>
              handleFilterChange(
                "stationTo",
                tripFilters.stationTo === station ? "" : station
              )
            }
          />
        ))}
      </FilterSection>

      {/* Price Filter Section */}
      <FilterSection title="priceRange" alwaysOpen={alwaysOpen}>
        <div className="flex flex-col gap-3 py-4">
          <label className="text-gray-700 text-sm">
            {`Price Range: ${tripFilters.priceMin ?? priceRange.min} - ${
              tripFilters.priceMax ?? priceRange.max
            } LE`}
          </label>
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={tripFilters.priceMin ?? priceRange.min}
            onChange={(e) =>
              handleFilterChange("priceMin", Number(e.target.value))
            }
            className="w-full h-2 rounded-lg appearance-none bg-primary accent-primary transition duration-300"
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={tripFilters.priceMax ?? priceRange.max}
            onChange={(e) =>
              handleFilterChange("priceMax", Number(e.target.value))
            }
            className="w-full h-2 rounded-lg appearance-none bg-primary accent-primary transition duration-300"
          />
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="mb-6 px-8 max-sm:px-0 max-sm:w-full max-sm:my-0 ">
      {/* Desktop View: Inline filters */}
      <div className="hidden md:block ">
        <div className="flex w-full mb-6 text-dark opacity-70 justify-between px-4 rounded-xl bg-white  p-6">
          <h2 className="font-bold flex gap-2 items-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M7.5 3H17.25M7.5 3C7.5 3.39782 7.34196 3.77936 7.06066 4.06066C6.77936 4.34196 6.39782 4.5 6 4.5C5.60218 4.5 5.22064 4.34196 4.93934 4.06066C4.65804 3.77936 4.5 3.39782 4.5 3M7.5 3C7.5 2.60218 7.34196 2.22064 7.06066 1.93934C6.77936 1.65804 6.39782 1.5 6 1.5C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3M4.5 3H0.75M7.5 15H17.25M7.5 15C7.5 15.3978 7.34196 15.7794 7.06066 16.0607C6.77936 16.342 6.39782 16.5 6 16.5C5.60218 16.5 5.22064 16.342 4.93934 16.0607C4.65804 15.7794 4.5 15.3978 4.5 15M7.5 15C7.5 14.6022 7.34196 14.2206 7.06066 13.9393C6.77936 13.658 6.39782 13.5 6 13.5C5.60218 13.5 5.22064 13.658 4.93934 13.9393C4.65804 14.2206 4.5 14.6022 4.5 15M4.5 15H0.75M13.5 9H17.25M13.5 9C13.5 9.39782 13.342 9.77936 13.0607 10.0607C12.7794 10.342 12.3978 10.5 12 10.5C11.6022 10.5 11.22064 10.342 10.9393 10.0607C10.658 9.77936 10.5 9.39782 10.5 9M13.5 9C13.5 8.60218 13.342 8.22064 13.0607 7.93934C12.7794 7.65804 12.3978 7.5 12 7.5C11.6022 7.5 11.22064 7.65804 10.9393 7.93934C10.658 8.22064 10.5 8.60218 10.5 9M10.5 9H0.75"
                stroke="#69696A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("filters.title")}

          </h2>
          <h2
            className="text-primary cursor-pointer"
            onClick={() => {
              // Reset all search values and filters when clicking "Result all"
              setSearchValues({
                from: "",
                to: "",
                departure: "",
                return: "",
              });
              setTripFilters({});
              navigate("/bus-search");
            }}
          >
            {t("reset_all")}
          </h2>
        </div>
        <FilterSectionsContent />
      </div>

      {/* Mobile/Tablet View: Button to open filter modal */}
      <div className="block md:hidden">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 bg-primary text-white rounded-lg shadow-md"
        >
          {t("open_filters")}
        </button>
      </div>

      {/* Mobile/Tablet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 h-full overflow-y-auto bg-black bg-opacity-50 px-4 py-8">
          <div className="bg-white w-full h-fit max-w-md rounded-lg p-4  mx-auto flex flex-col gap-5  " >
            <div className="sticky top-0 flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-bold">{t("filters")}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            {/* In modal view, force sections to always be open */}
            <FilterSectionsContent alwaysOpen={true} />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                {t("close")}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                {t("apply")}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable component for a collapsible filter section.
// If `alwaysOpen` is true, the section remains expanded and the toggle arrow is hidden.
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  alwaysOpen?: boolean;
}
const FilterSection: React.FC<FilterSectionProps> = ({ title, children, alwaysOpen = false }) => {
  const [isOpen, setIsOpen] = useState(alwaysOpen);
  
  // If alwaysOpen, disable toggling.
  const toggle = () => {
    if (!alwaysOpen) setIsOpen((prev) => !prev);
  };
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6 p-4 border rounded-2xl shadow-md bg-white py-8 transition-all duration-500 ease-out">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggle}
      >
        <span className="font-semibold text-lg">{t(title)}</span>
        {!alwaysOpen && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};

// Reusable checkbox component


export default BusSearchFilters;
