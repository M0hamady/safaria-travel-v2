import React from "react";
import { PrivateTrip } from "../../types/types";

interface TripInfoSectionProps {
  trip: PrivateTrip;
}

const TripInfoSection: React.FC<TripInfoSectionProps> = ({ trip }) => {
  return (
    <div className="px-4 py-5 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(217,217,217,0.25)]">
      {/* Additional trip information can be added here */}
    </div>
  );
};

export default TripInfoSection;