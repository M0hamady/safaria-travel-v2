import React from "react";
import { PrivateTrip } from "../../types/types";

interface TripCompanyInfoProps {
  trip: PrivateTrip;
}

export const TripCompanyInfo: React.FC<TripCompanyInfoProps> = ({ trip }) => {
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="px-[18px] py-[17px] bg-white rounded-lg shadow-[0px_4px_4px_rgba(217,217,217,0.25)] inline-flex flex-col justify-start items-start gap-4 w-full">
        <div className="w-full flex flex-wrap justify-start items-center gap-[60px]">
          <div className="inline-flex flex-col justify-center items-center gap-4">
            <img
              className="w-[139.82px] h-20 object-contain"
              src={trip.company_logo}
              alt={trip.company_name}
            />
          </div>

          <div className="flex-1 inline-flex flex-col justify-center items-start gap-6">
            <div className="inline-flex justify-start items-center gap-1">
              <div className="text-[#1e1e1e] text-xl font-medium leading-[30px] font-cairo">
                {trip.company_name}
              </div>
            </div>

            <div className="self-stretch inline-flex justify-start items-center gap-5">
              <div className="w-[139.82px] px-2.5 py-2 rounded-3xl flex justify-center items-start gap-2.5 border border-[#ddd]">
                {/* Optional: Add content here if needed */}
              </div>

              <div className="inline-flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-start gap-2">
                  <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
                    {trip.bus.seats_number} seats
                  </div>
                </div>
              </div>
            </div>
          </div>

          <img
            className="w-[46.72px] h-12 object-contain"
            src="https://placehold.co/47x48"
            alt="icon"
          />
        </div>
      </div>
    </div>
  );
};