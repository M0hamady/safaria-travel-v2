import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Location, Station, Trip } from "../types/trainTypes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
}

interface TrainsContextProps {
  trainLocations: Location[];
  stations: Station[];
  trips: Trip[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  searchBody: SearchBody;
  setSearchBody: (body: SearchBody) => void;
  fetchStations: () => Promise<void>;
  searchTrips: () => Promise<void>;
  bookTicket: (tripId: string, payload: TicketPayload) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// -------------------------
// Default Context
// -------------------------
export const TrainsContext = createContext<TrainsContextProps>({
  trainLocations: [],
  stations: [],
  trips: [],
  filters: {
    from_station_id: "",
    to_station_id: "",
    date: "",
    coach_class_id: "",
  },
  setFilters: () => {},
  searchBody: {
    from_station_id: "",
    to_station_id: "",
    date: "",
  },
  setSearchBody: () => {},
  fetchStations: async () => {},
  searchTrips: async () => {},
  bookTicket: async () => {},
  loading: false,
  error: null,
});

// -------------------------
// Provider
// -------------------------
export const TrainsProvider = ({ children }: { children: ReactNode }) => {
  const [trainLocations, setTrainLocations] = useState<Location[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filters, setFilters] = useState<Filters>({
    from_station_id: "",
    to_station_id: "",
    date: "",
    coach_class_id: "",
  });

  const [searchBody, setSearchBody] = useState<SearchBody>({
    from_station_id: "",
    to_station_id: "",
    date: "",
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  const { user } = useContext(AuthContext);
  const token = user?.api_token;

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
      const res = await axios.post(`${API_BASE_URL}/search`,  {
        from_station_id: searchBody.from_station_id,
        to_station_id: searchBody.to_station_id,
        date: searchBody.date,
      }, {
        headers: {
          "Accept-Language": i18n.language,
        },
      });
      setTrips(res.data);
      navigate('/train-search')
    } catch (err) {
      setError("Trip search failed.");
    } finally {
      setLoading(false);
    }
  };

  const bookTicket = async (tripId: string, payload: TicketPayload) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/trips/${tripId}/create-ticket`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": i18n.language,
          },
        }
      );
    } catch (err) {
      setError("Failed to book ticket.");
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
        stations,
        trips,
        filters,
        setFilters,
        searchBody,
        setSearchBody,
        fetchStations,
        searchTrips,
        bookTicket,
        loading,
        error,
      }}
    >
      {children}
    </TrainsContext.Provider>
  );
};
