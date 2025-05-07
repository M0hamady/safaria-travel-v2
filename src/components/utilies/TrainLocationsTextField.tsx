import { useState, useEffect, useRef } from "react";
import { Station, Location } from "../../types/trainTypes";
import {
  CancelOutlined,
  ArrowDropDown,
  ArrowDropUp,
  LocationOnOutlined,
  TrainOutlined,
  CheckCircleOutline,
  ErrorOutline,
  SwapHoriz,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext";

interface TrainLocationsTextFieldProps {
  icon: React.ReactNode;
  title: string;
  locations: Location[];
  onSelect: (location: Location | null, station?: Station | null, stationId?: number | null) => void;
  value: string;
  className?: string;
  error?: string;
  selectedStation?: Station | null;
}

const TrainLocationsTextField = ({
  icon,
  title,
  locations,
  onSelect,
  value,
  className,
  error,
  selectedStation,
}: TrainLocationsTextFieldProps) => {
  const { i18n } = useTranslation();
  const [inputValue, setInputValue] = useState(value);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStations, setShowStations] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (selectedStation) {
      const location = locations.find(loc => 
        loc.stations.some(station => station.id === selectedStation.id)
      );
      if (location) {
        setSelectedLocation(location);
        setInputValue(selectedStation.name);
      }
    } else if (value) {
      const location = locations.find(loc => 
        i18n.language === "ar" ? loc.name === value : loc.name === value
      );
      if (location) setSelectedLocation(location);
    }
  }, [locations, selectedStation, value, i18n.language]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!inputValue && selectedStation) {
        setSelectedLocation(null);
        onSelect(null, null);
      }
      
      if (selectedLocation && inputValue !== selectedStation?.name) {
        const filtered = selectedLocation.stations.filter(station =>
          station.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        if (filtered.length > 0) return;
      }

      const filtered = locations.filter(location =>
        location.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLocations(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, locations, selectedLocation, selectedStation]);

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setShowStations(true);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleSelectStation = (station: Station) => {
    if (selectedLocation) {
      onSelect(selectedLocation, station,);
      setInputValue(station.name);
      setShowStations(false);
    }
  };

  const handleClearSelection = () => {
    setInputValue("");
    setSelectedLocation(null);
    onSelect(null, null);
    setShowDropdown(true);
    setShowStations(false);
    inputRef.current?.focus();
  };

  const toggleStationDropdown = () => {
    if (selectedLocation) {
      setShowStations(!showStations);
      setShowDropdown(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="group flex items-center border h-[55px] border-gray-300 rounded-lg max-sm:rounded-full focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
        <div className={`pl-3 pr-2 ${error ? 'text-red-500' : 'text-gray-500'} group-focus-within:text-primary`}>
          {icon}
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder={title}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (selectedLocation) {
              setShowStations(true);
              setShowDropdown(false);
            } else {
              setShowDropdown(true);
            }
          }}
          className="w-full py-2 pr-3 rounded-lg outline-none"
          autoComplete="off"
        />

          {selectedLocation && (
                        <span className="font-medium">({selectedLocation.name})</span>

          )}
        <div className="flex items-center gap-1 pr-2">
          {error && <ErrorOutline className="text-red-500" fontSize="small" />}
          {selectedLocation && (
            <button
              onClick={toggleStationDropdown}
              className="p-1 text-gray-500 hover:text-gray-700"
              aria-label={showStations ? "Hide stations" : "Show stations"}
            >
              {showStations ? <ArrowDropUp /> : <ArrowDropDown />}
            </button>
          )}
          {inputValue && (
            <button
              onClick={handleClearSelection}
              className="p-1 text-gray-500 hover:text-red-500"
              aria-label="Clear selection"
            >
              <CancelOutlined fontSize="small" />
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              onClick={() => handleSelectLocation(location)}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <LocationOnOutlined className="mr-2 text-gray-500" fontSize="small" />
              <div className="font-medium">{location.name}</div>
            </div>
          ))}
        </div>
      )}

      {showStations && selectedLocation && (
        <div
          ref={dropdownRef}
          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="sticky top-0 p-2 bg-gray-50 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <LocationOnOutlined className="mr-2 text-primary" fontSize="small" />
                <span className="font-medium">{selectedLocation.name}</span>
              </div>
              <button
                onClick={() => {
                  setShowStations(false);
                  setShowDropdown(true);
                  setSelectedLocation(null);
                  setInputValue("");
                }}
                className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
              >
                <SwapHoriz fontSize="small" className="mr-1" />
                {i18n.t("common.changeLocation")}
              </button>
            </div>
            <input
              type="text"
              placeholder={i18n.t("common.searchStations")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 text-sm border rounded-lg"
            />
          </div>
          
          {selectedLocation.stations
            .filter(station => 
              station.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map(station => (
              <div
                key={station.id}
                onClick={() => handleSelectStation(station)}
                className={`flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  selectedStation?.id === station.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center">
                  <TrainOutlined className="mr-2 text-gray-500" fontSize="small" />
                  <span>{station.name}</span>
                </div>
                {selectedStation?.id === station.id && (
                  <CheckCircleOutline className="text-green-500" fontSize="small" />
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TrainLocationsTextField;