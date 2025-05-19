import React from "react";
import { PrivateTrip } from "../../types/types";
import { TripHeader } from "../../components/private-trip/TripHeader";
import { TripDetailsCard } from "../../components/private-trip/TripDetailsCard";
import { TripPriceSummary } from "../../components/private-trip/TripPriceSummary";

interface TripBookingSectionProps {
  trip: PrivateTrip;
  isCreatingTicket: boolean;
  onCreateTicket: () => Promise<void>;
}

const TripBookingSection: React.FC<TripBookingSectionProps> = ({ 
  trip, 
  isCreatingTicket, 
  onCreateTicket 
}) => {
  const totalPrice = (Number(trip.price) + Number(trip.go_price || 0)).toFixed(2);
  const tripType = localStorage.getItem("privateTripType") ?? "one-way";

  return (
    <div className="px-4 py-5 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(217,217,217,0.25)] inline-flex flex-col justify-start items-end gap-5">
      <TripHeader companyName={trip.company_name} />
{
  tripType=== 'one-way' ?   
  <TripDetailsCard
    date={trip.date}
    fromLocation={trip.from_location?.name || ''}
    toLocation={trip.to_location?.name || ''}
    price={trip.price}
  />
  :
  <>
  <TripDetailsCard
    date={trip.date}
    fromLocation={trip.from_location?.name || ''}
    toLocation={trip.to_location?.name || ''}
    price={trip.round_price}
  />




     
  </>
}

      <TripPriceSummary
        discount={trip.discount || 0}
        tax={0 || 0}
        total={  tripType=== 'one-way' ?`${trip.price}` :   `${trip.round_price}`}
        onPayNow={onCreateTicket}
        isCreatingTicket={isCreatingTicket}
      />
    </div>
  );
};

export default TripBookingSection;