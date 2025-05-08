import React, { useContext, useEffect, useState } from "react";
import { TrainsContext } from "../../context/TrainsContext";

interface Filters {
  from_station_id?: string;
  to_station_id?: string;
  date?: string;
  coach_class_id?: string;
  start_time?: string;
  finish_time?: string;
  priceRange?: [number, number];
}

const TrainFilterComponent = () => {
  const { filters, setFilters, stations, trips } = useContext(TrainsContext);
  const [priceLimits, setPriceLimits] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    if (trips.length > 0) {
      const prices = trips.map((t) =>
        Math.min(...t.train.classes.map((cls) => cls.cost))
      );
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceLimits([min, max]);

      if (!filters.priceRange) {
        setFilters({ ...filters, priceRange: [min, max] });
      }
    }
  }, [trips, filters, setFilters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newPrice = Number(e.target.value);
    const current = filters.priceRange || priceLimits;
    const updated = [...current] as [number, number];
    updated[index] = newPrice;
    setFilters({ ...filters, priceRange: updated });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-100 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">🔍 Filter Your Trip</h2>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🎯 Price Range (EGP)
        </label>
        <div className="flex items-center justify-between gap-4 text-sm font-medium text-gray-600 mb-2">
          <span>{filters.priceRange?.[0] ?? priceLimits[0]}</span>
          <span>{filters.priceRange?.[1] ?? priceLimits[1]}</span>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="range"
            min={priceLimits[0]}
            max={priceLimits[1]}
            value={filters.priceRange?.[0] ?? priceLimits[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="w-full accent-primary"
          />
          <input
            type="range"
            min={priceLimits[0]}
            max={priceLimits[1]}
            value={filters.priceRange?.[1] ?? priceLimits[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Departure Station */}
      {/* <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          🚉 From Station
        </label>
        <select
          name="from_station_id"
          value={filters.from_station_id || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="">Select departure</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* Arrival Station */}
      {/* <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          🏁 To Station
        </label>
        <select
          name="to_station_id"
          value={filters.to_station_id || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="">Select arrival</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* Date Picker */}
      {/* <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          📅 Travel Date
        </label>
        <input
          type="date"
          name="date"
          value={filters.date || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div> */}
    </div>
  );
};

export default TrainFilterComponent;
