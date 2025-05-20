import React, { useEffect, useMemo, useState } from "react";
import { Address } from "../../types/privateTypes";
import LocationMap from "./LocationMap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  AddLocation,
} from "@mui/icons-material";
import EgyptMapSelector from "../../pages/private/EgyptMapSelector";
import { usePrivateTripData } from "../../hooks/usePrivateTripData";
import { useToast } from "../../context/ToastContext";

type Props = {
  address?: Address;
  onEdit?: () => void;
  variant?: "primary" | "secondary";
  tripId?: string;
};

const AddressCard: React.FC<Props> = ({
  address,
  onEdit,
  variant = "primary",
  tripId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

  const {
    boardingAddressId,
    setBoardingAddressId,
    returnAddressId,
    setReturnAddressId,
    addresses,
  } = usePrivateTripData(tripId);

  const { addToast } = useToast();

  // Resolve full address if only id is provided
  const resolvedAddress = useMemo(() => {
    if (address) return address;
    const fallbackId = variant === "primary" ? boardingAddressId : returnAddressId;
    return addresses.find((a) => String(a.id) === String(fallbackId));
  }, [address, addresses, boardingAddressId, returnAddressId, variant]);

  const isSelected = useMemo(() => {
    if (!resolvedAddress) return false;
    return variant === "primary"
      ? String(resolvedAddress.id) === String(boardingAddressId)
      : String(resolvedAddress.id) === String(returnAddressId);
  }, [resolvedAddress, boardingAddressId, returnAddressId, variant]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const handleAddNewLocation = () => setMapDialogOpen(true);

  const handleMapSelect = (id: string) => {
    if (variant === "primary") {
      setBoardingAddressId(id);
      addToast({
        message: "تم تحديد عنوان الركوب",
        type: "success",
        id: "boarding-set",
      });
    } else {
      setReturnAddressId(id);
      addToast({
        message: "تم تحديد عنوان العودة",
        type: "success",
        id: "return-set",
      });
    }
    setMapDialogOpen(false);
  };

  if (!resolvedAddress) return null;

  const variantStyles = {
    primary: "border-blue-500 hover:shadow-lg",
    secondary: "border-green-500 hover:shadow-lg",
  };

  const ringStyles =
    isSelected && variant === "primary"
      ? "ring-2 ring-offset-2 ring-blue-500"
      : isSelected && variant === "secondary"
      ? "ring-2 ring-offset-2 ring-green-500"
      : "";

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-md p-4 max-w-md w-full mx-auto flex flex-col border-l-4 duration-700 ${
          variantStyles[variant]
        } ${ringStyles}`}
      >
        {!isExpanded && (
          <div
            className="flex items-center justify-between cursor-pointer duration-700"
            onClick={toggleExpand}
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {resolvedAddress.map_location.address_name}
              </h3>
              <p className="text-gray-600 text-sm">{resolvedAddress.name}</p>
              {isSelected && (
                <span className="text-xs mt-1 inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {variant === "primary" ? "نقطة الركوب" : "نقطة العودة"}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 ">
             
              <ArrowCircleDown className="text-gray-500" />
              <span className="text-sm text-gray-500">عرض</span>
            </div>
          </div>
        )}

        {isExpanded && (
          <>
            <div className="mb-4 duration-700">
              <LocationMap
                latitude={resolvedAddress.map_location.lat}
                longitude={resolvedAddress.map_location.lng}
                markerColor={variant === "primary" ? "#3b82f6" : "#10b981"}
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {resolvedAddress.map_location.address_name}
            </h3>
            <p className="text-gray-700 font-medium mb-4">
              {resolvedAddress.name}
            </p>

            <div className="mt-3 text-gray-600 text-sm space-y-1">
              {resolvedAddress.city && (
                <p className="flex items-start">
                  <strong className="w-20 inline-block">المدينة:</strong>
                  <span className="flex-1">{resolvedAddress.city}</span>
                </p>
              )}
              {resolvedAddress.phone && (
                <p className="flex items-start">
                  <strong className="w-20 inline-block">الهاتف:</strong>
                  <span className="flex-1">{resolvedAddress.phone}</span>
                </p>
              )}
              {resolvedAddress.notes && (
                <p className="flex items-start">
                  <strong className="w-20 inline-block">ملاحظات:</strong>
                  <span className="flex-1">{resolvedAddress.notes}</span>
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 duration-700">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    variant === "primary"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  } transition-colors`}
                  type="button"
                >
                  تعديل العنوان
                </button>
              )}

              <div className="flex items-center space-x-4">


                <button
                  onClick={toggleExpand}
                  className="text-gray-500 hover:text-gray-700 flex items-center text-sm duration-700 space-x-4"
                  type="button"
                >
                  <ArrowCircleUp className="ml-1" />
                  <span >

                  إغلاق
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Map Selector Dialog */}
      <Dialog
        open={mapDialogOpen}
        onClose={() => setMapDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {variant === "primary" ? "اختر عنوان الركوب" : "اختر عنوان العودة"}
        </DialogTitle>
        <DialogContent className="h-[70vh] p-0">
          <EgyptMapSelector locations={addresses} onSelect={handleMapSelect} mapDialogType=   {variant === "primary" ? "boarding" : "return"} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMapDialogOpen(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddressCard;
