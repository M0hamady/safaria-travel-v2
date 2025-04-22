import { useContext, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSearchContext } from "../../../context/SearchContext";
import { AuthContext } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import ReservationLayout from "../../../components/ReservationLayout";
import TripProgressTracker from "../../../components/TripProgressTracker";

const TripDetailsPageReturn = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { seatingStructure, seats, selectedSeatsReturn, loading, fetchTripDetailsReturn, generateSalonLayoutReturn,tripType,tripCycleStep, roundTripCycleStep  } = useSearchContext();
  const salonRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (tripId) {
      fetchTripDetailsReturn(tripId);
    }
  }, [tripId]);

  useEffect(() => {
    if (!loading && salonRef.current) {
      setTimeout(() => {
        salonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [loading]);

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    );
  }

  if (!seatingStructure || !seats) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Trip not found
      </motion.div>
    );
  }

  return (
    <ReservationLayout>

    <div className="p-8 bg-gray-50 min-h-screen">

      <motion.div
        className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Trip Details</h1>

        {/* Seat Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Seat Selection</h2>
          <motion.div
            ref={salonRef}
            className="salon-layout bg-gray-100 p-4 rounded-lg transition-transform duration-500 ease-in-out transform"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {generateSalonLayoutReturn()}
          </motion.div>
        </div>

        {/* Summary Section */}
        {selectedSeatsReturn.length > 0 && (
          <motion.div
            className="mt-6 p-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-bold mb-3">Summary</h2>
            <p>
              <strong>Selected Seats:</strong> {selectedSeatsReturn.join(", ")}
            </p>
            <p>
              <strong>Total Seats:</strong> {selectedSeatsReturn.length}
            </p>

            {/* Confirm Reservation / Login Button */}
            <motion.button
              onClick={() => {
                if (!isAuthenticated) {
                  const currentPath = window.location.pathname + window.location.search;
                  navigate(`/login?prev=${encodeURIComponent(currentPath)}`);
                } else{

                  navigate(`/confirm-reservation/return`);
                }
              }}
              className={`mt-4 px-6 py-2 rounded-lg font-semibold transition-all ${
                isAuthenticated
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-primary text-white hover:bg-primary"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAuthenticated ? "Confirm Reservation" : "Go to Login"}
            </motion.button>

            {/* Guideline for Unauthenticated Users */}
            {!isAuthenticated && (
              <p className="mt-3 text-sm text-red-600">
                You must log in to confirm your reservation.
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
    </ReservationLayout> 
  );
};

export default TripDetailsPageReturn;
