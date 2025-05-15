import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { Loader } from "../../components/utilies/Loader";
import { useToast } from "../../context/ToastContext";
import { usePrivateTripData } from "../../hooks/usePrivateTripData";
import TripMapSection from "./TripMapSection";
import TripInfoSection from "./TripInfoSection";
import TripBookingSection from "./TripBookingSection";
import AddressSelectionSection from "./AddressSelectionSection";

const PrivateTripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { addToast } = useToast();

  const {
    trip,
    loading,
    error,
    isCreatingTicket,
    handleCreateTicket,
    toggleMapExpansion,
    isMapExpanded,
    addresses
  } = usePrivateTripData(tripId);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="pb-10 bg-[#f8f9fa] min-h-screen">
      <Header />

      <div className="w-full flex flex-col justify-center mt-10  space-y-4">
        {/* <TripMapSection 
          trip={trip} 
          addresses={addresses}
          isMapExpanded={isMapExpanded}
          toggleMapExpansion={toggleMapExpansion}
        /> */}

        <AddressSelectionSection addresses={addresses} />

        <TripInfoSection trip={trip} />

        <TripBookingSection 
          trip={trip}
          isCreatingTicket={isCreatingTicket}
          onCreateTicket={handleCreateTicket}
        />
      </div>
    </div>
  );
};

export default PrivateTripDetailsPage;
