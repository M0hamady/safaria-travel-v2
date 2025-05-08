import React from 'react';
import { Trip } from '../../types/trainTypes';
import TripListItem from './TripListItem';

interface Props {
  trips: Trip[];
  onSelect: (id: string) => void;
  getMinPrice: (trip: Trip) => number;
}

const TripList: React.FC<Props> = ({ trips, onSelect, getMinPrice }) => (
  <ul className="space-y-4">
    {trips.map(trip => (
      <TripListItem
        key={trip.id}
        trip={trip}
        onSelect={onSelect}
        getMinPrice={getMinPrice}
      />
    ))}
  </ul>
);

export default TripList;
