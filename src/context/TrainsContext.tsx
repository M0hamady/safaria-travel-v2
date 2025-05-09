import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Location, Station, TrainClass, Trip } from "../types/trainTypes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";
import { TicketOrder } from "../pages/bus/pages/ConfirmReservationPage";

// -------------------------
// API Base
// -------------------------
const API_BASE_URL = "https://app.telefreik.com/api/transports/trains";

// -------------------------
// Interfaces
// -------------------------
interface SearchBody {
  from_station_id: string;
  to_station_id: string;
  date: string;
}
export interface TicketOrderResponse {
  status: number;
  message: string;
  errors: Record<string, any>;
  data: TicketOrder;
}
interface TicketPayload {
  national_id: string;
  seats_no: number;
  coach_class_id: string;
}

interface Filters {
  from_station_id: string;
  to_station_id: string;
  date: string;
  coach_class_id?: string;
  start_time?: string;
  finish_time?: string;
  priceRange?: [number, number];
}

interface TrainsContextProps {
  trainLocations: Location[];
  selectedClass:TrainClass | null ;
  selectedDepartureLocation: Location | null;
  setSelectedDepartureLocation: (location: Location) => void;
  setSelectedClass: (trainClass: TrainClass) => void;
  selectedArrivalLocation: Location | null;
  setSelectedArrivalLocation: (location: Location) => void;
  stations: Station[];
  selectedDepartureStation: Station | null;
  setDepartureStation: (station: Station) => void;
  selectedArrivalStation: Station | null;
  setArrivalStation: (station: Station) => void;
  trips: Trip[];
  selectedTrip: Trip | null;
  setSelectedTrip: (trip: Trip) => void;
  filteredTrips: Trip[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  searchBody: SearchBody;
  setSearchBody: (body: SearchBody) => void;
  setPayment_url: (payment_url:string) => void;
  fetchStations: () => Promise<void>;
  searchTrips: () => Promise<void>;
  bookTicket: (tripId: string, payload: TicketPayload) => Promise<void>;
  loading: boolean;
  error: string | null;
  payment_url: string | null;
  paymentResponse: TicketOrder | null;
}

// -------------------------
// Default Context
// -------------------------
export const TrainsContext = createContext<TrainsContextProps>({
  trainLocations: [],
  selectedDepartureLocation: null,
  setSelectedDepartureLocation: () => {},
  selectedArrivalLocation: null,
  setSelectedArrivalLocation: () => {},
  setSelectedClass: () => {},
  stations: [],
  selectedDepartureStation: null,
  setDepartureStation: () => {},
  selectedArrivalStation: null,
  setArrivalStation: () => {},
  trips: [],
  selectedClass:null,
  selectedTrip: null,
  setSelectedTrip: () => {},
  filteredTrips: [],
  filters: {
    from_station_id: "",
    to_station_id: "",
    date: "",
    coach_class_id: "",
    start_time: "",
    finish_time: "",
    priceRange: [0, 1000],
  },
  setFilters: () => {},
  searchBody: {
    from_station_id: "",
    to_station_id: "",
    date: "",
  },
  setSearchBody: () => {},
  setPayment_url: () => {},
  fetchStations: async () => {},
  searchTrips: async () => {},
  bookTicket: async () => {},
  loading: false,
  error: null,
  payment_url: null,
  paymentResponse: null,
});

// -------------------------
// Provider
// -------------------------
export const TrainsProvider = ({ children }: { children: ReactNode }) => {
  const [trainLocations, setTrainLocations] = useState<Location[]>([]);
  const [selectedClass, setSelectedClass] = useState<TrainClass | null>(null);
  const [selectedDepartureLocation, setSelectedDepartureLocation] = useState<Location | null>(null);
  const [selectedArrivalLocation, setSelectedArrivalLocation] = useState<Location | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedDepartureStation, setDepartureStation] = useState<Station | null>(null);
  const [selectedArrivalStation, setArrivalStation] = useState<Station | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<TicketOrder | null>(null)
  const [filters, setFilters] = useState<Filters>({
    from_station_id: "",
    to_station_id: "",
    date: "",
    coach_class_id: "",
    start_time: "",
    finish_time: "",
    priceRange: [0, 1000],
  });
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [searchBody, setSearchBody] = useState<SearchBody>({
    from_station_id: "",
    to_station_id: "",
    date: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment_url, setPayment_url] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const { user, } = useContext(AuthContext);
const token = user?.api_token || localStorage.getItem('authToken');

  const fetchStations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/governorates`, {
        headers: {
          "Accept-Language": i18n.language,
        },
      });
      setTrainLocations(res.data.data);
    } catch (err) {
      setError("Failed to fetch stations.");
    } finally {
      setLoading(false);
    }
  };

  const searchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/search`,
        searchBody,
        {
          headers: {
            "Accept-Language": i18n.language,
          },
        }
      );
      setTrips(res.data.data);
      navigate("/train-search");
    } catch (err) {
      setError("Trip search failed.");
    } finally {
      setLoading(false);
    }
  };

const bookTicket = async (tripId: string, payload: TicketPayload) => {
  setLoading(true);

  const token = user?.api_token || localStorage.getItem('authToken');

  if (!token) {
    console.log(user);
    addToast({
      id: "authorization",
      message: "Authorization token not found.",
      type: "error",
    });
    setLoading(false);
    return;
  }

  addToast({
    id: "booking-start",
    message: "Processing your ticket booking...",
    type: "info",
  });

  try {
    const response = await axios.post<TicketOrderResponse>(
      `${API_BASE_URL}/trips/${tripId}/create-ticket`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": i18n.language,
          Accept: "application/json",
        },
      }
    );

    addToast({
      id: "booking-success",
      message: "Ticket booked successfully. Redirecting to payment...",
      type: "success",
    });
    console.log(response.data.data.payment_url);
    setPaymentResponse(response.data.data)
    const paymentUrl = response.data.data.payment_url;

    // Send POST request to the payment URL
  const responsePayment = await fetch(paymentUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          redirect: "follow"
        },
        body: JSON.stringify({}),
      });

      if (!responsePayment.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await responsePayment.json();
      const finalUrl = data.data?.url;
      setPayment_url(finalUrl)
    if (finalUrl) {
      addToast({
          id: "payment-url-success",
          message: t("toast.paymentUrlSuccess"),
          type: "success",
        });
      window.location.href = finalUrl;

      } else {
        addToast({
          id: "payment-url-missing",
          message: t("toast.paymentUrlMissing"),
          type: "error",
        });
      }

  } catch (err) {
    console.error(err);
    addToast({
      id: "booking-failure",
      message: "Failed to book ticket. Please try again later.",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <TrainsContext.Provider
      value={{
        trainLocations,
        selectedDepartureLocation,
        setSelectedDepartureLocation,
        selectedArrivalLocation,
        setSelectedArrivalLocation,
        selectedClass,
        setSelectedClass,
        stations,
        selectedDepartureStation,
        setDepartureStation,
        selectedArrivalStation,
        setArrivalStation,
        trips,
        selectedTrip,
        setSelectedTrip,
        filteredTrips: [],
        filters,
        setFilters,
        searchBody,
        setSearchBody,
        fetchStations,
        searchTrips,
        bookTicket,
        loading,
        error,
        payment_url,
        paymentResponse,
        setPayment_url,
      }}
    >
      {children}
    </TrainsContext.Provider>
  );
};
