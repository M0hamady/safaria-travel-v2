import React from "react";
import { useSearchContext } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { usePrivateSearchContext } from "../context/PrivateSearchContext";
import { useTranslation } from "react-i18next";
import { PinDrop } from "@mui/icons-material";

const Header: React.FC = () => {
  const { selectedTrip } = useSearchContext();
  const { private_trip } = usePrivateSearchContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const city_from = selectedTrip?.cities_from[0] || private_trip?.from_location;
  const city_to = selectedTrip?.cities_to[0] || private_trip?.to_location;

  return (
    <header className="bg-primary  text-white pt-2 px-8 flex flex-col capitalize items-center justify-center  ">
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
            className="rtl:rotate-180"
          >
            <path
              d="M15.75 20.1538L8.25 12.6538L15.75 5.15381"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {t("dashboard.back")}
        </button>
      </div>

      {/* Trip Route */}
      <div className="flex gap-5 justify-center items-center translate-y-8  mx-auto max-sm:flex-col w-full  max-sm:mx-0 max-sm:justify-start max-sm:items-start  ">
        {/* Departure City */}
         <div className="text-lg font-semibold w-fit  text-start max-sm:flex max-sm:flex-col max-sm:justify-start">
                  <span className="md:hidden"><PinDrop /> {t("busSearchTrips.departureStation")}: </span>
                  <span className="max-sm:text-lg max-sm:text-start ltr:max-sm:ml-8 rtl:max-sm:mr-8 ">
        
                  {city_from?.name} - ({city_from?.name})
                  </span>
                </div>

        {/* Route Indicator */}
        <div className="flex items-center justify-center max-sm:hidden  ">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="h-1 w-32 max-sm:w-20 bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>

        {/* Destination City */}
        <div className="text-lg font-semibold w-fit   max-sm:flex max-sm:flex-col max-sm:justify-start max-sm:mb-8 text-start">
                  <span className="md:hidden"><PinDrop /> {t("busSearchTrips.arrivalStation")}: </span>
                  <span className="max-sm:text-lg max-sm:text-start ltr:max-sm:ml-8 rtl:max-sm:mr-8  ">
        
                {city_to?.name} - ({city_to?.name})
                  </span>
                </div>
      </div>
      <div className="w-32 h-32 max-sm:w-20 max-sm:h-20  rotate-45 mx-auto translate-y-12 max-sm:translate-y-8  rounded-xl bg-primary ">

      </div>
    </header>
  );
};

export default Header;
