import React from "react";
import { useTranslation } from "react-i18next";
import ConfirmAndAuthCheck from "../utilies/ConfirmAndAuthCheck";

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
  const { t } = useTranslation();

  return (
    <div className="self-stretch px-5 pb-5 flex flex-col justify-start items-start gap-4">

      {/* Discount */}
      <div className="flex justify-between w-full overflow-hidden">
        <span className="text-[#1e1e1e] text-base font-normal font-cairo">
          {t("priceSummary.discount")}
        </span>
        <span className="text-[#0074c3] text-base font-medium font-cairo">
          {discount} {t("price_unit")}
        </span>
      </div>

      {/* Tax Included */}
      <div className="flex justify-between w-full overflow-hidden">
        <span className="text-[#1e1e1e] text-base font-normal font-cairo">
          {t("priceSummary.taxIncluded")}
        </span>
        <span className="text-[#0074c3] text-base font-medium font-cairo">
          {tax} {t("price_unit")}
        </span>
      </div>

      {/* Total */}
      <div className="flex justify-between w-full">
        <span className="text-[#1e1e1e] text-xl font-medium font-cairo">
          {t("priceSummary.total")}
        </span>
        <span className="text-[#0074c3] text-base font-semibold font-cairo">
          {total} {t("price_unit")}
        </span>
      </div>

      {/* Confirm Button with Auth & Agreement Check */}
      <div className="w-full ">
        <div className="">
          <ConfirmAndAuthCheck
            onConfirm={onPayNow}
            loading={isCreatingTicket}
            label={t("priceSummary.payNow")}
          />
        </div>
      </div>
    </div>
  );
};
