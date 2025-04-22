import React from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../../../context/SearchContext";
import { FormatDateTimeOptions } from "../../../types/types";

interface Station {
  name: string;
  arrival_at: string;
}

const BusSearchTripsReturn: React.FC = () => {
  const {
    getFilteredTripsReturn,
    tripFiltersReturn,
    searchValues,
    setSearchValues,
    setTripFiltersReturn,
    handleTripSelectionReturn
  } = useSearchContext();
  const filteredTrips = getFilteredTripsReturn();
  const navigate = useNavigate();

  // Dummy assets and translation function; replace with your own as needed
  const tvIcon = "https://via.placeholder.com/24";
  const acIcon = "https://via.placeholder.com/24";
  const t = (str: string) => str;
  const duration = "2h 30m";

  // Local state for sorting option (e.g., lowest price, highest price, etc.)
  const [sortOption, setSortOption] = React.useState("lowestPrice");

  // Helper to convert "HH:mm" to minutes (for sorting)
  const convertTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Helper to format a time string using the departure date (from searchValues)
  // to produce a preview like "day/month hours:minutes AM/PM".
  const formatDateTime = (
    dateTimeStr: string,
    options?: FormatDateTimeOptions
  ): string => {
    // Default locale and formatting options
    const locale = options?.locale || "en-GB";
    const defaultFormatOptions: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    // Override or add custom formatting options if provided.
    const formatOptions = {
      ...defaultFormatOptions,
      ...options?.formatOptions,
    };

    // Convert the string by replacing the space with "T"
    // e.g. "2025-03-27 09:30:00" becomes "2025-03-27T09:30:00"
    const isoDateStr = dateTimeStr.replace(" ", "T");
    const dateObj = new Date(isoDateStr);

    if (isNaN(dateObj.getTime())) {
      console.warn(
        `Invalid date/time provided: "${dateTimeStr}". Using current date/time.`
      );
      return new Date().toLocaleString(locale, formatOptions);
    }

    return dateObj.toLocaleString(locale, formatOptions);
  };

  // Sort trips based on the selected sort option.
  const finalTrips = React.useMemo(() => {
    let trips = [...filteredTrips];
    switch (sortOption) {
      case "lowestPrice":
        trips.sort(
          (a, b) =>
            a.prices_start_with.final_price - b.prices_start_with.final_price
        );
        break;
      case "highestPrice":
        trips.sort(
          (a, b) =>
            b.prices_start_with.final_price - a.prices_start_with.final_price
        );
        break;
      case "arrivalTime":
        trips.sort((a, b) => {
          const arrivalA = a.stations_to[0]?.arrival_at || "00:00";
          const arrivalB = b.stations_to[0]?.arrival_at || "00:00";
          return convertTimeToMinutes(arrivalA) - convertTimeToMinutes(arrivalB);
        });
        break;
      case "departureTime":
        trips.sort(
          (a, b) =>
            convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time)
        );
        break;
      default:
        break;
    }
    return trips;
  }, [filteredTrips, sortOption]);

  if (finalTrips.length === 0) {
    return <p className="text-center text-gray-600">No buses found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{finalTrips.length} results</span>
          <span>|</span>
          <button
            className="text-primary font-medium hover:underline"
            onClick={() => {
              // Reset all search values and filters when clicking "All tickets"
              setSearchValues({
                from: "",
                to: "",
                departure: "",
                return: "",
              });
              setTripFiltersReturn({});
              navigate("/bus-search-return");
            }}
          >
            All tickets
          </button>
        </div>
        <div className="flex gap-4">
          {/* Sorting Dropdown */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="lowestPrice">{t("Lowest Price")}</option>
            <option value="highestPrice">{t("Highest Price")}</option>
            <option value="arrivalTime">{t("Earliest Arrival")}</option>
            <option value="departureTime">{t("Earliest Departure")}</option>
          </select>
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-6">
        {finalTrips.map((trip) => {
          const departureStation = trip.stations_from[0];
          const arrivalStation = trip.stations_to[0];

          return (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Header Section */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <img
                  src={
                    trip.company_data?.avatar ||
                    "https://via.placeholder.com/83x40"
                  }
                  alt="Company Logo"
                  className="w-20 h-10 object-contain"
                />
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6V12H16.5M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                      stroke="#69696A"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{duration}</span>
                </div>
              </div>

              {/* Stations Preview Section */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">
                    Departure Station
                  </h4>
                  {departureStation ? (
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-700">
                        {tripFiltersReturn.stationFrom || departureStation.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(trip.time)}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No departure station available.
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">
                    Arrival Station
                  </h4>
                  {arrivalStation ? (
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-700">
                        {tripFiltersReturn.stationTo || arrivalStation.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(arrivalStation.arrival_at)}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No arrival station available.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4 mb-4 md:mb-0 w-full">
                  <div className="flex items-center gap-2">
                    <img src={tvIcon} alt="TV" className="w-6 h-6" />
                    <img src={acIcon} alt="AC" className="w-6 h-6" />
                  </div>
                  {trip.pricing.length > 0 && (
                    <div
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        trip.category === "Comfort"
                          ? "bg-primary text-primary"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {trip.category}
                    </div>
                  )}
                  {trip.available_seats !== 0 && (
                    <div className="text-sm text-gray-600">
                      {trip.available_seats} {t("seats free")}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 justify-between   w-full">
                  <div className="text-start ">
                    <div className="text-xl font-bold text-gray-800">
                      {trip.prices_start_with.final_price} {t("LE")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("Price per person")}
                    </div>
                  </div>
                  <button
                    className="bg-primary hover:bg-primary text-white font-semibold py-2 px-6 rounded-md shadow transition duration-200"
                    onClick={() => {
             
                    handleTripSelectionReturn(trip.id, trip.cities_from[0].id, trip.cities_to[0].id,trip.stations_from[0].id ,trip.stations_to[0].id,trip.date, arrivalStation,departureStation  );
                    }}
                  >
                    {t("select")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusSearchTripsReturn;
