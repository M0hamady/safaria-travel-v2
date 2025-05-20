import React from "react";

interface TripHeaderProps {
  companyName: string;
  companyImage: string; // URL to logo or image
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  companyName,
  companyImage,
}) => {
  return (
    <div className="w-full px-5 py-3 border-b border-[#e8ecf2] flex items-center justify-between gap-4 bg-white">
      {/* Back Button (replace with actual functionality if needed) */}
    
      {/* Company Info */}
      <div className="flex justify-between overflow-hidden w-full">
        {/* Company Image */}
        <img
          src={companyImage}
          alt={`${companyName} logo`}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-[#1e1e1e] text-base font-medium font-cairo truncate">
          {companyName}
        </span>
      </div>
    </div>
  );
};
