import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  JSX,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Location,
  RoundTripCycleStep,
  SearchValues,
  Seat,
  SeatingStructure,
  Station,
  Trip,
  TripCycleStep,
  TripStations,
} from "../types/types";
import images from "../assets";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { TicketOrder, TicketOrderRound } from "../pages/bus/pages/ConfirmReservationPage";
import { useToast } from "./ToastContext";

// Extended interface for filters including cities, stations, and time range
interface TripFilters {
  company?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  cityFrom?: string;
  cityTo?: string;
  stationFrom?: string;
  stationTo?: string;
  timeMin?: number;
  timeMax?: number;
  // New properties for sorting and filtering by story
  sortBy?: string;
  story?: string;
}

interface SearchContextType {
  searchValues: SearchValues;
  setSearchValues: (values: SearchValues) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  errors: Record<string, boolean>;
  setErrors: (errors: Record<string, boolean>) => void;
  tripType: "one-way" | "round";
  setTripType: (type: "one-way" | "round") => void;
  handleInputChange: (field: string, value: string) => void;
  swapLocations: () => void;
  handleSearch: () => void;
  locations: Location[];
  fetchLocations: () => Promise<void>;
  trips: Trip[];
  returnTrips: Trip[];
  selectedTrip?: Trip;
  selectedTripReturn?: Trip;
  setTrips: (trips: Trip[]) => void;
  setSelectedTrip: (trips: Trip) => void;
  // Filter-related state and functions
  tripFilters: TripFilters;
  tripFiltersReturn: TripFilters;
  setTripFilters: (filters: TripFilters) => void;
  setTripFiltersReturn: (filters: TripFilters) => void;
  getFilteredTrips: () => Trip[];
  getFilteredTripsReturn: () => Trip[];
  handleTripSelection: (
    tripId: number,
    fromCityId: number,
    toCityId: number,
    fromLocationId: number,
    toLocationId: number,
    date: string,
    station_from?:Station,
    station_to?:Station,
  ) => void; // Add this line
  handleTripSelectionReturn: (
    tripId: number,
    fromCityId: number,
    toCityId: number,
    fromLocationId: number,
    toLocationId: number,
    date: string,
    station_from?:Station,
    station_to?:Station,
  ) => void; // Add this line
  seatingStructure: SeatingStructure | null;
  seats: Seat[] | null;
  seatsSelected: Seat[] | null;
  seatsSelectedReturn: Seat[] | null;
  selectedSeats: string[];
  selectedSeatsReturn: string[];
  fetchTripDetails: (tripId: string) => void;
  fetchTripDetailsReturn: (tripId: string) => void;
  handleSeatClick: (seat: Seat | undefined) => void;
  getSeatImage: (seat: Seat) => string;
  generateSalonLayout: () => JSX.Element[];
  generateSalonLayoutReturn: () => JSX.Element[];
  tripStations?:TripStations;
  tripStationsReturn?:TripStations;


  tripCycleStep: TripCycleStep;
  setTripCycleStep: (step: TripCycleStep) => void;
  roundTripCycleStep: RoundTripCycleStep;
  setRoundTripCycleStep: (step: RoundTripCycleStep) => void;

  isConfirming: boolean;
  isLoadingPayment: boolean;
  errorMessage: string | null;
  paymentUrl: string | null;
  reservationData: TicketOrder | undefined;
  setReservationData: (reservationData: TicketOrder | undefined) => void;
  setReservationDataReturn: (TicketOrder: TicketOrderRound | undefined) => void;
  reservationDataReturn: TicketOrderRound | undefined;
  confirmationStatus: string | null;
  confirmReservation: ( from_city_id: string,
    to_city_id: string,
    from_location_id: string,
    to_location_id: string,
    date: string) => void;
  confirmReservationReturn: (from_city_id: string,to_city_id: string,
    from_location_id: string,
    to_location_id: string,
    date: string) => void;
  


}



