import { useTranslation } from "react-i18next";
import { transportOptions } from "./utilies/transportOptions";
import { SearchType } from "../types/types";

export const TransportSelector = ({
  selectedTransport,
  setSelectedTransport,
}: {
  selectedTransport: SearchType; // Ensure selectedTransport is a SearchType
  setSelectedTransport: (value: SearchType) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4">
      {transportOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setSelectedTransport(option.value as SearchType)} // Cast to SearchType
          className={`flex items-center gap-2 px-4 py-3 transition-all ${
            selectedTransport === option.value
              ? "bg-border text-black shadow-inner"
              : "text-gray-500 hover:bg-gray-50"
          } rounded-3xl`}
          aria-label={t(option.label)} // Add an aria-label for better accessibility
        >
          {option.icon}
          <span className="whitespace-nowrap">{t(option.label)}</span>
        </button>
      ))}
    </div>
  );
};
