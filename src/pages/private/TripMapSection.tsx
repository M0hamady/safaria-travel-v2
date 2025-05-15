import React from "react";
import { PrivateTrip } from "../../types/types";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { TripHeader } from "../../components/private-trip/TripHeader";
import EgyptMapSelector from "./EgyptMapSelector";
import { TripCompanyInfo } from "../../components/private-trip/TripCompanyInfo";
import { Address } from "../../types/privateTypes";

interface TripMapSectionProps {
  trip: PrivateTrip;
  isMapExpanded: boolean;
  addresses:Address[];
  toggleMapExpansion: () => void;
}

const TripMapSection: React.FC<TripMapSectionProps> = ({ 
  trip, 
  addresses,
  isMapExpanded, 
  toggleMapExpansion 
}) => {
  return (
    <div className="px-4 py-5 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(217,217,217,0.25)] inline-flex flex-col justify-start items-end gap-5">
      <TripHeader companyName={trip.company_name} />
      
      <div className={`bg-purple-400 w-full relative ${isMapExpanded ? "h-[100px] max-sm:h-[60vh]" : "h-[300px] max-sm:h-[60vh]"} duration-700 ease-in-out`}>
        <EgyptMapSelector  locations={addresses} />
        <div className="text-3xl w-[50px] absolute bottom-0 left-3 z-50 h-[50px]" onClick={toggleMapExpansion}>
          {isMapExpanded ? 
            <Fullscreen className="text-3xl bg-white rounded shadow-md hover:cursor-pointer" /> :
            <FullscreenExit className="text-3xl bg-white rounded shadow-md hover:cursor-pointer" />
          }
        </div>
      </div>
      
      <TripCompanyInfo trip={trip} />
    </div>
  );
};

export default TripMapSection;