import React, { useContext, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { TrainsContext } from "../../context/TrainsContext";
import { TripDetailsSection } from "./TripDetailsSection";
import { TrainInfoSection } from "./TrainInfoSection";
import { TicketBookingForm } from "./TicketBookingForm";
import { TripHeader } from "./TripHeader";
import { Helmet } from "react-helmet-async";

const TrainTripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation();
  const { trips, bookTicket, loading, error } = useContext(TrainsContext);

  const trip = trips.find((t) => t.id === Number(tripId));

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "form-section-train-reserve") {
      const target = document.getElementById(hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 100); // slight delay ensures DOM is ready
      }
    }
  }, [location]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-red-500 font-semibold text-lg">
        {error}
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-gray-600 font-medium text-lg">
        Trip not found.
      </div>
    );
  }

  const handleBook = async (
    nationalId: string,
    seatsNo: number,
    classId: string
  ) => {
    await bookTicket(`${trip.id}`, {
      national_id: nationalId,
      seats_no: seatsNo,
      coach_class_id: classId,
    });
  };

  return (
    <main className="grid grid-cols-1 gap-9 space-y-12 pb-6">
      <Helmet>
        <title>{`Train from ${trip.station_from.name} to ${trip.station_to.name}`}</title>
        <meta
          name="description"
          content={`Book your train from ${trip.station_from.name} to ${trip.station_to.name}. Departure: ${trip.start_time}, Arrival: ${trip.finish_time}`}
        />
        <meta
          name="keywords"
          content="train booking, railway tickets, travel, transportation"
        />
        <meta
          property="og:title"
          content={`Train from ${trip.station_from.name} to ${trip.station_to.name}`}
        />
        <meta
          property="og:description"
          content={`Journey from ${trip.station_from.name} to ${trip.station_to.name}, departure at ${trip.start_time}. Book your seat now.`}
        />
        <meta property="og:image" content="URL_TO_TRAIN_IMAGE" />
        <meta
          name="twitter:title"
          content={`Train from ${trip.station_from.name} to ${trip.station_to.name}`}
        />
        <meta
          name="twitter:description"
          content={`Start your journey from ${trip.station_from.name} to ${trip.station_to.name}, departure at ${trip.start_time}`}
        />
      </Helmet>

      <TripHeader />

      <section aria-labelledby="trip-details">
        <TripDetailsSection trip={trip} />
      </section>

      {/* <section aria-labelledby="train-info">
        <TrainInfoSection trip={trip} />
      </section> */}

      <section
        aria-labelledby="ticket-booking-form"
        id="form-section-train-reserve"
      >
        <TicketBookingForm onBook={handleBook} loading={loading} />
      </section>
    </main>
  );
};

export default TrainTripDetailsPage;
