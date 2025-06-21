import React from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../../../context/SearchContext";
import { FormatDateTimeOptions } from "../../../types/types";
import { TripCard } from "./BusSearchTrips";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    <div className="max-w-5xl mx-auto  space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{t("busSearchTrips.results", { count: finalTrips.length })}</span>
          <span>|</span>
          <button
            className="text-primary font-medium hover:underline"
            onClick={() => {
              setSearchValues({
                from: "",
                to: "",
                departure: "",
                return: "",
              });
              setTripFiltersReturn({});
              navigate("/bus-search");
            }}
          >
            {t("busSearchTrips.allTickets")}
          </button>
        </div>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          {[
            "lowestPrice",
            "highestPrice",
            "arrivalTime",
            "departureTime",
          ].map((option) => (
            <option key={option} value={option}>
              {t(`busSearchTrips.sortOptions.${option}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {finalTrips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            duration={duration}
            onSelect={(departure, arrival) =>
              handleTripSelectionReturn(
                trip.id,
                trip.cities_from[0].id,
                trip.cities_to[0].id,
                departure.id,
                arrival.id,
                trip.date,
                arrival,
                departure
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default BusSearchTripsReturn;
