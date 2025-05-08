import React from 'react';
import { Trip } from '../../types/trainTypes';

interface Props {
  trip: Trip;
  onSelect: (id: string) => void;
  getMinPrice: (trip: Trip) => number;
}

const TripListItem: React.FC<Props> = ({ trip, onSelect, getMinPrice }) => (
  <li
    className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => onSelect(`${trip.id}`)}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{trip.train.name}</h3>
        <h3 className="font-semibold text-lg">{trip.station_from.name} → {trip.station_to.name}</h3>
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
);

export default TripListItem;
