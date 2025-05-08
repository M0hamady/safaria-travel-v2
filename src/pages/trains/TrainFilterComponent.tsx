import React, { useContext, useEffect, useState } from "react";
import { TrainsContext } from "../../context/TrainsContext";

// Define Filters type
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

  // Dynamically derive min and max prices from trips
  useEffect(() => {
    if (trips.length > 0) {
      const prices = trips.map((t) => t.price); // Ensure 'price' exists on Trip type
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceLimits([min, max]);
  
      // Set price filter only once if it's not yet initialized
      if (!filters.priceRange) {
        setFilters({
          ...filters,  // Spread the previous filters
          priceRange: [min, max], // Set the price range
        });
      }
    }
  }, [trips, filters, setFilters]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPrice = Number(e.target.value);
    const current = filters.priceRange || priceLimits;
    const updated = [...current] as [number, number];
    updated[index] = newPrice;
    setFilters({ ...filters, priceRange: updated });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {/* From Station */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">From Station</label>
          <select
            name="from_station_id"
            value={filters.from_station_id || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">All</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div> */}

        {/* To Station */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">To Station</label>
          <select
            name="to_station_id"
            value={filters.to_station_id || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">All</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div> */}

        {/* Date */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={filters.date || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div> */}

        {/* Coach Class */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Coach Class</label>
          <select
            name="coach_class_id"
            value={filters.coach_class_id || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">All</option>
            <option value="1">First Class</option>
            <option value="2">Second Class</option>
          </select>
        </div> */}

        {/* Start Time */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="time"
            name="start_time"
            value={filters.start_time || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div> */}

        {/* Finish Time */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Finish Time</label>
          <input
            type="time"
            name="finish_time"
            value={filters.finish_time || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div> */}
      </div>

      {/* Price Range Slider */}
      <div>
        <label className="block text-sm font-medium mb-1">Price Range</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={priceLimits[0]}
            max={priceLimits[1]}
            value={filters.priceRange?.[0] ?? priceLimits[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="w-full"
          />
          <span className="text-sm font-medium text-gray-600">{filters.priceRange?.[0]}</span>

          <input
            type="range"
            min={priceLimits[0]}
            max={priceLimits[1]}
            value={filters.priceRange?.[1] ?? priceLimits[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="w-full"
          />
          <span className="text-sm font-medium text-gray-600">{filters.priceRange?.[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default TrainFilterComponent;
