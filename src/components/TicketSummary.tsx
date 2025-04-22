import React from 'react';
import { useTranslation } from 'react-i18next';

interface TicketSummaryProps {
  selectedTrip: any;
  seatsSelected: any[];
  handleNextStep: () => void;
}

const TicketSummary: React.FC<TicketSummaryProps> = ({
  selectedTrip,
  seatsSelected,
  handleNextStep,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold">{t("Ticket Summary")}</h2>
      <p>
        {t("Company")}: {selectedTrip?.company_data.name}
      </p>
      <p>
        {t("Bus Code")}: {selectedTrip?.bus.code}
      </p>
      <p>
        {t("From")}: {selectedTrip?.cities_from[0]?.name}
      </p>
      <p>
        {t("To")}: {selectedTrip?.cities_to[0]?.name}
      </p>
      <p>
        {t("Seats")}:{" "}
        {seatsSelected?.map((seat) => `Seat ${seat.id}`).join(", ")}
      </p>
      <button
        onClick={handleNextStep}
        className="mt-4 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary"
      >
        {t("Next: Confirm Reservation")}
      </button>
    </div>
  );
};

export default TicketSummary;
