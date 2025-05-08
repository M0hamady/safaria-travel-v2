// pages/TrainTripDetailsPage.tsx
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { TrainsContext } from "../../context/TrainsContext";
import { Trip, TrainClass } from "../../types/trainTypes";

const TrainTripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, bookTicket, loading, error } = useContext(TrainsContext);

  // Convert tripId to number since Trip interface expects id to be number
  const trip = trips.find((t) => t.id === Number(tripId));
  const [nationalId, setNationalId] = useState("");
  const [seatsNo, setSeatsNo] = useState(1);
  const [selectedClassId, setSelectedClassId] = useState("");

  const handleBook = async () => {
    if (!trip || !selectedClassId) return;
    await bookTicket(`${trip.id}`, {
      national_id: nationalId,
      seats_no: seatsNo,
      coach_class_id: selectedClassId,
    });
  };

  if (!trip) return <p>Trip not found.</p>;
  if (loading) return <p>Processing...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Trip Details</h2>
      <p><strong>From:</strong> {trip.station_from.name}</p>
      <p><strong>To:</strong> {trip.station_to.name}</p>
      
      <p><strong>Departure:</strong> {trip.start_time}</p>
      <p><strong>Arrival:</strong> {trip.finish_time}</p>
      <p><strong>Duration:</strong> {trip.duration}</p>
      <p><strong>Distance:</strong> {trip.distance} km</p>
      <p><strong>Starting Price:</strong> {trip.starting_price} EGP</p>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Train Information</h3>
        <p><strong>Train Name:</strong> {trip.train.name}</p>

        <h3 className="font-semibold mb-2 mt-4">Book Ticket</h3>
        <input
          type="text"
          placeholder="National ID"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Number of Seats"
          value={seatsNo}
          min="1"
          max={trip.train.classes.find(c => c.id === selectedClassId)?.availableSeatsCount}
          onChange={(e) => setSeatsNo(Number(e.target.value))}
          className="border p-2 w-full mb-2"
        />
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option value="">Select Class</option>
          {trip.train.classes?.map((trainClass: TrainClass) => (
            <option key={trainClass.id} value={trainClass.id}>
              {trainClass.name} - {trainClass.cost} EGP 
              (Available: {trainClass.availableSeatsCount})
            </option>
          ))}
        </select>
        <button
          onClick={handleBook}
          disabled={!selectedClassId || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default TrainTripDetailsPage;