import React from "react";
import { PrivateTrip } from "../../types/types";

interface TripHeaderProps {
  companyName: string;
}

export const TripHeader: React.FC<TripHeaderProps> = ({ companyName }) => {
  return (
    <div className="self-stretch px-5 pb-4 border-b border-[#e8ecf2] inline-flex justify-start items-center gap-0.5">
      <div className="flex-1 self-stretch px-2.5 py-2 rounded-3xl flex justify-start items-start gap-2.5 overflow-hidden">
        <div className="w-6 h-6 relative origin-top-left rotate-180 overflow-hidden">
          <div className="w-[1.60px] h-[0.80px] left-[12.44px] top-[10.81px] absolute bg-[#68696a]" />
          <div className="w-6 h-[9.60px] left-[0.04px] top-[7.21px] absolute bg-[#68696a]" />
        </div>
        <div className="justify-start text-[#68696a] text-base font-normal font-['Cairo'] leading-normal">
          {companyName}
        </div>
      </div>
     
    </div>
  );
};