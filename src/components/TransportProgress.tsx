import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import { transportOptions } from "./utilies/transportOptions";
import { SearchType } from "../types/types";

export const TransportProgress = ({
  selectedTransport,
  setSelectedTransport,
}: {
  selectedTransport: SearchType;
  setSelectedTransport: (value: SearchType) => void;
}) => {
  const currentIndex = transportOptions.findIndex(
    (t) => t.value === selectedTransport
  );
  
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <div className="text-left w-full">
        <p className="text-lg mb-3 font-semibold text-primary ">
          {currentIndex + 1}/{transportOptions.length}
        </p>
        <div className="bg-gray-300 w-full h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-2 transition-all"
            style={{
              width: `${((currentIndex + 1) / transportOptions.length) * 100}%`,
            }}
          />
        </div>
      </div>
      <button
        onClick={() => {
          if (currentIndex > 0) {
            setSelectedTransport(transportOptions[currentIndex - 1].value as SearchType);
          }
        }}
        disabled={currentIndex === 0}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full disabled:opacity-50"
      >
        <ChevronLeftOutlined />
      </button>
      <button
        onClick={() => {
          if (currentIndex < transportOptions.length - 1) {
            setSelectedTransport(transportOptions[currentIndex + 1].value as SearchType);
          }
        }}
        disabled={currentIndex === transportOptions.length - 1}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full disabled:opacity-50"
      >
        <ChevronRightOutlined />
      </button>
    </div>
  );
};