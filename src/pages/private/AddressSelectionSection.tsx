import React, { useEffect, useRef, useState } from "react";
import { Address } from "../../types/privateTypes";
import { AddLocation, Cancel } from "@mui/icons-material";
import { useToast } from "../../context/ToastContext";
import AddressCard from "../../components/utilies/AddressCard";
import EgyptMapSelector from "../../pages/private/EgyptMapSelector";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { usePrivateTripDataContext } from "../../context/PrivateTripDataContext";
import { useNavigate } from "react-router-dom";
import { usePrivateSearchContext } from "../../context/PrivateSearchContext";
import DatePicker from "../../components/utilies/DatePicker";

type Props = {
  addresses: Address[];
};

const AddressSelectionSection: React.FC<Props> = ({ addresses }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    boardingAddressId,
    setBoardingAddressId,
    boardingDateTime,
    setBoardingDateTime,
    returnAddressId,
    setReturnAddressId,
    returnDateTime,
    setReturnDateTime,
    fetchAddresses
  } = usePrivateTripDataContext();

  const {
    searchValues,
    tripType,
    fetchLocations
  } = usePrivateSearchContext();
  const dialogRef = useRef<HTMLDivElement>(null);


  const [mapDialogType, setMapDialogType] = useState<"boarding" | "return" | null>(null);
  const [boardingAddress, setBoardingAddress] = useState<Address | undefined>();
  const [returnAddress, setReturnAddress] = useState<Address | undefined>();
  useEffect(() => {
    if (mapDialogType && dialogRef.current) {
      dialogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [mapDialogType]);
  // Initial datetime setup
  useEffect(() => {
    fetchAddresses()
    if (searchValues?.departure) {
      const formatted = dayjs(searchValues.departure).format("YYYY-MM-DDTHH:mm");
      const formatted2 = dayjs(searchValues.return).format("YYYY-MM-DDTHH:mm");
      setBoardingDateTime(formatted);
      if (tripType === "round") {
        setReturnDateTime(formatted2);
      }
    }
  }, []);

  // Set full address objects
  useEffect(() => {
    if (!addresses) {
      navigate("/login", { replace: true });
      return;
    }

    if (boardingAddressId) {
      const found = addresses.find(a => `${a.id}` === boardingAddressId);
      setBoardingAddress(found);
    }

    if (returnAddressId) {
      const found = addresses.find(a => `${a.id}` === returnAddressId);
      setReturnAddress(found);
    }
  }, [boardingAddressId, returnAddressId, addresses]);

  const handleMapSelect = async (id: string) => {
      const savedString = localStorage.getItem('privateAddresses');

    let saved: Address[] = [];
      if (savedString) {
        try {
          saved = JSON.parse(savedString) as Address[];
        } catch (e) {
          console.error('Failed to parse privateAddresses from localStorage', e);
          saved = [];
        }
      }
    if (mapDialogType === "boarding") {
      await fetchAddresses(); // Wait until addresses are updated

      setBoardingAddressId(id);

      // OPTIONAL: Add small artificial delay if needed
      await new Promise(res => setTimeout(res, 1000));

     
      let selectedAddress : Address | undefined;
      if (saved !== addresses){

         selectedAddress = saved.find(address_ => String(address_.id) === String(id));
      }else {
         selectedAddress = addresses.find(address_ => String(address_.id) === String(id));

      }

      if (selectedAddress) {
        console.log("--------------------");
        setBoardingAddress(selectedAddress);
      }

      addToast({ message: t("address.boardingSet"), type: "success" });
    } else {
      setReturnAddressId(id);
      await new Promise(res => setTimeout(res, 1000));


let selectedAddress : Address | undefined;
      if (saved !== addresses){
        
         selectedAddress = saved.find(address_ => String(address_.id) === String(id));
      }else {
         selectedAddress = addresses.find(address_ => String(address_.id) === String(id));

      }
      if (selectedAddress) {
        console.log("--------------------");
        setReturnAddress(selectedAddress);
      }

      addToast({ message: t("address.returnSet"), type: "success" });
    }
    console.log(saved[0].id  === saved[0].id );
    console.log(addresses[0].id, saved[0].id );
    if (saved[0].id !== addresses[0].id) {
            await new Promise(res => setTimeout(res, 300));

      window.location.reload();
    }
    setMapDialogType(null);
  };

  const renderDateTimeInput = (
    value: string,
    onChange: (v: string) => void,
    label: string,
    minDate?: string
  ) => {
    const getCurrentTime = (): string => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    };

    const handleContainerClick = () => {
      if (!value) return;

      const [datePart] = value.split('T');
      const newTime = getCurrentTime();
      const updatedDateTime = `${datePart}T${newTime}`;

      onChange(updatedDateTime);
    };

    return (
      <div
        className="flex flex-col space-y-1 cursor-pointer"
        onClick={handleContainerClick}
      >
        <label className="text-sm text-gray-600">{label}</label>
        <input
          type="datetime-local"
          className="w-full border px-3 py-2 rounded-lg text-sm"
          value={value}
          min={value}
          max={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()} // Prevent input click from triggering div click
        />
      </div>
    );
  };


  const renderAddressSelect = (
    label: string,
    value: string | null,
    onChange: (id: string) => void,
    excludeId?: string
  ) => (
    <div className="flex flex-col space-y-2">
      <label className="sr-only" htmlFor={`select-${label.toLowerCase()}`}>
        {t("select")} {label}
      </label>

      <button
        type="button"
        onClick={() =>
          setMapDialogType(label.toLowerCase().includes("boarding") ? "boarding" : "return")
        }
        className="flex items-center text-blue-600 hover:text-blue-800 text-xs py-1"
      >
        <AddLocation className="mr-1 text-base" />
        {t("address.addNew")}
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-2xl mx-auto w-full z-50">
      <h2 className="text-xl font-bold text-gray-800">{t("address.sectionTitle")}</h2>

      {/* Boarding Section */}
      <div className="space-y-4 max-">
        <div className="flex justify-between items-center">
          <label className="text-base text-gray-700 ">{t("address.boardingLabel")}</label>
          {boardingAddressId && (
            <button
              onClick={() =>
                setMapDialogType("boarding")
              }
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {t("common.change")}
            </button>
          )}
        </div>

        {!boardingAddressId
          ? renderAddressSelect(t("address.boarding"), boardingAddressId, setBoardingAddressId)
          : boardingAddress && (
            <AddressCard
              address={boardingAddress}
              onEdit={() => {
                setBoardingAddressId(null)
                setMapDialogType("boarding")
              }}
              variant="primary"
            />
          )}
        {boardingAddressId && (
          <DatePicker
            label={t("address.boardingDate")}
            value={boardingDateTime}
            type="datetime-local"
            onChange={(e) => setBoardingDateTime(e.target.value)}
            minDate={boardingDateTime}
            error={false}
            maxDate={boardingDateTime}
            helperText=""
            required
            fullWidth
          />
        )}

        {/* {boardingAddressId &&
          renderDateTimeInput(
            boardingDateTime,
            setBoardingDateTime,
            t("address.boardingDate"),
            dayjs().format("YYYY-MM-DDTHH:mm")
          )} */}
      </div>

      {/* Return Section */}
      {(tripType === "round" || boardingAddressId) && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-base text-gray-700">{t("address.returnLabel")}</label>
            {returnAddressId && (
              <button
                onClick={() => {
                  setReturnAddressId(null)

                  setMapDialogType("return")
                }}
                className="text-sm text-green-600 hover:text-green-800 underline"
              >
                {t("common.change")}
              </button>
            )}
          </div>

          {!returnAddressId
            ? renderAddressSelect(
              t("address.return"),
              returnAddressId,
              setReturnAddressId,
              boardingAddressId ?? undefined
            )
            : returnAddress && (
              <AddressCard
                address={returnAddress}
                onEdit={() => {
                  setReturnAddressId(null)
                  setMapDialogType("return")
                }

                }
                variant="secondary"
              />
            )}
          {tripType === "round" && returnAddressId && (
            <DatePicker
              label={t("address.returnDate")}
              value={returnDateTime}
              type="datetime-local"
              onChange={(e) => setReturnDateTime(e.target.value)}
              minDate={returnDateTime}
              error={false}
              maxDate={returnDateTime}
              helperText=""
              required
              fullWidth
            />
          )}

        </div>
      )}

      {/* Map Dialog */}
      {mapDialogType && (
        <div
          ref={dialogRef}
          className="fixed inset-0 inset-y-8 z-50 flex items-center mt-5 max-sm:items-start justify-center bg-black bg-opacity-50 overflow-y-auto"
        >          {/* if this run scroll to it auutomaticaaly by giving it is  */}
          <div className="bg-white rounded-lg absolute top-12 mx-auto shadow-lg w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] flex flex-col max-sm:h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <AddLocation className="text-blue-500" />
                {mapDialogType === "boarding"
                  ? t("address.pickBoarding")
                  : t("address.pickReturn")}
              </h3>
              <button onClick={() => setMapDialogType(null)} className="text-gray-500 hover:text-red-500">
                <Cancel />
              </button>
            </div>
            <EgyptMapSelector onSelect={handleMapSelect} mapDialogType={mapDialogType} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelectionSection;
