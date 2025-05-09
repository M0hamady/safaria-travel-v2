import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TrainsContext } from "../../context/TrainsContext";
import ConfirmAndAuthCheck from "../../components/utilies/ConfirmAndAuthCheck";

interface Props {
  onBook: (nationalId: string, seatsNo: number, classId: string) => void;
  loading: boolean;
}

export const TicketBookingForm = ({ onBook, loading }: Props) => {
  const { t } = useTranslation();
  const [nationalId, setNationalId] = useState("");
  const [seatsNo, setSeatsNo] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  const { selectedTrip, selectedClass } = useContext(TrainsContext);
  const maxSeats = 4;

  const handleSubmit = () => {
    const validationErrors: string[] = [];

    if (!nationalId.trim()) validationErrors.push(t("National ID is required."));
    if (!selectedClass?.id) validationErrors.push(t("No class selected."));
    if (seatsNo < 1 || seatsNo > maxSeats)
      validationErrors.push(t("You can book between 1 to {{max}} seats.", { max: maxSeats }));

    setErrors(validationErrors);

    if (validationErrors.length === 0 && selectedClass) {
      onBook(nationalId.trim(), seatsNo, selectedClass.id);
    }
  };

  useEffect(() => {
    if (!loading) {
      setNationalId("");
      setSeatsNo(1);
      setErrors([]);
    }
  }, [loading]);

  if (!selectedTrip || !selectedClass) return null;

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🎫 {t("Book Your Ticket")}</h3>

      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm space-y-1">
          {errors.map((err, idx) => (
            <div key={idx}>• {err}</div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("National ID")}
          </label>
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("Enter your national ID")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Number of Seats")}
          </label>
          <input
            type="number"
            min={1}
            max={maxSeats}
            value={seatsNo}
            onChange={(e) => {
              const value = Math.min(Math.max(Number(e.target.value), 1), maxSeats);
              if (!isNaN(value)) setSeatsNo(value);
            }}
            className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("1 to 4")}
          />
        </div>

        <div className="bg-gray-50 border rounded px-4 py-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{t("Class")}:</span> {selectedClass.name}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{t("Cost")}:</span> {selectedClass.cost} EGP
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{t("Available Seats")}:</span>{" "}
            {selectedClass.availableSeatsCount}
          </p>
        </div>

        <ConfirmAndAuthCheck
          onConfirm={handleSubmit}
          loading={loading}
          label={t("Book Ticket")}
        />
      </div>
    </div>
  );
};
