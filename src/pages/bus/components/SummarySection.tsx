import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface SummarySectionProps {
    selectedSeats: string[];
    isAuthenticated: boolean;
    navigate: (path: string) => void;
    tripType?: "one-way" | "round";
    confirmRef: React.RefObject<HTMLDivElement | null>;
  }
  

const SummarySection: React.FC<SummarySectionProps> = ({
  selectedSeats,
  isAuthenticated,
  navigate,
  tripType,
  confirmRef,
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    const currentPath = window.location.pathname + window.location.search;
    if (!isAuthenticated) {
      navigate(`/login?prev=${encodeURIComponent(currentPath)}`);
    } else if (isAuthenticated && tripType ==="round") {
      navigate(`/bus-search-return`);
    }else{

      navigate(`/confirm-reservation`);
    }
  };

  return (
    <motion.div
      className="mt-8 p-8 bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-8 border-yellow-600 text-yellow-800 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      ref={confirmRef}
    >
      <h2 className="text-2xl font-extrabold mb-4">{t("Summary")}</h2>
      <p className="mb-2">
        <span className="font-bold">{t("Selected Seats")}: </span>
        {selectedSeats.join(", ")}
      </p>
      <p className="mb-4">
        <span className="font-bold">{t("Total Seats")}: </span>
        {selectedSeats.length}
      </p>
      <motion.button
        onClick={handleClick}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-transform ${
          isAuthenticated
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-primary text-white hover:bg-primary"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAuthenticated && tripType === "one-way"
          ? t("Confirm Reservation") : isAuthenticated && tripType !== "one-way"?
           t("Go to return trip")
          : t("Go to Login")}
      </motion.button>
      {!isAuthenticated && (
        <p className="mt-4 text-center text-sm text-red-600">
          {t("You must log in to confirm your reservation.")}
        </p>
      )}
    </motion.div>
  );
};

export default SummarySection;
