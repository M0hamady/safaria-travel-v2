import React from "react";

// In TripPriceSummary.tsx
interface TripPriceSummaryProps {
  discount: number | string;
  tax: number | string;
  total: string;
  onPayNow: () => void;
  isCreatingTicket: boolean;
}

export const TripPriceSummary: React.FC<TripPriceSummaryProps> = ({
  discount,
  tax,
  total,
  onPayNow,
  isCreatingTicket,
}) => {
  return (
    <div className="self-stretch px-5 pb-5 flex flex-col justify-start items-start gap-4">
      <div className="self-stretch inline-flex justify-start items-start gap-4 overflow-hidden">
        <div className="flex-1 justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
          Discount
        </div>
        <div className="justify-start text-[#0074c3] text-base font-medium font-['Cairo']">
          {discount} EGP
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-start gap-4 overflow-hidden">
        <div className="flex-1 justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
          Tax Included
        </div>
        <div className="justify-start text-[#0074c3] text-base font-medium font-['Cairo']">
          {tax} EGP
        </div>
      </div>
      <div className="self-stretch inline-flex justify-center items-center gap-4">
        <div className="flex-1 justify-start text-[#1e1e1e] text-xl font-medium font-['Cairo'] leading-[30px]">
          Total
        </div>
        <div className="justify-start text-[#0074c3] text-base font-semibold font-['Cairo']">
          {total} EGP
        </div>
      </div>

      <div className="w-[183px] inline-flex justify-end items-center">
        <button
          className="flex-1 h-[54px] p-4 bg-[#0074c3] rounded-[9px] shadow-[0px_4px_4px_0px_rgba(217,217,217,0.25)] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          onClick={onPayNow}
          disabled={isCreatingTicket}
        >
          <div className="justify-start text-white text-xl font-medium font-['Cairo'] leading-[30px]">
            {isCreatingTicket ? "Processing..." : "Pay Now"}
          </div>
        </button>
      </div>
    </div>
  );
};