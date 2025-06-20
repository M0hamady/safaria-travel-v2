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
  for?: string;
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
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  // Route information state
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(() => {
    const saved = localStorage.getItem(STORAGE.ROUTE_INFO);
    return saved ? JSON.parse(saved) : null;
  });

  // Persist relevant state
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
    const token_m = localStorage.getItem("authToken");
    
    if (token_m) {
      try {
        const res = await fetch("https://demo.telefreik.com/api/transports/profile/address-book", {
          headers: { Authorization: `Bearer ${token_m}` },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            navigate("/login", { replace: true });
          }
          throw new Error("Failed to fetch addresses");
        }

        const json = await res.json();
        const enriched = json.data.map((addr: Address) => ({
          ...addr,
          id: String(addr.id), // force id to be string
          value: `${addr.name} - ${addr.map_location?.address_name ?? ""}`,
        }));

        setAddresses(enriched);
        localStorage.setItem(`${STORAGE.ADDRESSES}_time`, Date.now().toString());
      } catch (err) {
        console.error(err);
        addToast({
          message: "❌ Failed to fetch addresses.",
          type: "error",
        });
      } finally {
        setAddressesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  useEffect(() => {
    if (boardingAddressId) {
      const found = addresses.find(addr => `${addr.id}` === boardingAddressId);
      setAddressesBoarding(found);
      setBoardingAddressId(`${found?.id}`);
      if (addressesBoarding?.id !== `${found?.id}`) {
        // window.location.reload();
      }
    }
  }, [boardingAddressId, addresses]);

  useEffect(() => {
    if (returnAddressId) {
      const found = addresses.find(addr => `${addr.id}` === returnAddressId);
      setAddressesReturn(found);
      if (addressesReturn?.id !== `${found?.id}`) {
        // window.location.reload();
      }
    }
  }, [returnAddressId, addresses]);
useEffect(() => {
  if (addressesReturn) {
      localStorage.setItem(STORAGE.RETURN_ID, addressesReturn.id);
      localStorage.setItem(STORAGE.RETURN_ADDRESS, JSON.stringify(addressesReturn));

    } 
}, [addressesReturn])
useEffect(() => {
  if (addressesReturn) {
      localStorage.setItem(STORAGE.BOARDING_ID, addressesReturn.id);
      localStorage.setItem(STORAGE.BOARDING_ADDRESS, JSON.stringify(addressesReturn));

    } 
}, [addressesBoarding])
useEffect(() => {
  console.log(addressesBoarding);
  console.log(boardingAddressId);
  if (addressesReturn) {
      localStorage.setItem(STORAGE.RETURN_ID, addressesReturn.id);
      localStorage.setItem(STORAGE.RETURN_ADDRESS, JSON.stringify(addressesReturn));

    } 

  if (addressesReturn) {
      localStorage.setItem(STORAGE.BOARDING_ID, addressesReturn.id);
      localStorage.setItem(STORAGE.BOARDING_ADDRESS, JSON.stringify(addressesReturn));

    } 
}, [addresses,returnAddressId,boardingAddressId])

  const addNewAddress = useCallback(async (payload: AddAddressPayload) => {
    try {
      const token = localStorage.getItem("authToken");
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

      fetchAddresses();
      const newAddress = {
        ...json.data,
        value: `${json.data.name} - ${json.data.map_location?.address_name ?? ""}`,
      };

      if (payload.for === 'boarding') {
        setBoardingAddressId(`${newAddress.id}`);
        setAddressesBoarding(newAddress);
      } else if (payload.for === 'return') {
        setReturnAddressId(`${newAddress.id}`);
        setAddressesReturn(newAddress);
      }
      
      addToast({ message: "✅ Address added successfully", type: "success" });
      return newAddress;
    } catch (err) {
      console.error(err);
      addToast({ message: "❌ Could not add address", type: "error" });
      throw err;
    }
  }, [tripType, boardingAddressId, returnAddressId, addToast]);

  // Calculate route between boarding and return points
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
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        polyline: route.geometry
      };
      
      setRouteInfo(newRouteInfo);
      addToast({ message: "Route calculated successfully", type: "success" });
    } catch (error) {
      console.error("Route calculation error:", error);
      addToast({ message: "Failed to calculate route", type: "error" });
    }
  }, [addressesBoarding, addressesReturn, addToast]);

  // Format distance for display
  const getFormattedDistance = useCallback(() => {
    if (!routeInfo) return "N/A";
    
    if (routeInfo.distance < 1000) {
      return `${Math.round(routeInfo.distance)} meters`;
    }
    return `${(routeInfo.distance / 1000).toFixed(1)} km`;
  }, [routeInfo]);

  // Format duration for display
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
    try {
      const boardingDate = localStorage.getItem(STORAGE.BOARDING_DATETIME);
      const returnDate = localStorage.getItem(STORAGE.RETURN_DATETIME);
      const boardingId = boardingAddressId || localStorage.getItem(STORAGE.BOARDING_ID);
      const returnId = returnAddressId || localStorage.getItem(STORAGE.RETURN_ID);

      if (!trip || !boardingId || !boardingDate) {
        throw new Error("Missing boarding data");
      }

      if (tripType === "round" && (!returnId || !returnDate)) {
        throw new Error("Missing return data");
      }

      setIsCreatingTicket(true);

      const ticketPayload: CreateTicketPayload = {
        round: tripType === "round" ? 2 : 1,
        boarding: { date: boardingDate, address_id: boardingId },
        return: {
          date: tripType === "round" ? returnDate! : boardingDate,
          address_id: returnId ?? boardingId,
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
  }, [trip, boardingAddressId, returnAddressId, tripType, createTicket, addToast]);

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
        isMapExpanded: false,
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