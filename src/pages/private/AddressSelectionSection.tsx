import React, { useState, useEffect } from "react";
import { Address } from "../../types/privateTypes";
import { usePrivateSearchContext } from "../../context/PrivateSearchContext";
import { usePrivateTripData } from "../../hooks/usePrivateTripData";
import AddressCard from "../../components/utilies/AddressCard";
import { AddLocation, Cancel } from "@mui/icons-material";
import EgyptMapSelector from "../../pages/private/EgyptMapSelector";
import { useToast } from "../../context/ToastContext";
import dayjs from "dayjs";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  addresses: Address[];
  tripId?: string;
};

const AddressSelectionSection: React.FC<Props> = ({ addresses, tripId }) => {
  const { tripType } = usePrivateSearchContext();
  const {
    boardingAddressId,
    setBoardingAddressId,
    returnAddressId,
    setReturnAddressId,
    addNewAddress,
  } = usePrivateTripData(tripId);
  const { addToast } = useToast();

  const [mapDialogType, setMapDialogType] = useState<"boarding" | "return" | null>(null);
  const { t } = useTranslation();

  // Date-time state
  const [boardingDateTime, setBoardingDateTime] = useState<string>(() => {
    const stored = localStorage.getItem("boardingDateTime");
    return stored ? dayjs(stored).format("YYYY-MM-DDTHH:mm") : "";
  });
  const [returnDateTime, setReturnDateTime] = useState<string>(() => {
    const stored = localStorage.getItem("returnDateTime");
    return stored ? dayjs(stored).format("YYYY-MM-DDTHH:mm") : "";
  });

  // Persist date-times
  useEffect(() => {
    if (boardingDateTime) {
      localStorage.setItem("boardingDateTime", dayjs(boardingDateTime).toISOString());
    }
  }, [boardingDateTime]);

  useEffect(() => {
    if (returnDateTime) {
      localStorage.setItem("returnDateTime", dayjs(returnDateTime).toISOString());
    }
  }, [returnDateTime]);

  // Persist and listen for boarding/return IDs in localStorage
  useEffect(() => {
    // Write to localStorage whenever IDs change
    if (boardingAddressId) {
      localStorage.setItem("boardingAddressId", boardingAddressId);
    } 
    if (returnAddressId) {
      localStorage.setItem("returnAddressId", returnAddressId);
    } 
    
  }, [boardingAddressId, returnAddressId]);

  useEffect(() => {
    // On mount, read from localStorage
    const bd = localStorage.getItem("boardingAddressId");
    if (bd) setBoardingAddressId(bd);
    const rd = localStorage.getItem("returnAddressId");
    if (rd) setReturnAddressId(rd);

    // Listen to storage events (other tabs)
    const handler = (e: StorageEvent) => {
      if (e.key === "boardingAddressId") {
        setBoardingAddressId(e.newValue);
      }
      if (e.key === "returnAddressId") {
        setReturnAddressId(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  useEffect(() => {
    // On mount, read from localStorage
    const bd = localStorage.getItem("boardingAddressId");
    if (bd) setBoardingAddressId(bd);
    const rd = localStorage.getItem("returnAddressId");
    if (rd) setReturnAddressId(rd);

    // Listen to storage events (other tabs)
    const handler = (e: StorageEvent) => {
      if (e.key === "boardingAddressId") {
        setBoardingAddressId(e.newValue);
      }
      if (e.key === "returnAddressId") {
        setReturnAddressId(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [setBoardingAddressId, setReturnAddressId]);

  // Avoid same return as boarding
  useEffect(() => {
    if (tripType === "round" && boardingAddressId && returnAddressId === boardingAddressId) {
      const alt = addresses.find((a) => `${a.id}` !== boardingAddressId);
      if (alt) setReturnAddressId(`${alt.id}`);
    }
  }, [boardingAddressId, returnAddressId, tripType, addresses]);

  const boardingAddress = addresses.find((a) => `${a.id}` === boardingAddressId);
  const returnAddress = addresses.find((a) => `${a.id}` === returnAddressId);
  
  // Handlers for map pick
  const handleMapSelect = (id: string) => {
    if (!boardingAddressId) {
      setBoardingAddressId(id);
      addToast({ message: "تم تحديد عنوان الركوب.", type: "success",id:"" });
    } else {
      setReturnAddressId(id);
      addToast({ message: "تم تحديد عنوان العودة.", type: "success",id:"" });
    }
    setMapDialogType(null);
  };

  const renderDateTimeInput = (value: string, onChange: (v: string) => void, label: string) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="datetime-local"
        className="w-full border px-3 py-2 rounded-lg text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

  const renderAddressSelect = (
    label: string,
    value: string | null,
    onChange: (id: string) => void,
    excludeId?: string
  ) => (
    <div className="flex flex-col space-y-2">
      <select
        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{t("اختر")} {t(label)}</option>
        {addresses
          .filter((addr) => `${addr.id}` !== excludeId)
          .map((addr) => (
            <option key={addr.id} value={`${addr.id}`}>
              📍 {addr.value}
            </option>
          ))}
      </select>
      <button
        onClick={() => setMapDialogType(label === "عنوان الركوب" ? "boarding" : "return")}
        className="flex items-center justify-center text-blue-600 hover:text-blue-800 text-xs sm:text-sm py-2"
      >
        <AddLocation className="text-lg sm:text-xl" />
        <span>{t("addNew")}</span>
      </button>
    </div>
  );

  return (
    <div className="bg-white relative rounded-xl shadow-lg p-6 space-y-6 max-w-2xl mx-auto w-full border border-gray-100 overflow-auto">
      <h2 className="text-xl font-bold text-gray-800">{t("address.sectionTitle")}</h2>

      {/* Boarding Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-base text-gray-700">{t("address.boardingLabel")}</label>
          {boardingAddressId && (
            <button
              onClick={() => setBoardingAddressId(null)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
               {t("common.change")}
            </button>
          )}
        </div>
        {!boardingAddressId
          ? renderAddressSelect("عنوان الركوب", boardingAddressId, setBoardingAddressId)
          : boardingAddress && (
              <AddressCard
                address={boardingAddress}
                onEdit={() => setBoardingAddressId(null)}
                variant="primary"
              />
            )}
        {boardingAddressId &&
          renderDateTimeInput(boardingDateTime, setBoardingDateTime, `${t('address.boardingDate')}`)}
      </div>

      {/* Return Section */}
      {(tripType === "round" || boardingAddressId) && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-base text-gray-700">{t("address.returnLabel")}</label>
            {returnAddressId && (
              <button
                onClick={() => setReturnAddressId(null)}
                className="text-sm text-green-600 hover:text-green-800 underline"
              >
                                {t("common.change")}

              </button>
            )}
          </div>
          {!returnAddressId
            ? renderAddressSelect(
`${t("address.return")}`,                 returnAddressId,
                setReturnAddressId,
                boardingAddressId ?? undefined
              )
            : returnAddress && (
                <AddressCard
                  address={returnAddress}
                  onEdit={() => setReturnAddressId(null)}
                  variant="secondary"
                />
              )}
          {tripType === "round" && returnAddressId &&
            renderDateTimeInput(returnDateTime, setReturnDateTime, `${t("address.return")}`)}
        </div>
      )}

      {/* Map Modal */}
      {mapDialogType && (
        <div className="fixed w-screen top-10 h-screen left-0 right-20  z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2 max-h-fit gap-3 flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <AddLocation className="text-blue-500" />
                {mapDialogType === "boarding"
                  ? t("address.pickBoarding")
                  : t("address.pickReturn")}
              </h3>
              <IconButton onClick={() => setMapDialogType(null)}>
                <Cancel />
              </IconButton>
            </div>
            <div className="flex-1 h-fit">
              <EgyptMapSelector locations={addresses} tripId={tripId} onSelect={handleMapSelect} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelectionSection;
