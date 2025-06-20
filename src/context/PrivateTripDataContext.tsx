import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTicketPayload, usePrivateSearchContext } from "./PrivateSearchContext";
import { useToast } from "./ToastContext";
import { PrivateTrip } from "../types/types";

// Storage constants
const STORAGE = {
  ADDRESSES: "privateAddresses",
  BOARDING_ADDRESS: "privateBoardingAddress",
  RETURN_ADDRESS: "privateReturnAddress",
  BOARDING_ID: "boardingAddressId",
  RETURN_ID: "returnAddressId",
  BOARDING_DATETIME: "boardingDateTime",
  RETURN_DATETIME: "returnDateTime",
  TICKET_DATA: "latestPrivateTicket",
  ROUTE_INFO: "privateRouteInfo"
};

// Types
type Address = {
  id: string;
  city: string | null;
  name: string;
  phone: string;
  notes: string;
  whatsapp_share_link: string;
  map_location: {
    lat: number;
    lng: number;
    address_name: string;
  };
  value?: string;
};

type AddAddressPayload = {
  name: string;
  for?: "boarding" | "return";
  map_location: {
    lat: string;
    lng: string;
    address_name: string;
  };
  notes: string;
};

type RouteInfo = {
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string;
};

type PrivateTripDataContextType = {
  trip: PrivateTrip | null;
  addresses: Address[];
  addressesBoarding?: Address;
  addressesReturn?: Address;
  boardingAddressId: string | null;
  returnAddressId: string | null;
  boardingDateTime: string;
  returnDateTime: string;
  isMapExpanded: boolean;
  addressesLoading: boolean;
  isCreatingTicket: boolean;
  routeInfo: RouteInfo | null;
  setAddressesBoarding: React.Dispatch<React.SetStateAction<Address | undefined>>;
  setAddressesReturn: React.Dispatch<React.SetStateAction<Address | undefined>>;
  setBoardingAddressId: React.Dispatch<React.SetStateAction<string | null>>;
  setReturnAddressId: React.Dispatch<React.SetStateAction<string | null>>;
  setBoardingDateTime: React.Dispatch<React.SetStateAction<string>>;
  setReturnDateTime: React.Dispatch<React.SetStateAction<string>>;
  fetchData: (tripId: string) => void;
  fetchAddresses: () => void;
  addNewAddress: (payload: AddAddressPayload) => Promise<Address>;
  handleCreateTicket: () => void;
  calculateRoute: () => Promise<void>;
  getFormattedDistance: () => string;
  getFormattedDuration: () => string;
};

const PrivateTripDataContext = createContext<PrivateTripDataContextType | undefined>(undefined);

export const PrivateTripDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    fetchTripById,
    createTicket,
    tripType,
    private_trip,
  } = usePrivateSearchContext();

  const { addToast } = useToast();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<PrivateTrip | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem(STORAGE.ADDRESSES);
    return saved ? JSON.parse(saved) : [];
  });
  const token = localStorage.getItem("authToken");

  const [addressesBoarding, setAddressesBoarding] = useState<Address | undefined>(() => {
    const saved = localStorage.getItem(STORAGE.BOARDING_ADDRESS);
    return saved ? JSON.parse(saved) : undefined;
  });
  
  const [boardingDateTime, setBoardingDateTime] = useState<string>(() =>
    localStorage.getItem(STORAGE.BOARDING_DATETIME) || ""
  );

  const [returnDateTime, setReturnDateTime] = useState<string>(() =>
    localStorage.getItem(STORAGE.RETURN_DATETIME) || ""
  );
  
  const [addressesReturn, setAddressesReturn] = useState<Address | undefined>(() => {
    const saved = localStorage.getItem(STORAGE.RETURN_ADDRESS);
    return saved ? JSON.parse(saved) : undefined;
  });

  const [boardingAddressId, setBoardingAddressId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE.BOARDING_ID)
  );
  
  const [returnAddressId, setReturnAddressId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE.RETURN_ID)
  );

  const [addressesLoading, setAddressesLoading] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isMapExpanded] = useState(false);
  
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(() => {
    const saved = localStorage.getItem(STORAGE.ROUTE_INFO);
    return saved ? JSON.parse(saved) : null;
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE.ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (addressesBoarding) {
      localStorage.setItem(STORAGE.BOARDING_ADDRESS, JSON.stringify(addressesBoarding));
    }
  }, [addressesBoarding]);

  useEffect(() => {
    if (addressesReturn) {
      localStorage.setItem(STORAGE.RETURN_ADDRESS, JSON.stringify(addressesReturn));
    }
  }, [addressesReturn]);

  useEffect(() => {
    if (boardingAddressId) {
      localStorage.setItem(STORAGE.BOARDING_ID, boardingAddressId);
    }
  }, [boardingAddressId]);

  useEffect(() => {
    if (returnAddressId) {
      localStorage.setItem(STORAGE.RETURN_ID, returnAddressId);
    }
  }, [returnAddressId]);

  useEffect(() => {
    localStorage.setItem(STORAGE.BOARDING_DATETIME, boardingDateTime);
  }, [boardingDateTime]);

  useEffect(() => {
    localStorage.setItem(STORAGE.RETURN_DATETIME, returnDateTime);
  }, [returnDateTime]);

  useEffect(() => {
    if (routeInfo) {
      localStorage.setItem(STORAGE.ROUTE_INFO, JSON.stringify(routeInfo));
    }
  }, [routeInfo]);

  // Update boarding/return addresses when IDs or addresses list changes
  useEffect(() => {
    if (boardingAddressId) {
      const found = addresses.find(addr => addr.id === boardingAddressId);
      if (found) {
        setAddressesBoarding(found);
      }
    }
  }, [boardingAddressId, addresses]);

  useEffect(() => {
    if (returnAddressId) {
      const found = addresses.find(addr => addr.id === returnAddressId);
      if (found) {
        setAddressesReturn(found);
      }
    }
  }, [returnAddressId, addresses]);

  const fetchData = useCallback(async (tripId: string) => {
    try {
      const privateTrip = await fetchTripById(tripId);
      if (privateTrip) setTrip(privateTrip);
    } catch (err) {
      console.error(err);
      addToast({ message: "⚠️ Failed to load trip.", type: "error" });
    }
  }, [fetchTripById, addToast]);

  const fetchAddresses = useCallback(async () => {
    setAddressesLoading(true);
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const res = await fetch("https://demo.telefreik.com/api/transports/profile/address-book", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          navigate("/login", { replace: true });
        }
        throw new Error("Failed to fetch addresses");
      }

      const json = await res.json();
      const enrichedAddresses = json.data.map((addr: Address) => ({
        ...addr,
        id: String(addr.id),
        value: `${addr.name} - ${addr.map_location?.address_name ?? ""}`,
      }));
      console.log('responce');
      console.log(json.data);
      console.log('enrichedAddresses');
      console.log(enrichedAddresses);
      setAddresses(enrichedAddresses);
    } catch (err) {
      console.error(err);
      addToast({
        message: "❌ Failed to fetch addresses.",
        type: "error",
      });
    } finally {
      setAddressesLoading(false);
    }
  }, [navigate, addToast]);

  useEffect(() => {
    fetchAddresses();
  }, [boardingAddressId]);

  const addNewAddress = useCallback(async (payload: AddAddressPayload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login", { replace: true });
        throw new Error("Not authenticated");
      }

      const res = await fetch("https://demo.telefreik.com/api/transports/profile/address-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.status !== 200 || !json.data) {
        throw new Error(json.message || "Unexpected server response");
      }
const newAddress = {
  ...json.data,
  id: String(json.data.id),
  value: `${json.data.name} - ${json.data.map_location?.address_name ?? ""}`,
};

// Create the new list by adding the new address
const newList = [...addresses, newAddress];

// Update the state
setAddresses(newList);

// Optional: If you want to verify the result immediately (but note setState is async)
console.log("Updated List:", newList);
console.log("New Address:", newAddress);
      // Set as boarding or return address if specified
      if (payload.for === 'boarding') {
        setBoardingAddressId(newAddress.id);
        setAddressesBoarding(newAddress);
      } else if (payload.for === 'return') {
        setReturnAddressId(newAddress.id);
        setAddressesReturn(newAddress);
      }

      addToast({ message: "✅ Address added successfully", type: "success" });
      return newAddress;
    } catch (err) {
      console.error(err);
      addToast({ message: "❌ Could not add address", type: "error" });
      throw err;
    }
  }, [navigate, addToast]);

  const calculateRoute = useCallback(async () => {
    if (!addressesBoarding || !addressesReturn) {
      addToast({ message: "Please select both boarding and return points", type: "warning" });
      return;
    }

    try {
      const origin = `${addressesBoarding.map_location.lat},${addressesBoarding.map_location.lng}`;
      const destination = `${addressesReturn.map_location.lat},${addressesReturn.map_location.lng}`;
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("Route calculation failed");
      }
      
      const route = data.routes[0];
      const newRouteInfo: RouteInfo = {
        distance: route.distance,
        duration: route.duration,
        polyline: route.geometry
      };
      
      setRouteInfo(newRouteInfo);
      addToast({ message: "Route calculated successfully", type: "success" });
    } catch (error) {
      console.error("Route calculation error:", error);
      addToast({ message: "Failed to calculate route", type: "error" });
    }
  }, [addressesBoarding, addressesReturn, addToast]);

  const getFormattedDistance = useCallback(() => {
    if (!routeInfo) return "N/A";
    
    if (routeInfo.distance < 1000) {
      return `${Math.round(routeInfo.distance)} meters`;
    }
    return `${(routeInfo.distance / 1000).toFixed(1)} km`;
  }, [routeInfo]);

  const getFormattedDuration = useCallback(() => {
    if (!routeInfo) return "N/A";
    
    const hours = Math.floor(routeInfo.duration / 3600);
    const minutes = Math.round((routeInfo.duration % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  }, [routeInfo]);

  const handleCreateTicket = useCallback(async () => {
    if (!trip || !boardingAddressId || !boardingDateTime) {
      addToast({ message: "Missing boarding data", type: "error" });
      return;
    }

    if (tripType === "round" && (!returnAddressId || !returnDateTime)) {
      addToast({ message: "Missing return data", type: "error" });
      return;
    }

    setIsCreatingTicket(true);

    try {
      const ticketPayload: CreateTicketPayload = {
        round: tripType === "round" ? 2 : 1,
        boarding: { date: boardingDateTime, address_id: boardingAddressId },
        return: {
          date: tripType === "round" ? returnDateTime : boardingDateTime,
          address_id: returnAddressId ?? boardingAddressId,
        },
      };

      const response = await createTicket(trip.id, ticketPayload);
      if (!response?.data?.payment_url) throw new Error("Missing payment URL");

      localStorage.setItem(STORAGE.TICKET_DATA, JSON.stringify(response));

      const paymentRes = await fetch(response.data.payment_url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          redirect: "follow"
        }
      });

      const paymentData = await paymentRes.json();
      if (paymentRes.ok && paymentData?.data?.url) {
        window.location.href = paymentData.data.url;
      } else {
        throw new Error("Payment URL fetch failed");
      }
    } catch (err) {
      console.error("Ticket/payment error:", err);
      addToast({ message: "🚨 Ticket/payment process failed", type: "error" });
    } finally {
      setIsCreatingTicket(false);
    }
  }, [
    trip,
    boardingAddressId,
    returnAddressId,
    boardingDateTime,
    returnDateTime,
    tripType,
    createTicket,
    addToast
  ]);

  return (
    <PrivateTripDataContext.Provider
      value={{
        trip,
        addresses,
        addressesBoarding,
        addressesReturn,
        boardingAddressId,
        returnAddressId,
        boardingDateTime,
        returnDateTime,
        isMapExpanded,
        addressesLoading,
        isCreatingTicket,
        routeInfo,
        setAddressesBoarding,
        setAddressesReturn,
        setBoardingAddressId,
        setReturnAddressId,
        setBoardingDateTime,
        setReturnDateTime,
        fetchData,
        fetchAddresses,
        addNewAddress,
        handleCreateTicket,
        calculateRoute,
        getFormattedDistance,
        getFormattedDuration
      }}
    >
      {children}
    </PrivateTripDataContext.Provider>
  );
};

export const usePrivateTripDataContext = (): PrivateTripDataContextType => {
  const context = useContext(PrivateTripDataContext);
  if (!context) {
    throw new Error("usePrivateTripDataContext must be used within PrivateTripDataProvider");
  }
  return context;
};