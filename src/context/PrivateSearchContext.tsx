import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Location, PrivateTrip, SearchValues, Trip,  } from "../types/types";

const API_BASE = "https://app.telefreik.com";
export interface TripFilters {
  company: string[];             // e.g., ["Telefreik", "SuperJet"]
  priceRange: [number, number]; // e.g., [0, 1000]
  busType?: string[];           // e.g., ["VIP", "Mini"]
}


export interface BoardingInfo {
  date: string;        // "YYYY-MM-DD HH:mm"
  address_id: number;
}

export interface CreateTicketPayload {
  round: 1 | 2;        // 1 = go only, 2 = go and return
  boarding: BoardingInfo;
  return?: BoardingInfo;
}


export interface TicketResponse {
  ticket_id: number;
  message: string;
  status: string;
}
interface PrivateSearchContextType {
  searchValues: SearchValues;
  setSearchValues: (values: SearchValues) => void;
  handleInputChange: (field: string | keyof SearchValues, value: string) => void;
  swapLocations: () => void;
  fetchLocations: () => Promise<void>;
  handleSearch: () => void;
  locations: Location[];
  trips: Trip[];
  loading: boolean;
  private_trip: PrivateTrip | undefined;
  tripFilters: TripFilters;
  setTripFilters: (filters: TripFilters) => void;
  getFilteredTrips: () => Trip[];
  errors: Record<string, boolean>;
  tripType: "one-way" | "round";
  setTripType: (type: "one-way" | "round") => void;
  fetchTripById: (id: string,) => Promise<PrivateTrip | null>;
  createTicket: (tripId: number, data: CreateTicketPayload) => Promise<TicketResponse | null>;
}


// Create context
const PrivateSearchContext = createContext<PrivateSearchContextType | null>(null);

// Provider
export const PrivateSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchValues, setSearchValues] = useState<SearchValues>({
    from: "",
    to: "",
    departure: "",
    return: "",
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [private_trip, setPrivate_trip] = useState<PrivateTrip | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const [tripFilters, setTripFilters] = useState<TripFilters>({
    company: [],
    priceRange: [0, 10000],
    busType: [],
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({
    from: false,
    to: false,
    departure: false,
    return: false,
  });  const [tripType, setTripType] = useState<"one-way" | "round">('one-way');
  const navigate = useNavigate();

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/transports/locations/private`);
      setLocations(res?.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch locations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string | keyof SearchValues, value: string) => {
    setSearchValues((prev) => ({ ...prev, [field]: value }));
  };

  const swapLocations = () => {
    setSearchValues((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSearch = async () => {
    const { from, to, departure } = searchValues;
    if (!from || !to || !departure) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/transports/private/trips`, {
        params: {
          from_location_id: from,
          to_location_id: to,
          date: departure,
        },
      });
      const tripsData: Trip[] = res.data.data.map((trip: any) => ({
        id: trip.id,
        gateway_id: `${trip.id}`,
        company: trip.company_name,
        company_data: {
          name: trip.company_name,
          avatar: trip.company_logo,
          bus_image: trip.bus?.featured_image || '',
          pin: trip.bus?.license_plate || '',
        },
        storyType: undefined,
        category: trip.bus?.type?.name || 'unknown',
        date: trip.date,
        time: '',
        date_time: trip.date,
        bus: {
          id: trip.bus?.id || 0,
          code: trip.bus?.vin || '',
          category: trip.bus?.type?.name || '',
          salon: trip.bus?.name || '',
          type: trip.bus?.type?.name || '',
        },
        cities_from: trip.from_location ? [{
          id: trip.from_location.id,
          name: trip.from_location.name,
          latitude: trip.from_location.name_ar,
          longitude: trip.from_location.name_en,
          price: trip.go_price,
        }] : [],
        cities_to: trip.to_location ? [{
          id: trip.to_location.id,
          name: trip.to_location.name,
          latitude: trip.to_location.name_ar,
          longitude: trip.to_location.name_en,
          price: trip.go_price,
        }] : [],
        stations_from: [],
        stations_to: [],
        pricing: [],
        price_start_with: Number(trip.price) || 0,
        prices_start_with: {
          original_price: Number(trip.original_price) || 0,
          final_price: Number(trip.price) || 0,
          offer: trip.discount || '0%',
        },
        available_seats: Number(trip.bus?.seats_number) || 3,
      }));
      setTrips(tripsData);
      navigate("/private-trips-search");
    } catch (err) {
      console.error("❌ Error searching trips", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTrips = (): Trip[] => {
    return trips.filter((trip) => {
      const companyMatch =
        tripFilters.company.length === 0 || tripFilters.company.includes(trip.company);
  
      const priceMatch =
        trip.price_start_with >= tripFilters.priceRange[0] &&
        trip.price_start_with <= tripFilters.priceRange[1];
  
      const busTypeMatch =
        !tripFilters.busType?.length || tripFilters.busType.includes(trip.category);
  
      return companyMatch && priceMatch && busTypeMatch;
    });
  };
  
  const fetchTripById = async (id: string,): Promise<PrivateTrip | null> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // or useAuthContext
      const date_goping = searchValues.departure
      const res = await axios.get(`${API_BASE}/api/transports/private/trips/${id}`, {
        params: { date_goping },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrivate_trip(res.data.data);
      return res.data.data as PrivateTrip;
    } catch (err) {
      console.error("❌ Failed to fetch trip", err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const createTicket = async (tripId: number, data: CreateTicketPayload): Promise<TicketResponse | null> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE}/api/transports/private/trips/${tripId}/create-ticket`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("❌ Failed to create ticket", err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <PrivateSearchContext.Provider
    value={{
      searchValues,
      setSearchValues,
      handleInputChange,
      swapLocations,
      fetchLocations,
      handleSearch,
      locations,
      trips,
      loading,
      tripFilters,
      setTripFilters,
      getFilteredTrips,
      errors,
      tripType,
      private_trip,
      setTripType,
      fetchTripById,
      createTicket,
    }}
    >
      {children}
    </PrivateSearchContext.Provider>
  );
};

// Hook
export const usePrivateSearchContext = () => {
  const context = useContext(PrivateSearchContext);
  if (!context) {
    throw new Error("usePrivateSearchContext must be used within a PrivateSearchProvider");
  }
  return context;
};
