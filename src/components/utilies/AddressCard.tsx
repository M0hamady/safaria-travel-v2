import React, { useEffect, useState } from "react";
import { Address } from "../../types/privateTypes";
import LocationMap from "./LocationMap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ArrowCircleDown, ArrowCircleUp, AddLocation } from "@mui/icons-material";
import EgyptMapSelector from "../../pages/private/EgyptMapSelector";

type Props = {
  address: Address;
  onEdit?: () => void;
  variant?: "primary" | "secondary";
};

const AddressCard: React.FC<Props> = ({ address, onEdit, variant = "primary" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

  const variantStyles = {
    primary: "border-blue-500 hover:shadow-lg",
    secondary: "border-green-500 hover:shadow-lg",
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);
useEffect(() => {
if (variant ==="primary" ) {
  // setb
}
}, [])

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-md p-4 max-w-md w-full mx-auto flex flex-col border-l-4 duration-700 ${variantStyles[variant]}`}
      >
        {/* Collapsed View */}
        {!isExpanded && (
          <div
            className="flex items-center justify-between cursor-pointer duration-700"
            onClick={toggleExpand}
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {address.map_location.address_name}
              </h3>
              <p className="text-gray-600 text-sm">{address.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <AddLocation className="text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => setMapDialogOpen(true)} />
              <ArrowCircleDown className="text-gray-500" />
              <span className="text-sm text-gray-500">عرض</span>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <>
            <div className="mb-4 duration-700">
              <LocationMap
                latitude={address.map_location.lat}
                longitude={address.map_location.lng}
                markerColor={variant === "primary" ? "#3b82f6" : "#10b981"}
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {address.map_location.address_name}
            </h3>
            <p className="text-gray-700 font-medium mb-4">{address.name}</p>

            <div className="mt-3 text-gray-600 text-sm space-y-1">
              {address.city && (
                <p className="flex items-start">
                  <strong className="w-20 inline-block">المدينة:</strong>
                  <span className="flex-1">{address.city}</span>
                </p>
              )}
              {address.phone && (
                <p className="flex items-start">
                  <strong className="w-20 inline-block">الهاتف:</strong>
                  <span className="flex-1">{address.phone}</span>
                </p>
              )}
              {address.notes && (
                <p className="flex items-start">
                  <strong className="w-20 inline-block">ملاحظات:</strong>
                  <span className="flex-1">{address.notes}</span>
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
                  onClick={() => setMapDialogOpen(true)}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  <AddLocation className="ml-1" />
                  إضافة مكان جديد
                </button>

                <button
                  onClick={toggleExpand}
                  className="text-gray-500 hover:text-gray-700 flex items-center text-sm duration-700"
                  type="button"
                >
                  <ArrowCircleUp className="ml-1" />
                  إغلاق
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
        <DialogTitle>إضافة عنوان جديد</DialogTitle>
        <DialogContent className="h-96 p-0">
          <EgyptMapSelector locations={[address]} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMapDialogOpen(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddressCard;