import { FC } from "react";
import { TripCard } from "./TripCard";

export const TripList: FC<{ trips: any[] }> = ({ trips }) => (
  trips.length === 0 ? (
    <p className="text-center text-gray-500">No trips match your filters.</p>
  ) : (
    <div className="grid grid-cols-1  gap-6">
      {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
    </div>
  )
);