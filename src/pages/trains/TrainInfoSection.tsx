import React from "react";
import { Trip } from "../../types/trainTypes";

export const TrainInfoSection = ({ trip }: { trip: Trip }) => (
  <div className="mt-6">
    <h3 className="font-semibold mb-2">Train Information</h3>
    <p><strong>Train Name:</strong> {trip.train.name}</p>
  </div>
);
