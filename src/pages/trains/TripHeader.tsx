import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TrainsContext } from "../../context/TrainsContext";
import images from "../../assets";

export const TripHeader = () => {
  const { selectedTrip, selectedArrivalLocation,selectedArrivalStation,selectedDepartureLocation,selectedDepartureStation } = useContext(TrainsContext);
  const navigate = useNavigate();

  if (!selectedTrip) return null;


  return (
    <header className="bg-primary text-white pt-2 px-8 flex flex-col capitalize items-center justify-center">
      {/* Back Button */}
      <div className="w-full flex justify-start items-center mb-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:opacity-80"
          aria-label="Go back"
        >
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.75 20.1538L8.25 12.6538L15.75 5.15381"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Trip Route */}
      <div className="flex gap-5 justify-center items-center translate-y-8 mx-auto">
        <div className="text-lg font-semibold w-fit  text-right">
          {selectedDepartureStation?.name}({selectedDepartureLocation?.name})
        </div>

        <div className="flex items-center justify-center">
        <img src={images.railWay}  className="w-28 h-4 object-cover" />

        </div>

        <div className="text-lg font-semibold  text-left">
        {selectedArrivalStation?.name}({selectedArrivalLocation?.name})
        </div>
      </div>

      {/* Decorative Box */}
      <div className="w-32 h-32 max-sm:w-20 max-sm:h-20 rotate-45 mx-auto translate-y-12 max-sm:translate-y-8 rounded-xl bg-primary" />
    </header>
  );
};
