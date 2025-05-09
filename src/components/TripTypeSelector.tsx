import { useTranslation } from "react-i18next";
import { useSearchType } from "../context/SearchTypeContext";

export const TripTypeSelector = ({
  tripType,
  setTripType,
}: {
  tripType: "one-way" | "round";
  setTripType: (type: "one-way" | "round") => void;
}) => {
  const { t } = useTranslation();
    const { searchType, setSearchType } = useSearchType();
  
  const isTrain = searchType === "train";

  return (
    <div className="h-6 justify-start items-start gap-5 inline-flex mb-4">
      <div
        className="h-6 justify-start items-start gap-2 inline-flex cursor-pointer"
        onClick={() => setTripType("one-way")}
      >
        <div className="w-6 h-6 relative flex items-center justify-center">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              tripType === "one-way" ? "bg-[#0074c3]" : "bg-transparent"
            }`}
          />
          <div
            className={`w-6 h-6 rounded-full border ${
              tripType === "one-way" ? "border-[#0074c3]" : "border-[#b9c4d5]"
            } absolute inset-0`}
          />
        </div>
        <div
          className={`text-base font-normal font-['Cairo'] leading-normal ${
            tripType === "one-way" ? "text-[#0074c3]" : "text-[#68696a]"
          }`}
        >
          {t("tripType.oneWay")}
        </div>
      </div>

      {!isTrain && (
        <div
          className="h-6 justify-start items-start gap-2 inline-flex cursor-pointer"
          onClick={() => setTripType("round")}
        >
          <div className="w-6 h-6 relative flex items-center justify-center">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                tripType === "round" ? "bg-[#0074c3]" : "bg-transparent"
              }`}
            />
            <div
              className={`w-6 h-6 rounded-full border ${
                tripType === "round" ? "border-[#0074c3]" : "border-[#b9c4d5]"
              } absolute inset-0`}
            />
          </div>
          <div
            className={`text-base font-normal font-['Cairo'] leading-normal ${
              tripType === "round" ? "text-[#0074c3]" : "text-[#68696a]"
            }`}
          >
            {t("tripType.round")}
          </div>
        </div>
      )}
    </div>
  );
};
