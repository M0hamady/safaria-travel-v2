// pages/TrainSearchResults.tsx
import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TrainsContext } from "../../context/TrainsContext";
import { Trip } from "../../types/trainTypes";

const TrainSearchResults = () => {
  const { trips, filters, searchTrips, loading, error } = useContext(TrainsContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Use the actual property names from your Filters interface
    if (filters.from_station_id && filters.to_station_id && filters.date) {
      searchTrips();
    }
  }, [filters, location.key]);

  if (loading) return <div className="p-4 text-center">Loading available trips...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const getMinPrice = (trip: Trip) => {
    return Math.min(...trip.train.classes.map(cls => cls.cost));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Trips</h2>
        <div className="text-sm text-gray-600">
          {trips.length} {trips.length === 1 ? 'trip' : 'trips'} found
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg">No trips found for your search criteria.</p>
          <p className="text-gray-600">Try adjusting your search filters.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {trips.map((trip: Trip) => (
            <li
              key={trip.id}
              className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/trips/${trip.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{trip.train.name}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div>
                      <p className="text-gray-500 text-sm">Departure</p>
                      <p className="font-medium">
                        {new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm">{trip.station_from.name}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Duration</p>
                      <p>{trip.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Arrival</p>
                      <p className="font-medium">
                        {new Date(trip.finish_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm">{trip.station_to.name}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Starting from</p>
                  <p className="text-2xl font-bold text-blue-600">{getMinPrice(trip)} EGP</p>
                  <p className="text-sm text-gray-500 mt-1">{trip.train.classes.length} class options</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrainSearchResults;