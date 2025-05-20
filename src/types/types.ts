import { JSX } from "react";

// types.ts
export interface TransportOption {
  id: number;
  label: string;
  icon: JSX.Element;
  value: string;
  hasRoundTrip: boolean;
}

export   type SearchType = 'bus' | 'private' | 'train';
export interface PrivateTrip {
  id: number;
  company_name: string;
  company_logo: string;
  date: string; // or Date if parsed
  from_location: Location;
  to_location: Location;
  bus: Bus;
  rounded: boolean;
  original_price: number;
  discount: string;
  price: number;
  go_price: number;
  round_price: number;
}
export interface Bus {
  id: number;
  name: string;
  type: string | null;
  seats_number: number;
  license_plate: string | null;
  vin: string | null;
  mileage: number | null;
  engine_hours: number | null;
  model: string | null;
  year: number | null;
  color: string | null;
  notes: string | null;
  status: string | null;
  featured_image: string | null;
  images: string[] | null;
}

// Search Values for managing the search form
export interface SearchValues {
  from: string;
  to: string;
  departure: string;
  return: string;
}
export interface Partner {
  id: number;
  image: string;
  // Add any additional fields if necessary
}
export interface CustomLink {
	label: string;
	href: string;
	targetBlank?: boolean;
}

export interface SeatingStructure {
  id: number;
  name: string;
  rows: number;
  columns: number;
  direction: "ltr" | "rtl";
  levels: number;
}

export interface Seat {
  id: string | null;
  seat_no: string | null;
  class: "driver" | "space" | "door" | "booked" | "available" | 'wc';
  category: string | null;
  level: number;
}
// Search Context Type for managing search-related state
export interface SearchContextType {
  selectedTransport: string;
  setSelectedTransport: (value: string) => void;
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
  handleTripSelection: (tripId: number, fromCityId: number, toCityId: number, fromLocationId: number, toLocationId: number, date: string) => void; // Add this line
  
}

// Location type representing each location in the system
export interface Location {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
}

// Transport Selector props for managing selected transport type
export interface TransportSelectorProps {
  selectedTransport: string;
  setSelectedTransport: (value: string) => void;
}

// Progress Indicator props for displaying progress based on selected transport
export interface ProgressIndicatorProps {
  selectedTransport: string;
}

// Navigation Buttons props for controlling transport selection during navigation
export interface NavigationButtonsProps {
  selectedTransport: string;
  setSelectedTransport: (value: string) => void;
}

// Search Form props for managing search-related form elements and actions
export interface SearchFormProps {
  searchValues: {
    from: string;
    to: string;
    departure: string;
    return?: string;
  };
  setSearchValues: React.Dispatch<React.SetStateAction<SearchFormProps['searchValues']>>;
  handleSearch: () => void;
  swapLocations: () => void;
  errors: {
    from: boolean;
    to: boolean;
    departure: boolean;
    return?: boolean;
  };
}
export interface FormatDateTimeOptions {
  // Optional locale code (default: "en-GB")
  locale?: string;
  // Optional date/time formatting options. These get merged with defaults.
  formatOptions?: Intl.DateTimeFormatOptions;
}
// Trip-related details for bus, private transport, etc.
export interface Trip {
  id: number;
  gateway_id: string;
  company_logo?:string;
  go_price?:string;
  round_price?:string;
  company: string;
  company_data: {
    name: string;
    avatar: string;
    bus_image: string;
    pin: string;
  };
  storyType?: string; // Make it optional if not every trip has one

  category: string;
  date: string;
  time: string;
  date_time: string;
  bus: {
    id: number;
    code: string;
    category: string;
    salon: string;
    type: string;
  };
  cities_from: City[];
  cities_to: City[];
  stations_from: Station[];
  stations_to: Station[];
  pricing: Pricing[];
  price_start_with: number;
  prices_start_with: {
    original_price: number;
    final_price: number;
    offer: string;
  };
  available_seats: number;
}

export type TripCycleStep =
  | "SEARCHING"
  | "SELECTING_TRIP"
  | "SELECTING_SEATS"
  | "CONFIRMING_RESERVATION";

export type RoundTripCycleStep =
  | "SEARCHING"
  | "SELECTING_OUTBOUND_TRIP"
  | "SELECTING_OUTBOUND_SEATS"
  | "SELECTING_RETURN_TRIP"
  | "SELECTING_RETURN_SEATS"
  | "CONFIRMING_RESERVATION";
export interface TripStations {
    stations_from: Station;
    stations_to: Station;
}

// City interface for origin/destination cities
export interface City {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  price: number;
}
export interface TripFilters {
  company?: string[];
  stationFrom?: string;
  stationTo?: string;
  priceMin?: number;
  priceMax?: number;
  timeMin?: number;
  timeMax?: number;
}

// Station interface for departure and arrival stations
export interface Station {
  id: number;
  city_id: number;
  city_name: string;
  arrival_at: string;
  name: string;
  latitude: string;
  longitude: string;
  price: number;
  original_price: number;
  final_price: number;
  categories: string[];
}

// Pricing interface for handling the price details
export interface Pricing {
  id: number;
  name: string;
  price: number;
  original_price: number;
  final_price: number;
}

// types.ts
export interface BusResult {
  id: string;
  name: string;
  // Add other relevant fields based on your data
  departureTime: string;  // Example field
  // Any other fields you'd like to include
}
