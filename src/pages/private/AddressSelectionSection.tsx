import React, { useState, useEffect } from "react";
import { Address } from "../../types/privateTypes";
import { usePrivateSearchContext } from "../../context/PrivateSearchContext";
import { usePrivateTripData } from "../../hooks/usePrivateTripData";
import AddressCard from "../../components/utilies/AddressCard";
import { AddLocation, Cancel } from "@mui/icons-material";
import EgyptMapSelector from "../../pages/private/EgyptMapSelector";
import { useToast } from "../../context/ToastContext";
import dayjs from "dayjs";

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

  const [boardingDateTime, setBoardingDateTime] = useState<string>(() => {
    const stored = localStorage.getItem("boardingDateTime");
    return stored ? dayjs(stored).format("YYYY-MM-DDTHH:mm") : "";
  });
  const [returnDateTime, setReturnDateTime] = useState<string>(() => {
    const stored = localStorage.getItem("returnDateTime");
    return stored ? dayjs(stored).format("YYYY-MM-DDTHH:mm") : "";
  });

  // persist date-times
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

  const boardingAddress = addresses.find((a) => `${a.id}` === boardingAddressId);
  const returnAddress = addresses.find((a) => `${a.id}` === returnAddressId);

  // avoid same return
  useEffect(() => {
    if (tripType === "round" && boardingAddressId && returnAddressId === boardingAddressId) {
      const alt = addresses.find((a) => `${a.id}` !== boardingAddressId);
      if (alt) setReturnAddressId(`${alt.id}`);
    }
  }, [boardingAddressId, returnAddressId, tripType, addresses]);

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
        <option value="">اختر {label}</option>
        {addresses
          .filter((addr) => `${addr.id}` !== excludeId)
          .map((addr) => (
            <option key={addr.id} value={addr.id}>
              {addr.value}
            </option>
          ))}
      </select>
      <button
        onClick={() => setMapDialogType(label === "عنوان الركوب" ? "boarding" : "return")}
        className="flex items-center justify-center space-x-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm py-2"
      >
        <AddLocation className="text-lg sm:text-xl" />
        <span>إضافة عنوان جديد</span>
      </button>
    </div>
  );

  return (
    <div className="bg-white relative rounded-xl shadow-lg p-4 sm:p-6 space-y-6 max-w-md sm:max-w-2xl mx-auto w-full border border-gray-100 overflow-x-auto">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800">إعدادات العناوين</h2>

      {/* Boarding Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <label className="text-sm sm:text-base text-gray-700">عنوان الركوب</label>
          {boardingAddressId && (
            <button
              onClick={() => setBoardingAddressId(null)}
              className="self-start sm:self-auto text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline"
            >
              تغيير
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
          renderDateTimeInput(boardingDateTime, setBoardingDateTime, "موعد الركوب")}
      </div>

      {/* Return Section */}
      {(tripType === "round" || boardingAddressId) && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <label className="text-sm sm:text-base text-gray-700">عنوان العودة</label>
            {returnAddressId && (
              <button
                onClick={() => setReturnAddressId(null)}
                className="self-start sm:self-auto text-xs sm:text-sm text-green-600 hover:text-green-800 underline"
              >
                تغيير
              </button>
            )}
          </div>

          {!returnAddressId
            ? renderAddressSelect(
                "عنوان العودة",
                returnAddressId,
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

          {tripType === "round" &&
            returnAddressId &&
            renderDateTimeInput(returnDateTime, setReturnDateTime, "موعد العودة")}
        </div>
      )}

      {/* Custom Modal */}
      {mapDialogType && (
        <div className="  inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50  top-0">
          <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="text-lg font-medium">
                <AddLocation className="inline text-blue-500 mr-2" />
                {mapDialogType === "boarding" ? "اختيار عنوان الركوب" : "اختيار عنوان العودة"}
              </h3>
              <button onClick={() => setMapDialogType(null)} className="text-gray-500 hover:text-gray-700">
                <Cancel />
              </button>
            </div>
            <div className="p-0 h-[60vh] sm:h-96">
              <EgyptMapSelector />
            </div>
            <div className="px-4 py-2 border-t text-right">
              <button
                onClick={() => setMapDialogType(null)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelectionSection;
