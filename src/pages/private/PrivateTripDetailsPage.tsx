import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateTicketPayload, usePrivateSearchContext } from "../../context/PrivateSearchContext";
import { PrivateTrip } from "../../types/types";
import { Loader } from "../../components/utilies/Loader";
import Header from "../../components/Header";
import { useToast } from "../../context/ToastContext";

const PrivateTripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { 
    searchValues, 
    fetchTripById, 
    createTicket,
    tripType,
    private_trip
  } = usePrivateSearchContext();
  const [trip, setTrip] = useState<PrivateTrip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isCreatingTicket, setIsCreatingTicket] = useState<boolean>(false);
  const navigate = useNavigate();

  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (tripId) {
          const privateTrip = await fetchTripById(tripId);
          if (privateTrip) {
            setTrip(privateTrip);
          } else {
            setError("Trip not found.");
          }
        }
      } catch (err) {
        setError("Something went wrong while fetching the trip.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, searchValues.departure]);
const handleCreateTicket = async () => {
  if (!tripId || !trip) {
    addToast({
      id: Date.now().toString(),
      message: "Invalid trip data. Please refresh and try again.",
      type: "error",
    });
    return;
  }

  if (!searchValues.departure || (tripType === "round" && !searchValues.return)) {
    addToast({
      id: Date.now().toString(),
      message: "Please select both departure and return dates.",
      type: "error",
    });
    return;
  }

  try {
    setIsCreatingTicket(true);

    const ticketPayload: CreateTicketPayload = {
      round: tripType === "round" ? 2 : 1,
      boarding: {
        date: searchValues.departure,
  address_id: Number(trip.from_location.id), // cast to number
      }
    };
      ticketPayload.return = {
        date: searchValues.return,
  address_id: Number(trip.from_location.id), // cast to number
      };

    const response = await createTicket(parseInt(tripId), ticketPayload);

    if (response) {
      addToast({
        id: Date.now().toString(),
        message: "✅ Ticket created successfully!",
        type: "success",
      });
      navigate(`/private-tickets/${response.ticket_id}`);
    } else {
      addToast({
        id: Date.now().toString(),
        message: "❌ Failed to create ticket. Try again.",
        type: "error",
      });
    }
  } catch (err) {
    console.error("Ticket creation error:", err);
    addToast({
      id: Date.now().toString(),
      message: "🚨 An unexpected error occurred.",
      type: "error",
    });
  } finally {
    setIsCreatingTicket(false);
  }
};


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

      <div className="w-full flex flex-col justify-center mt-10 px-8 space-y-2">
        <div className="px-4 py-5 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(217,217,217,0.25)] inline-flex flex-col justify-start items-end gap-5">
          <div className="self-stretch px-5 pb-4 border-b border-[#e8ecf2] inline-flex justify-start items-center gap-0.5">
            <div className="flex-1 self-stretch px-2.5 py-2 rounded-3xl flex justify-start items-start gap-2.5 overflow-hidden">
              <div className="w-6 h-6 relative origin-top-left rotate-180 overflow-hidden">
                <div className="w-[1.60px] h-[0.80px] left-[12.44px] top-[10.81px] absolute bg-[#68696a]" />
                <div className="w-6 h-[9.60px] left-[0.04px] top-[7.21px] absolute bg-[#68696a]" />
              </div>
              <div className="justify-start text-[#68696a] text-base font-normal font-['Cairo'] leading-normal">
                {trip.company_name}
              </div>
            </div>
            <div className="justify-start text-[#0074c3] text-base font-normal font-['Cairo'] leading-normal cursor-pointer">
              Edit
            </div>
          </div>

          {/* Trip details */}
          <div className="w-full flex justify-center mt-10">
            <div className="px-[18px] py-[17px] bg-white rounded-lg shadow-[0px_4px_4px_rgba(217,217,217,0.25)] inline-flex flex-col justify-start items-start gap-4 w-full">
              <div className="w-full inline-flex justify-start items-center gap-[60px]">
                <div className="inline-flex flex-col justify-center items-center gap-4">
                  <img
                    className="w-[139.82px] h-20 object-contain"
                    src={trip.company_logo}
                    alt={trip.company_name}
                  />
                </div>

                <div className="flex-1 inline-flex flex-col justify-center items-start gap-6">
                  <div className="inline-flex justify-start items-center gap-1">
                    <div className="text-[#1e1e1e] text-xl font-medium leading-[30px] font-cairo">
                      {trip.company_name}
                    </div>
                    {/* <div className="text-[#68696a] text-base font-normal leading-normal font-cairo ml-2">
                      {type}
                    </div> */}
                  </div>

                  <div className="self-stretch inline-flex justify-start items-center gap-5">
                    <div className="w-[139.82px] px-2.5 py-2 rounded-3xl flex justify-center items-start gap-2.5 border border-[#ddd]">
                      {/* <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
                        {type}
                      </div> */}
                    </div>

                    <div className="inline-flex flex-col justify-start items-start gap-4">
                      <div className="inline-flex justify-start items-start gap-2">
                        <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
                          {trip.bus.seats_number} seats
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex flex-col justify-start items-start gap-4">
                      <div className="inline-flex justify-start items-start gap-2">
                        {/* <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
                          Luggage: {luggage || "1 large + 1 small"}
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>

                <img
                  className="w-[46.72px] h-12 object-contain"
                  src="https://placehold.co/47x48"
                  alt="icon"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-5 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(217,217,217,0.25)] inline-flex flex-col justify-start items-end gap-5">
          <div className="self-stretch px-5 pb-4 border-b border-[#e8ecf2] inline-flex justify-start items-center gap-0.5">
            <div className="flex-1 self-stretch px-2.5 py-2 rounded-3xl flex justify-start items-start gap-2.5 overflow-hidden">
              <div className="w-6 h-6 relative origin-top-left rotate-180 overflow-hidden">
                <div className="w-[1.60px] h-[0.80px] left-[12.44px] top-[10.81px] absolute bg-[#68696a]" />
                <div className="w-6 h-[9.60px] left-[0.04px] top-[7.21px] absolute bg-[#68696a]" />
              </div>
              <div className="justify-start text-[#68696a] text-base font-normal font-['Cairo'] leading-normal">
                {trip.company_name}
              </div>
            </div>
            <div className="justify-start text-[#0074c3] text-base font-normal font-['Cairo'] leading-normal cursor-pointer">
              Edit
            </div>
          </div>

          <div className="self-stretch px-5 pb-4 border-b border-[#e8ecf2] inline-flex justify-start items-start gap-[87px]">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
              <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
                {trip.date}
              </div>
              <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
                {trip.from_location?.name} - {trip.to_location?.name}
              </div>
            </div>
            <div className="inline-flex flex-col justify-start items-start gap-2">
              <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
                Ticket Price
              </div>
              <div className="justify-start text-[#0074c3] text-base font-medium font-['Cairo']">
                {trip.price} EGP
              </div>
            </div>
          </div>

          {/* Optional second row: Duplicate if showing return trip or second time */}
          {/* You can map if there's multiple entries */}
          <div className="self-stretch px-5 pb-4 border-b border-[#e8ecf2] inline-flex justify-start items-start gap-[87px]">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
              <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
                {trip.date}
              </div>
              <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
                {trip.from_location?.name} - {trip.to_location?.name}
              </div>
            </div>
            <div className="inline-flex flex-col justify-start items-start gap-2">
              <div className="justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
                Ticket Price
              </div>
              <div className="justify-start text-[#0074c3] text-base font-medium font-['Cairo']">
                {trip.price} EGP
              </div>
            </div>
          </div>

          <div className="self-stretch px-5 pb-5 flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-start items-start gap-4 overflow-hidden">
              <div className="flex-1 justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
                Discount
              </div>
              <div className="justify-start text-[#0074c3] text-base font-medium font-['Cairo']">
                {trip.discount || "0.00"} EGP
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-4 overflow-hidden">
              <div className="flex-1 justify-start text-[#1e1e1e] text-base font-normal font-['Cairo'] leading-normal">
                Tax Included
              </div>
              <div className="justify-start text-[#0074c3] text-base font-medium font-['Cairo']">
                {trip.go_price || "0.00"} EGP
              </div>
            </div>
            <div className="self-stretch inline-flex justify-center items-center gap-4">
              <div className="flex-1 justify-start text-[#1e1e1e] text-xl font-medium font-['Cairo'] leading-[30px]">
                Total
              </div>
              <div className="justify-start text-[#0074c3] text-base font-semibold font-['Cairo']">
                {(Number(trip.price) + Number(trip.go_price || 0)).toFixed(2)}{" "}
                EGP
              </div>
            </div>
          </div>

          <div className="w-[183px] inline-flex justify-end items-center" >
            <div className="flex-1 h-[54px] p-4 bg-[#0074c3] rounded-[9px] shadow-[0px_4px_4px_0px_rgba(217,217,217,0.25)] flex justify-center items-center gap-2 cursor-pointer">
              <div className="justify-start text-white text-xl font-medium font-['Cairo'] leading-[30px]" onClick={handleCreateTicket}>
                Pay Now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateTripDetailsPage;
