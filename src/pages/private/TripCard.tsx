import { FC } from "react";
import { Trip } from "../../types/types";
import { useNavigate } from "react-router-dom";

export const TripCard: FC<{ trip: Trip }> = ({ trip }) =>{
  
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleSelect = () => {
    navigate(`/private-trips-search/trip/${trip.id}`); // ✅ Navigate with trip id
  };

  return (
  <div className="px-[18px] py-[17px] bg-white rounded-lg shadow-[0px_4px_4px_rgba(217,217,217,0.25)] inline-flex flex-col justify-start items-start gap-4 w-full w-full">
    <div className="w-full inline-flex justify-start items-center gap-[60px]">
      <div className="inline-flex flex-col justify-center items-center gap-4">
        <img
          className="w-[139.82px] h-20 object-contain"
          src={trip.company_data.avatar}
          alt={trip.company}
        />
      </div>

      <div className="flex-1 inline-flex flex-col justify-center items-start gap-6">
        <div className="inline-flex justify-start items-center gap-1">
          <div className="text-[#1e1e1e] text-xl font-medium leading-[30px] font-cairo">
            {trip.company}
          </div>
          <div className="text-[#68696a] text-base font-normal leading-normal font-cairo ml-2">
            {trip.category}
          </div>
        </div>

        <div className="self-stretch inline-flex justify-start items-center gap-5">
          <div className="w-[139.82px] px-2.5 py-2 rounded-3xl flex justify-center items-start gap-2.5 border border-[#ddd]">
            <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
              {trip.category}
            </div>
          </div>

          <div className="inline-flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-start items-start gap-2">
              <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
                {trip.available_seats} seats
              </div>
            </div>
          </div>

          <div className="inline-flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-start items-start gap-2">
              <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
                Luggage: 1 large + 1 small
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

    <div className="w-full pt-4 border-t border-[#b9c4d5] inline-flex justify-end items-center gap-4">
      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <div className="text-[#1e1e1e] text-xl font-medium leading-[30px] font-cairo">
            LE {trip.price_start_with}
          </div>
          <div className="text-[#68696a] text-xs font-normal leading-[18px] font-cairo">
            Round Trip Price
          </div>
        </div>

        <div className="w-[110px] flex justify-start items-start">
        <div
              onClick={handleSelect} // ✅ Navigate on click
              className="flex-1 h-[54px] p-4 bg-[#0074c3] rounded-[9px] shadow-[0px_4px_4px_rgba(217,217,217,0.25)] flex justify-center items-center gap-2 cursor-pointer hover:brightness-90 transition"
            >
              <div className="text-white text-xl font-medium leading-[30px] font-cairo">
                Select
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
);
}