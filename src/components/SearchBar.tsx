import { JSX, useContext, useEffect, useState } from "react";
import { useSearchContext } from "../context/SearchContext";
import { usePrivateSearchContext } from "../context/PrivateSearchContext";
import { useTranslation } from "react-i18next";
import { TransportSelector } from "./TransportSelector";
import { TripTypeSelector } from "./TripTypeSelector";
import { SearchForm } from "./SearchForm";
import { TransportProgress } from "./TransportProgress";
import { useSearchType } from "../context/SearchTypeContext";
import { useToast } from "../context/ToastContext";
import { SearchValues } from "../types/types";
import { useNavigate } from "react-router-dom";
import { TrainsContext } from "../context/TrainsContext";

const SearchBar = () => {
  const { searchType, setSearchType } = useSearchType();
  const busContext = useSearchContext();
  const privateContext = usePrivateSearchContext();
  const navigate = useNavigate();

  // Rename private context values with _private suffix
  const {
    searchValues: privateSearchValues,
    handleInputChange: handleInputChange_private,
    swapLocations: swapLocations_private,
    handleSearch: handleSearch_private,
    loading: loading_private,
    errors: errors_private,
    tripType: tripType_private,
    setTripType: setTripType_private,
    locations: locations_private,
  } = privateContext;
    const { searchTrips,      loading: loading_train, } = useContext(TrainsContext);
  
  // State for each context value
  const [currentSearchValues, setCurrentSearchValues] = useState<SearchValues>(
    searchType === "bus" ? busContext.searchValues : privateSearchValues
  );
  const [currentTripType, setCurrentTripType] = useState<"one-way" | "round">(
    searchType === "bus" ? busContext.tripType : tripType_private
  );
  const [currentLocations, setCurrentLocations] = useState(
    searchType === "bus" ? busContext.locations : locations_private
  );

  // Select the correct context based on searchType
  const activeContext = searchType === "bus" ? busContext : privateContext;

  const [showNoReturnTripWarning, setShowNoReturnTripWarning] = useState(false);
  const { t } = useTranslation();
  const { addToast } = useToast();

  // Handle trip type changes
  useEffect(() => {
    const handleTripTypeChange = () => {
      // Reset return date when switching to one-way
      if (currentTripType === "one-way") {
        setCurrentSearchValues((prev) => ({
          ...prev,
          return: "",
        }));
      }
    };

    handleTripTypeChange();
  }, [currentTripType]);

  // Handle search type changes (bus/private)
  useEffect(() => {
    setCurrentSearchValues(
      searchType === "bus" ? busContext.searchValues : privateSearchValues
    );
    setCurrentTripType(
      searchType === "bus" ? busContext.tripType : tripType_private
    );
    setCurrentLocations(
      searchType === "bus" ? busContext.locations : locations_private
    );

    // Add transport selection guide
    addToast({
      id: "transport-selection",
      message: t(`toast.${searchType}_selection_info`),
      type: "info",
    });
  }, [searchType]);

  // Handle departure date changes
  useEffect(() => {
    if (currentSearchValues.departure && currentTripType === "round") {
      addToast({
        id: "return-date-reminder",
        message: t("toast.please_select_return_date"),
        type: "warning",
      });
    }
  }, [currentSearchValues.departure, currentTripType, t]);
  useEffect(() => {
    if (!currentLocations) {
      console.log(currentLocations);
      if (searchType === "bus") {
        setCurrentLocations(busContext.locations);
      }
    }
  }, []);
  useEffect(() => {
    if (currentLocations) {
      if (searchType === "bus") {
        setCurrentLocations(busContext.locations);
      } else {
        setCurrentLocations(locations_private);
      }
    }
  }, [busContext.locations, locations_private]);
  useEffect(() => {
    if (searchType === "bus") {
      setCurrentTripType(busContext.tripType);
    }
    if (searchType === "private") {
      setCurrentTripType(tripType_private);
    }
  }, [busContext.tripType, tripType_private]);
  useEffect(() => {
    if (searchType === "bus") {
      setCurrentSearchValues(busContext.searchValues);
    }
  }, [busContext]);
  useEffect(() => {
    if (searchType === "private") {
      setCurrentSearchValues(privateSearchValues);
    }
  }, [privateContext]);
  useEffect(() => {
    if (window.location.pathname === "/bus-search") {
      if (busContext.trips) {
        if (searchType === "bus") {
          if (
            busContext.trips.length > 0 &&
            busContext.returnTrips.length === 0 &&
            !busContext.reservationDataReturn &&
            !busContext.reservationData
          ) {
            navigate("/bus-search");
          } else if (!busContext.searchValues.departure) {
            navigate("/");
          }
        }
      }
    }
  }, [busContext.searchValues, busContext.trips]);
  useEffect(() => {
    const depLocation = currentSearchValues.from;
    const retLocation = currentSearchValues.to;

    if (locations_private.length === 0) return;
    const val_depature = busContext.locations.find(
      (loc) => loc.id === depLocation
    );
    const val_return = busContext.locations.find(
      (loc) => loc.id === retLocation
    );
    const fromMatch = locations_private.find(
      (loc) => loc.name === val_depature?.name
    );
    const toMatch = locations_private.find(
      (loc) => loc.name === val_return?.name
    );

    if (fromMatch) {
      console.log(1);
      handleInputChange_private("from", fromMatch.id); // 👈 convert to string
      console.log(2);
    }

    if (toMatch) {
      handleInputChange_private("to", toMatch.id); // 👈 convert to string
    }
  }, [searchType, setSearchType]);

  // Warn about no return trip
  useEffect(() => {
    if (currentTripType === "round" && !currentSearchValues.return) {
      setShowNoReturnTripWarning(true);
      addToast({
        id: "no-return-warning",
        message: t("warning_select_return_trip"),
        type: "warning",
      });
    } else {
      setShowNoReturnTripWarning(false);
    }
  }, [currentTripType, currentSearchValues.return, t]);

  return (
    <div className="bg-white w-full md:h-44 shadow-lg rounded-xl p-6 md:px-6 md:py-2 space-y-2 -translate-y-96 max-sm:-translate-y-36">
      <TransportSelector
        selectedTransport={searchType}
        setSelectedTransport={setSearchType}
      />

      <div className="md:hidden">
        <TransportProgress
          selectedTransport={searchType}
          setSelectedTransport={setSearchType}
        />
      </div>

      <div className="md:hidden">
        <TripTypeSelector
          tripType={currentTripType}
          setTripType={
            searchType === "bus" ? busContext.setTripType : setTripType_private
          }
        />
      </div>

      <SearchForm
        searchValues={currentSearchValues}
        handleInputChange={
          searchType === "bus"
            ? busContext.handleInputChange
            : handleInputChange_private
        }
        swapLocations={
          searchType === "bus"
            ? busContext.swapLocations
            : swapLocations_private
        }
        handleSearch={
          searchType === "bus" ? busContext.handleSearch : searchType === "private"  ?  handleSearch_private  : searchTrips 
         }
        loading={busContext.loading || loading_private || loading_train}
        errors={searchType === "bus" ? busContext.errors : errors_private}
        tripType={currentTripType}
        locations={currentLocations}
      />

      <div className="max-md:hidden">
        <TripTypeSelector
          tripType={currentTripType}
          setTripType={
            searchType === "bus" ? busContext.setTripType : setTripType_private
          }
        />
      </div>
    </div>
  );
};

export default SearchBar;
