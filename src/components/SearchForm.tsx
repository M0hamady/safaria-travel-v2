import { useTranslation } from "react-i18next";
import { Location, SearchValues } from "../types/types";
import { useEffect, useState } from "react";
import LocationTextField from "./utilies/LocationTextField";
import {
    Search,
    Autorenew,
    SwapHoriz,
    LocationOn,
  } from "@mui/icons-material";
import DatePicker from "./utilies/DatePicker";



interface SearchFormProps {
    searchValues: SearchValues;
    handleInputChange: (field: string, value: string) => void;
    swapLocations: () => void;
    handleSearch: () => void;
    loading: boolean;
    errors: Record<string, boolean>;
    tripType: "one-way" | "round";
    locations: Location[];
  }
  
export const SearchForm: React.FC<SearchFormProps> = ({
    searchValues,
    handleInputChange,
    swapLocations,
    handleSearch,
    loading,
    errors,
    tripType,
    locations,
  }) => {
    const { t, i18n } = useTranslation();
    const [fromLocation, setFromLocation] = useState<Location>();
    const [toLocation, setToLocation] = useState<Location>();
    const lang = i18n.language;
  
    useEffect(() => {
      if (searchValues.from) {
        setFromLocation(
          locations.find((location) => location.id === searchValues.from)
        );
        setToLocation(
          locations.find((location) => location.id === searchValues.to)
        );
      }
    }, [searchValues]);
  
    return (
      <div className="grid grid-cols-1 max-sm:grid-cols-1  md:grid-cols-24 gap-1 max-sm:gap-5 items-center h-fit md:max-h-24 relative ">
        <LocationTextField
          icon={<LocationOn />}
          title={t("searchForm.from")}
          locations={locations}
          onSelect={(location) =>
            location && handleInputChange("from", location.id)
          }
          value={
            fromLocation
              ? lang === "ar"
                ? fromLocation?.name_ar
                : fromLocation?.name
              : ""
          }
          className="col-span-7 max-sm:col-span-12 w-full"
        />
        <button
          onClick={swapLocations}
          className="flex  h-[55px] md:w-[45px] w-[55px] md:m-auto col-span-1 items-center justify-center rounded-sm border-2 hover:bg-gray-300 max-sm:absolute top-[30px] ltr:right-0 rtl:left-3 z-50 bg-white  max-sm:rounded-full "
        >
          <SwapHoriz fontSize="large" className="m-auto" />
        </button>
        <LocationTextField
          icon={<LocationOn />}
          title={t("searchForm.to")}
          locations={locations}
          onSelect={(location) =>
            location && handleInputChange("to", location.id)
          }
          value={
            toLocation
              ? lang === "ar"
                ? toLocation?.name_ar
                : toLocation?.name
              : ""
          }
          className="col-span-7 max-sm:col-span-12 w-full"
        />
        <DatePicker
          label={t("searchForm.departure")}
          value={searchValues.departure}
          onChange={(e) =>{
             handleInputChange("departure", e.target.value)
            console.log(e.target.value);
            }}
          error={errors.departure}
          maxDate={new Date().toISOString().split("T")[0]} // Today's date in YYYY-MM-DD format
          helperText={errors.departure ? t("validation.required") : ""}
          className={`col-span-4 max-sm:col-span-12 w-full ${
            tripType !== "round" && "md:col-span-4"
          }`}
        />
        {tripType !== "round" && <div className="col-span-4 "></div>}
        {tripType === "round" && (
          <DatePicker
            label={t("searchForm.return")}
            value={searchValues.return}
            onChange={(e) => handleInputChange("return", e.target.value)}
            error={errors.return}
            helperText={errors.return ? t("validation.required") : ""}
            className="col-span-4 max-sm:col-span-12"
            beforeVal={searchValues.departure}
          />
        )}
        <button
          onClick={handleSearch}
          className="w-[40px] h-[40px] m-auto max-sm:w-full max-sm:col-span-12 bg-primary hover:bg-primary text-white col-span-1 rounded-full "
          disabled={loading}
        >
          {loading ? (
            <Autorenew className="animate-spin " />
          ) : (
            <Search
              fontSize="medium"
              className="text-white font-thin   text-sm"
            />
          )}
        </button>
      </div>
    );
  };