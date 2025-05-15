import React from "react";
import { PrivateTrip } from "../../types/types";

// In TripDetailsCard.tsx
interface TripDetailsCardProps {
  date: string;
  fromLocation: string;
  toLocation: string;
  price: number; // Changed to number
}

export const TripDetailsCard: React.FC<TripDetailsCardProps> = ({
  date,
  fromLocation,
  toLocation,
  price,
}) => {
  return (
    <div className="self-stretch px-5 pb-4 border-b border-[#e8ecf2] inline-flex justify-start items-start gap-[87px]">
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
        <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
          {date}
        </div>
        <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
          {fromLocation} - {toLocation}
        </div>
      </div>
      <div className="inline-flex flex-col justify-start items-start gap-2">
        <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
          Ticket Price
        </div>
        <div className="justify-start text-[#0074c3] text-base font-medium font-['Cairo']">
          {price} EGP
        </div>
      </div>
    </div>
  );
};