const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [searchValues, setSearchValues] = useState<SearchValues>({
    from: "",
    to: "",
    departure: "",
    return: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({
    from: false,
    to: false,
    departure: false,
    return: false,
  });
  const [tripType, setTripType] = useState<"one-way" | "round">("one-way");
  const [locations, setLocations] = useState<Location[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip>();
  const [selectedTripReturn, setSelectedTripReturn] = useState<Trip>();
  const [tripStations, setTripStations] = useState<TripStations>();
  const [tripStationsReturn, setTripStationsReturn] = useState<TripStations>();
  // New state for extended filtering criteria (including time range)
  const [tripFilters, setTripFilters] = useState<TripFilters>({});
  const [tripFiltersReturn, setTripFiltersReturn] = useState<TripFilters>({});
  const [seatingStructure, setSeatingStructure] =
    useState<SeatingStructure | null>(null);
  const [seats, setSeats] = useState<Seat[] | null>(null);
  const [seatsSelected, setSeatsSelected] = useState<Seat[]>([]);
  const [seatsSelectedReturn, setSeatsSelectedReturn] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedSeatsReturn, setSelectedSeatsReturn] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const [returnTrips, setReturnTrips] = useState<Trip[]>([]);
  const [tripCycleStep, setTripCycleStep] = useState<TripCycleStep>("SEARCHING");
  const [roundTripCycleStep, setRoundTripCycleStep] = useState<RoundTripCycleStep>("SEARCHING");

  const [isConfirming, setIsConfirming] = useState<boolean>(false); // Track if reservation is being processed
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Store error messages
  const [reservationData, setReservationData] = useState<TicketOrder| undefined>();
  const [reservationDataReturn, setReservationDataReturn] = useState<TicketOrderRound | undefined>();
  const [confirmationStatus, setConfirmationStatus] = useState<string | null>(null); // Track reservation status
  const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const clearAllFilters = () => {
    setTripFilters({});
  };
  
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://app.telefreik.com/api/transports/locations"
      );
      const data = await response.json();
      setLocations(data.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPaymentLink = async (reservationId: string) => {
    try {
      setIsLoadingPayment(true);
      setErrorMessage(null);
      const token = user?.api_token;
      const config = {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en",
          Authorization: `Bearer ${token}`,
        },
      };

      const paymentUrl = `https://app.telefreik.com/api/transports/orders/${reservationId}/pay`;
      const response = await axios.post(paymentUrl, null, config);
      const { url } = response?.data?.data;

      if (url) {
        setPaymentUrl(url);
      } else {
        throw new Error("Payment link not found");
      }
    } catch (error: any) {
      setErrorMessage("Failed to fetch payment link. Please retry.");
    } finally {
      setIsLoadingPayment(false);
    }
  };
  const confirmReservation = async (from_city_id: string,
    to_city_id: string,
    from_location_id: string,
    to_location_id: string,
    date: string) => {
    setIsConfirming(true);
    setErrorMessage(null);
  
    try {
      // Prepare the reservation request data
      const reservationRequestData = {
        seats: selectedSeats, // Selected seats
        from_city_id: from_city_id,
        to_city_id: to_city_id,
        from_location_id: from_location_id,
        to_location_id: to_location_id,
        date: date,
        // Add any other required fields for the reservation
      };
  
      // Make the API call to confirm the reservation
      const response = await fetch(
        `https://app.telefreik.com/api/transports/trips/${selectedTrip?.id}/create-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.api_token || localStorage.getItem('authToken') }`, // Assuming you have user authentication
          },
          body: JSON.stringify(reservationRequestData),
        }
      );
  
      if (!response.ok) {
        throw new Error("Reservation failed");
      }
  
      // Update trip cycle steps
      if (tripType === "one-way") {
        if (tripCycleStep === "SELECTING_SEATS") {
          setTripCycleStep("CONFIRMING_RESERVATION");
        }
      } else if (tripType === "round") {
        if (roundTripCycleStep === "SELECTING_RETURN_SEATS") {
          setRoundTripCycleStep("CONFIRMING_RESERVATION");
        }
      }
  
      // Handle the response
      const data = await response.json();
      setReservationData(data.data);
      setConfirmationStatus("Reservation confirmed successfully!");
  
      // Fetch payment link or navigate to the next step
      fetchPaymentLink(data.data.id); // Assuming you have a function to fetch the payment link
    } catch (error) {
      setErrorMessage("Error confirming reservation. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };
  const confirmReservationReturn = async (from_city_id: string,
    to_city_id: string,
    from_location_id: string,
    to_location_id: string,
    date: string) => {
    setIsConfirming(true);
    setErrorMessage(null);
  
    try {
      // Prepare the reservation request data
      const reservationRequestData = {
        seats: selectedSeatsReturn, // Selected seats
        trip_id:reservationData?.id,
        from_city_id: from_city_id,
        to_city_id: to_city_id,
        from_location_id: from_location_id,
        to_location_id: to_location_id ,
        date: date,
        // Add any other required fields for the reservation
      };
  
      // Make the API call to confirm the reservation
      const response = await fetch(
        `https://app.telefreik.com/api/transports/buses/orders/${reservationData?.id}/return-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.api_token}`, // Assuming you have user authentication
          },
          body: JSON.stringify(reservationRequestData),
        }
      );
  
      if (!response.ok) {
        throw new Error("Reservation failed");
      }
  
      // Update trip cycle steps
      if (tripType === "one-way") {
        if (tripCycleStep === "SELECTING_SEATS") {
          setTripCycleStep("CONFIRMING_RESERVATION");
        }
      } else if (tripType === "round") {
        if (roundTripCycleStep === "SELECTING_RETURN_SEATS") {
          setRoundTripCycleStep("CONFIRMING_RESERVATION");
        }
      }
  
      // Handle the response
      const data = await response.json();
      setReservationDataReturn(data.data);
      setConfirmationStatus("Reservation confirmed successfully!");
  
      // Fetch payment link or navigate to the next step
      fetchPaymentLink(data.data.id); // Assuming you have a function to fetch the payment link
    } catch (error) {
      setErrorMessage("Error confirming reservation. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };
  useEffect(() => {
    fetchLocations();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    console.log(field, value, 'bus');
    setSearchValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
    if (reservationData) {
      
      setReservationData(undefined)
    }
  };

  const swapLocations = () =>{
    setSearchValues((prev) => ({ ...prev, from: prev.to, to: prev.from }));
    if (reservationData) {
      
      setReservationData(undefined)
    }
  }

  const handleSearch = async () => {
    setLoading(true);
    if (reservationData) {
      
      setReservationData(undefined)
    }
    try {
      const { from, to, departure, return: returnDate } = searchValues;
  
      // Validate inputs
      if (!from || !to || !departure || (tripType === "round" && !returnDate)) {
        setErrors({
          from: !from,
          to: !to,
          departure: !departure,
          return: tripType === "round" && !returnDate,
        });
        setLoading(false);
        return;
      }
      // Reset trip cycle step
      if (tripType === "one-way") {
        setTripCycleStep("SEARCHING");
      } else if (tripType === "round") {
        setRoundTripCycleStep("SEARCHING");
      }
      // Fetch outbound trips
      const outboundUrl = new URL("https://app.telefreik.com/api/transports/trips");
      outboundUrl.searchParams.append("city_from", from);
      outboundUrl.searchParams.append("city_to", to);
      outboundUrl.searchParams.append("date", departure);
      outboundUrl.searchParams.append("page", "1");
      outboundUrl.searchParams.append("accept", "");
  
      const outboundResponse = await fetch(outboundUrl.toString(), {
        headers: { "Content-Type": "application/json" },
      });
      if (!outboundResponse.ok) {
        throw new Error(`Error: ${outboundResponse.statusText}`);
      }
      const outboundData = await outboundResponse.json();
      setTrips(outboundData.data);
      navigate('/bus-search')

      clearAllFilters()
      addToast({
        id: Date.now().toString(),
        message: "successfully brings trip for one way!",
        type: "success",
      });
      if (tripType === "one-way" && outboundData.data) {
        setTripCycleStep("SELECTING_TRIP");
      } else if (tripType === "round") {
        setRoundTripCycleStep("SELECTING_OUTBOUND_TRIP");
      }
      // Fetch return trips if trip type is "round"
      if (tripType === "round" && returnDate) {
        const returnUrl = new URL("https://app.telefreik.com/api/transports/trips");
        returnUrl.searchParams.append("city_from", to); // Swap "from" and "to" for return trips
        returnUrl.searchParams.append("city_to", from);
        returnUrl.searchParams.append("date", returnDate);
        returnUrl.searchParams.append("page", "1");
        returnUrl.searchParams.append("accept", "");
  
        const returnResponse = await fetch(returnUrl.toString(), {
          headers: { "Content-Type": "application/json" },
        });
        if (!returnResponse.ok) {
          throw new Error(`Error: ${returnResponse.statusText}`);
        }
        const returnData = await returnResponse.json();
        setReturnTrips(returnData.data);
      }
  
      // Navigate based on selected transport

    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert "HH:mm" time string to minutes
  const convertTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Function to filter trips based on filters including cities, stations, and time range
  const getFilteredTrips = () => {
    return trips.filter((trip) => {
      let isValid = true;
      // Filter by company
      if (tripFilters.company && trip.company !== tripFilters.company) {
        isValid = false;
      }
      // Filter by category
      if (tripFilters.category && trip.category !== tripFilters.category) {
        isValid = false;
      }
      // Filter by price range
      if (
        tripFilters.priceMin &&
        trip.price_start_with < tripFilters.priceMin
      ) {
        isValid = false;
      }
      if (
        tripFilters.priceMax &&
        trip.price_start_with > tripFilters.priceMax
      ) {
        isValid = false;
      }
      // Filter by departure city (assuming filter value is city id as a string)
      if (tripFilters.cityFrom) {
        if (
          !trip.cities_from.some(
            (city) => city.id.toString() === tripFilters.cityFrom
          )
        ) {
          isValid = false;
        }
      }
      // Filter by arrival city
      if (tripFilters.cityTo) {
        if (
          !trip.cities_to.some(
            (city) => city.id.toString() === tripFilters.cityTo
          )
        ) {
          isValid = false;
        }
      }
      // Filter by departure station
      if (tripFilters.stationFrom) {
        if (
          !trip.stations_from.some(
            (station) => station.name.toString() === tripFilters.stationFrom
          )
        ) {
          isValid = false;
        }
      }
      // Filter by arrival station
      if (tripFilters.stationTo) {
        if (
          !trip.stations_to.some(
            (station) => station.name.toString() === tripFilters.stationTo
          )
        ) {
          isValid = false;
        }
      }
      // Filter by time range: convert trip.time ("HH:mm") to minutes and compare
      if (tripFilters.timeMin !== undefined) {
        const tripTime = convertTimeToMinutes(trip.time);
        if (tripTime < tripFilters.timeMin) {
          isValid = false;
        }
      }
      if (tripFilters.timeMax !== undefined) {
        const tripTime = convertTimeToMinutes(trip.time);
        if (tripTime > tripFilters.timeMax) {
          isValid = false;
        }
      }
      return isValid;
    });
  };
  // Function to filter trips based on filters including cities, stations, and time range
  const getFilteredTripsReturn = () => {
    return returnTrips.filter((trip) => {
      let isValid = true;
      // Filter by company
      if (tripFilters.company && trip.company !== tripFilters.company) {
        isValid = false;
      }
      // Filter by category
      if (tripFilters.category && trip.category !== tripFilters.category) {
        isValid = false;
      }
      // Filter by price range
      if (
        tripFilters.priceMin &&
        trip.price_start_with < tripFilters.priceMin
      ) {
        isValid = false;
      }
      if (
        tripFilters.priceMax &&
        trip.price_start_with > tripFilters.priceMax
      ) {
        isValid = false;
      }
      // Filter by departure city (assuming filter value is city id as a string)
      if (tripFilters.cityFrom) {
        if (
          !trip.cities_from.some(
            (city) => city.id.toString() === tripFilters.cityFrom
          )
        ) {
          isValid = false;
        }
      }
      // Filter by arrival city
      if (tripFilters.cityTo) {
        if (
          !trip.cities_to.some(
            (city) => city.id.toString() === tripFilters.cityTo
          )
        ) {
          isValid = false;
        }
      }
      // Filter by departure station
      if (tripFilters.stationFrom) {
        if (
          !trip.stations_from.some(
            (station) => station.name.toString() === tripFilters.stationFrom
          )
        ) {
          isValid = false;
        }
      }
      // Filter by arrival station
      if (tripFilters.stationTo) {
        if (
          !trip.stations_to.some(
            (station) => station.name.toString() === tripFilters.stationTo
          )
        ) {
          isValid = false;
        }
      }
      // Filter by time range: convert trip.time ("HH:mm") to minutes and compare
      if (tripFilters.timeMin !== undefined) {
        const tripTime = convertTimeToMinutes(trip.time);
        if (tripTime < tripFilters.timeMin) {
          isValid = false;
        }
      }
      if (tripFilters.timeMax !== undefined) {
        const tripTime = convertTimeToMinutes(trip.time);
        if (tripTime > tripFilters.timeMax) {
          isValid = false;
        }
      }
      return isValid;
    });
  };

  const fetchTripDetails = async (tripId: string) => {
    setLoading(true);
    setSelectedTrip(trips.find((trips) => `${trips.id}` === tripId));
    try {
      const fromCityId = searchParams.get("from_city_id");
      const toCityId = searchParams.get("to_city_id");
      const fromLocationId = searchParams.get("from_location_id");
      const toLocationId = searchParams.get("to_location_id");
      const date = searchParams.get("date");

      const response = await fetch(
        `https://app.telefreik.com/api/transports/trips/${tripId}/seats?from_city_id=${fromCityId}&to_city_id=${toCityId}&from_location_id=${fromLocationId}&to_location_id=${toLocationId}&date=${date}`
      );
      const data = await response.json();

      setSeatingStructure(data.data.salon);
      setSeats(data.data.seats_map);
    } catch (error) {
      console.error("Failed to fetch trip details:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTripDetailsReturn = async (tripId: string) => {
    setLoading(true);
    setSelectedTripReturn(returnTrips.find((trips) => `${trips.id}` === tripId));
    try {
      const fromCityId = searchParams.get("from_city_id");
      const toCityId = searchParams.get("to_city_id");
      const fromLocationId = searchParams.get("from_location_id");
      const toLocationId = searchParams.get("to_location_id");
      const date = searchParams.get("date");

      const response = await fetch(
        `https://app.telefreik.com/api/transports/trips/${tripId}/seats?from_city_id=${fromCityId}&to_city_id=${toCityId}&from_location_id=${fromLocationId}&to_location_id=${toLocationId}&date=${date}`
      );
      const data = await response.json();

      setSeatingStructure(data.data.salon);
      setSeats(data.data.seats_map);
    } catch (error) {
      console.error("Failed to fetch trip details:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSeatClick = (seat: Seat | undefined) => {
    if (
      !seat ||
      seat.class === "space" ||
      seat.class === "door" ||
      seat.class === "driver"
    )
      return;

    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat.seat_no!)
        ? prevSelected.filter((s) => s !== seat.seat_no)
        : [...prevSelected, seat.seat_no!]
    );

      // Advance the trip cycle step after selecting seats
  if (tripType === "one-way") {
    setTripCycleStep("SELECTING_SEATS");
  } else if (tripType === "round") {
    if (roundTripCycleStep === "SELECTING_OUTBOUND_SEATS") {
      setRoundTripCycleStep("SELECTING_OUTBOUND_SEATS");
    } else if (roundTripCycleStep === "SELECTING_RETURN_SEATS") {
      setRoundTripCycleStep("SELECTING_RETURN_SEATS");
    }
  }
  };
  const handleSeatClickReturn = (seat: Seat | undefined) => {
    if (
      !seat ||
      seat.class === "space" ||
      seat.class === "door" ||
      seat.class === "driver"
    )
      return;

    setSelectedSeatsReturn((prevSelected) =>
      prevSelected.includes(seat.seat_no!)
        ? prevSelected.filter((s) => s !== seat.seat_no)
        : [...prevSelected, seat.seat_no!]
    );

      // Advance the trip cycle step after selecting seats
  if (tripType === "one-way") {
    setTripCycleStep("SELECTING_SEATS");
  } else if (tripType === "round") {
    if (roundTripCycleStep === "SELECTING_RETURN_SEATS") {
      setRoundTripCycleStep("SELECTING_RETURN_SEATS");
    } else {
      setRoundTripCycleStep("SELECTING_RETURN_SEATS");
    }
  }
  };
  useEffect(() => {
    const updatedSeats = selectedSeats.filter((s) => {
      const seat = seats?.find((seat) => `${seat.seat_no}` === s);
      return seat?.class !== "booked"; // Keep only non-booked seats
    });
    setSelectedSeats(updatedSeats);
  }, []);
  useEffect(() => {
    const updatedSeats = selectedSeats.filter((s) => {
      const seat = seats?.find((seat) => `${seat.seat_no}` === s);
      return seat?.class !== "booked"; // Keep only non-booked seats
    });
    setSelectedSeats(updatedSeats);
  }, [seats]);

  const getSeatImage = (seat: Seat): string => {
    switch (seat.class) {
      case "driver":
        return images.steering_wheel;
      case "booked":
        return images.seat_notFree;
      case "available":
        return images.seatFree;
      
      case "door":
        return images.door;
      
      case "wc":
        return images.toilet_img;
      default:
        return "";
    }
  };
  const generateSalonLayout = (): JSX.Element[] => {
    if (!seatingStructure || !seats) return [];

    const rowsCount = seatingStructure.rows;
    const colsCount = seatingStructure.columns;
    const salonLayout: JSX.Element[] = [];

    for (let row = 0; row < rowsCount; row++) {
      const rowSeats: JSX.Element[] = [];

      for (let col = 0; col < colsCount; col++) {
        const seatIndex = row * colsCount + col;
        const seat = seats[seatIndex];
        const seatNo = seat?.seat_no || "";
        const seatImg = seat ? getSeatImage(seat) : "";

        rowSeats.push(
          <div
            key={`${row}-${col}`}
            className={`seat flex items-center relative justify-center w-16 h-16 m-1 rounded-lg transition-all duration-200 ${
              seat?.class === "available"
                ? " hover:bg-green-200 cursor-pointer"
                : seat?.class === "booked"
                ? " cursor-not-allowed"
                : seat?.class === "driver"
                ? "cursor-not-allowed"
                : seat?.class === "door"
                ? "bg-transparent rounded-none cursor-not-allowed    "
                : seat?.class === "wc"
                ? "bg-transparent cursor-not-allowed    "
                : "bg-transparent "
            } ${
              selectedSeats.includes(seatNo) && seat.class === "available"
                ? "border-2 border-yellow-500 shadow-lg scale-105 bg-yellow-100"
                : ""
            }`}
            onClick={() => handleSeatClick(seat)}
            title={seatNo || ""}
          >
            {seatImg  && (
              <img
                src={ selectedSeats.includes(seatNo) ?  images.seat_reserved : seatImg}
                alt={seatNo}
                className="w-14 h-14 object-contain"
              />
            )}
            <div className="absolute top-5 text-white tex-[4px] opacity-85 z-0 max-sm:text-[2px]  ">
              {seat.seat_no}
            </div>
          </div>
        );
      }

      salonLayout.push(
        <div
          key={row}
          className="flex flex-row items-center justify-center rtl:flex-row-reverse"
        >
          {rowSeats}
        </div>
      );
    }

    return salonLayout;
  };
  const generateSalonLayoutReturn = (): JSX.Element[] => {
    if (!seatingStructure || !seats) return [];

    const rowsCount = seatingStructure.rows;
    const colsCount = seatingStructure.columns;
    const salonLayout: JSX.Element[] = [];

    for (let row = 0; row < rowsCount; row++) {
      const rowSeats: JSX.Element[] = [];

      for (let col = 0; col < colsCount; col++) {
        const seatIndex = row * colsCount + col;
        const seat = seats[seatIndex];
        const seatNo = seat?.seat_no || "";
        const seatImg = seat ? getSeatImage(seat) : "";

        rowSeats.push(
          <div
            key={`${row}-${col}`}
            className={`seat flex items-center relative justify-center w-16 h-16 m-1 rounded-lg transition-all duration-200 ${
              seat?.class === "available"
                ? " hover:bg-green-200 cursor-pointer"
                : seat?.class === "booked"
                ? "cursor-not-allowed"
                : seat?.class === "driver"
                ? " cursor-not-allowed"
                : seat?.class === "door"
                ? "cursor-not-allowed"
                : "bg-transparent"
            } ${
              selectedSeatsReturn.includes(seatNo) && seat.class === "available"
                ? "border-2 border-yellow-500 shadow-lg scale-105 bg-yellow-100"
                : ""
            }`}
            onClick={() => handleSeatClickReturn(seat)}
            title={seatNo || ""}
          >
            {seatImg && (
              <img
              src={ selectedSeats.includes(seatNo) ?  images.seat_reserved : seatImg}
              alt={seatNo}
                className="w-14 h-14 object-contain"
              />
            )}
            <div className="absolute top-5 text-white tex-[4px] opacity-85 z-0 max-sm:text-[2px] ">
              {seat.seat_no}
            </div>
          </div>
        );
      }

      salonLayout.push(
        <div
          key={row}
          className="flex flex-row items-center justify-center rtl:flex-row-reverse"
        >
          {rowSeats}
        </div>
      );
    }

    return salonLayout;
  };
  useEffect(() => {
    setSeatsSelected([]);
    setSeatsSelectedReturn([])
  }, [seats]);
  useEffect(() => {
    setSeatsSelected([]);
    setSeatsSelectedReturn([])
  }, []);

  useEffect(() => {
    setSeatsSelected([]);
    selectedSeats.forEach((selected) => {
      const seat = seats?.find((seat) => seat.id === selected); // Find the seat by ID
      if (seat) {
        // Ensure seat is found (not undefined)
        setSeatsSelected((prevSeats) => [...prevSeats, seat]);
      }
    });

  }, [selectedSeats, seats]); // Run effect when selectedSeats or seats change
useEffect(() => {
  setSeatsSelectedReturn([])
  setReservationDataReturn(undefined);
  selectedSeatsReturn.forEach((selected) => {
    const seat = seats?.find((seat) => seat.id === selected); // Find the seat by ID
    if (seat) {
      // Ensure seat is found (not undefined)
      setSeatsSelectedReturn((prevSeats) => [...prevSeats, seat]);
    }
  });
}, [selectedSeatsReturn,seats])

  const handleTripSelection = (
    tripId: number,
    fromCityId: number,
    toCityId: number,
    fromLocationId: number,
    toLocationId: number,
    date: string,
    stationFrom?: Station,
    stationTo?: Station,
  ) => {
    if (stationFrom && stationTo) {
      const dataStaions = {
        stations_from: stationFrom,
        stations_to: stationTo,
      }
      setTripStations(dataStaions)
    }
    navigate(
      `/bus-search/trip/${tripId}?from_city_id=${fromCityId}&to_city_id=${toCityId}&from_location_id=${fromLocationId}&to_location_id=${toLocationId}&date=${date}`
    );
      // Advance the trip cycle step
  if (tripType === "one-way") {
    setTripCycleStep("SELECTING_SEATS");
  } else if (tripType === "round") {
    setRoundTripCycleStep("SELECTING_OUTBOUND_SEATS");
  }
  };
  const handleTripSelectionReturn = (
    tripId: number,
    fromCityId: number,
    toCityId: number,
    fromLocationId: number,
    toLocationId: number,
    date: string,
    stationFrom?: Station,
    stationTo?: Station,
  ) => {
    if (stationFrom && stationTo) {
      const dataStaions = {
        stations_from: stationFrom,
        stations_to: stationTo,
      }
      setTripStationsReturn(dataStaions)
      setSelectedTripReturn(returnTrips.find(t => t.id === tripId));
    }
    navigate(
      `/bus-search-return/trip/${tripId}?from_city_id=${fromCityId}&to_city_id=${toCityId}&from_location_id=${fromLocationId}&to_location_id=${toLocationId}&date=${date}`
    );
      // Advance the trip cycle step
  if (tripType === "one-way") {
    setTripCycleStep("SELECTING_SEATS");
  } else if (tripType === "round") {
    setRoundTripCycleStep("SELECTING_RETURN_SEATS");
  }
  };
  // useMemo to only recalc filtered trips when trips or filters change
  const filteredTrips = useMemo(() => getFilteredTrips(), [trips, tripFilters]);
  const filteredTripsReturn = useMemo(() => getFilteredTripsReturn(), [returnTrips, tripFiltersReturn]);

  return (
    <SearchContext.Provider
      value={{
        searchValues,
        setSearchValues,
        loading,
        setLoading,
        errors,
        setErrors,
        tripType,
        setTripType,
        handleInputChange,
        swapLocations,
        handleSearch,
        locations,
        fetchLocations,
        trips,
        setTrips,
        returnTrips,
        selectedTrip,
        selectedTripReturn,
        setSelectedTrip,
        tripFilters,
        tripFiltersReturn,
        setTripFilters,
        setTripFiltersReturn,
        getFilteredTrips: () => filteredTrips,
        getFilteredTripsReturn: () => filteredTripsReturn,
        tripStations,
        tripStationsReturn,
        handleTripSelection, // Add this line
        handleTripSelectionReturn,
        seatingStructure,
        seats,
        seatsSelected,
        seatsSelectedReturn,
        selectedSeats,
        selectedSeatsReturn,
        fetchTripDetails,
        fetchTripDetailsReturn,
        handleSeatClick,
        getSeatImage,
        generateSalonLayout,
        generateSalonLayoutReturn,

        tripCycleStep, // Add trip cycle step
        setTripCycleStep, // Add setter for trip cycle step
        roundTripCycleStep, // Add round trip cycle step
        setRoundTripCycleStep, // Add setter for round trip cycle step



        isConfirming,
        errorMessage,
        reservationData,
        setReservationData,
        setReservationDataReturn,
        reservationDataReturn,
        confirmationStatus,
        confirmReservation,
        confirmReservationReturn,
        paymentUrl,
        isLoadingPayment
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
