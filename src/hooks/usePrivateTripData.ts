import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTicketPayload, usePrivateSearchContext } from "../context/PrivateSearchContext";
import { PrivateTrip } from "../types/types";
import { useToast } from "../context/ToastContext";
// Storage constants
const STORAGE = {
  ADDRESSES: "privateAddresses",
  BOARDING_ADDRESS: "privateBoardingAddress",
  RETURN_ADDRESS: "privateReturnAddress",
  BOARDING_ID: "boardingAddressId",
  RETURN_ID: "returnAddressId",
  BOARDING_DATETIME: "boardingDateTime",
  RETURN_DATETIME: "returnDateTime",
  TICKET_DATA: "latestPrivateTicket"
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
  map_location: {
    lat: string;
    lng: string;
    address_name: string;
  };
  notes: string;
};

export const usePrivateTripData = (tripId: string | undefined) => {
    const {
        searchValues,
        fetchTripById,
        createTicket,
        tripType,
        private_trip,
    } = usePrivateSearchContext();

    const { addToast } = useToast();
    const navigate = useNavigate();

    // State initialization with localStorage
    const [trip, setTrip] = useState<PrivateTrip | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    
    const [addresses, setAddresses] = useState<Address[]>(() => {
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE.ADDRESSES) : null;
        return saved ? JSON.parse(saved) : [];
    });

    const [addressesBoarding, setAddressesBoarding] = useState<Address | undefined>(() => {
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE.BOARDING_ADDRESS) : null;
        return saved ? JSON.parse(saved) : undefined;
    });

    const [addressesReturn, setAddressesReturn] = useState<Address | undefined>(() => {
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE.RETURN_ADDRESS) : null;
        return saved ? JSON.parse(saved) : undefined;
    });

    const [addressesLoading, setAddressesLoading] = useState(false);
    
    const [boardingAddressId, setBoardingAddressId] = useState<string | null>(() => {
        return typeof window !== "undefined" ? localStorage.getItem(STORAGE.BOARDING_ID) : null;
    });

    const [returnAddressId, setReturnAddressId] = useState<string | null>(() => {
        return typeof window !== "undefined" ? localStorage.getItem(STORAGE.RETURN_ID) : null;
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
        if (boardingAddressId !== null) {
            localStorage.setItem(STORAGE.BOARDING_ID, boardingAddressId);
        }
    }, [boardingAddressId]);

    useEffect(() => {
        if (returnAddressId !== null) {
            localStorage.setItem(STORAGE.RETURN_ID, returnAddressId);
        }
    }, [returnAddressId]);

    // Fetch trip data (unchanged)
    const fetchData = useCallback(async () => {
        if (!tripId) return;
        setLoading(true);
        try {
            const privateTrip = await fetchTripById(tripId);
            if (privateTrip) {
                setTrip(privateTrip);
            } else {
                setError("Trip not found.");
            }
        } catch (err) {
            console.error("Trip fetch error:", err);
            setError("Something went wrong while fetching the trip.");
        } finally {
            setLoading(false);
        }
    }, [tripId, fetchTripById]);

    // Enhanced fetchAddresses with caching
    const fetchAddresses = useCallback(async () => {
        setAddressesLoading(true);
        try {
            // Check for cached data first
            const cached = localStorage.getItem(STORAGE.ADDRESSES);
            const cachedTime = localStorage.getItem(`${STORAGE.ADDRESSES}_time`);
            
            if (cached && cachedTime && Date.now() - parseInt(cachedTime) < 3600000) {
                setAddresses(JSON.parse(cached));
                return;
            }

            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Missing token");

            const res = await fetch("https://portal.safaria.travel/api/transports/profile/address-book", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch addresses");

            const json = await res.json();
            const addressList = json.data as Address[];

            const enriched = addressList.map((addr) => ({
                ...addr,
                value: `${addr.name} - ${addr.map_location?.address_name ?? ""}`,
            }));

            setAddresses(enriched);
            localStorage.setItem(`${STORAGE.ADDRESSES}_time`, Date.now().toString());
        } catch (err) {
            console.error("Fetch addresses error:", err);
            addToast({
                message: "🚨 Failed to load saved addresses.",
                type: "error",
            });
        } finally {
            setAddressesLoading(false);
        }
    }, [addToast]);

    // Enhanced addNewAddress with auto-selection
    const addNewAddress = useCallback(async (payload: AddAddressPayload) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Missing token");

            const res = await fetch("https://portal.safaria.travel/api/transports/profile/address-book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const responseJson = await res.json();
            if (!res.ok || responseJson.status !== 200 || !responseJson.data) {
                throw new Error(responseJson.message || "Unexpected server response");
            }

            const newAddress: Address = responseJson.data;
            const enriched = {
                ...newAddress,
                value: `${newAddress.name} - ${newAddress.map_location.address_name}`,
            };

            // Auto-select if no selection exists
            if (!boardingAddressId) {
                setBoardingAddressId(`${newAddress.id}`);
                setAddressesBoarding(enriched);
            } else if (tripType === "round" && !returnAddressId) {
                setReturnAddressId(`${newAddress.id}`);
                setAddressesReturn(enriched);
            }

            addToast({
                message: "📍 Address added successfully.",
                type: "success",
            });

            return newAddress;
        } catch (err) {
            console.error("Add address error:", err);
            addToast({
                message: "❌ Could not add address.",
                type: "error",
            });
            throw err;
        }
    }, [boardingAddressId, returnAddressId, tripType, addToast]);

    // Enhanced handleCreateTicket with localStorage fallbacks
    const handleCreateTicket = useCallback(async () => {
        const boardingDate = localStorage.getItem(STORAGE.BOARDING_DATETIME) || "";
        const returnDate = localStorage.getItem(STORAGE.RETURN_DATETIME) || "";

        const boardingAddressIdFinal = boardingAddressId || localStorage.getItem(STORAGE.BOARDING_ID);
        const returnAddressIdFinal = returnAddressId || localStorage.getItem(STORAGE.RETURN_ID);

        if (!tripId || !trip) {
            addToast({
                message: "Invalid trip data. Please refresh and try again.",
                type: "error",
            });
            return;
        }

        if (!boardingAddressIdFinal || !boardingDate) {
            addToast({
                message: "Please select a boarding address and time.",
                type: "error",
            });
            return;
        }

        if (tripType === "round" && (!returnAddressIdFinal || !returnDate)) {
            addToast({
                message: "Please select a return address and time.",
                type: "error",
            });
            return;
        }

        try {
            setIsCreatingTicket(true);

            const boardingDateObj = new Date(boardingDate || "");
            const returnDateFinal = tripType === "round" 
                ? returnDate
                : new Date(boardingDateObj.getTime() + 10 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 16)
                    .replace("T", " ");

            const ticketPayload: CreateTicketPayload = {
                round: tripType === "round" ? 2 : 1,
                boarding: {
                    date: boardingDate,
                    address_id: boardingAddressIdFinal,
                },
                return: {
                    date: returnDateFinal,
                    address_id: `${returnAddressIdFinal}`,
                },
            };

            const response = await createTicket(parseInt(tripId), ticketPayload);
            const token = localStorage.getItem("authToken");

            if (!response?.data.payment_url) {
                throw new Error("Missing payment URL from ticket response");
            }

            localStorage.setItem(STORAGE.TICKET_DATA, JSON.stringify(response));

            const paymentRes = await fetch(response.data.payment_url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    redirect: "follow"
                },
            });

            const paymentData = await paymentRes.json();

            if (paymentRes.ok && paymentData?.data?.url) {
                window.location.href = paymentData.data.url;
            } else {
                throw new Error("Failed to get payment URL from response");
            }
        } catch (err) {
            console.error("Ticket creation or payment error:", err);
            addToast({
                message: "🚨 An unexpected error occurred during payment.",
                type: "error",
            });
        } finally {
            setIsCreatingTicket(false);
        }
    }, [
        tripId,
        trip,
        tripType,
        createTicket,
        addToast,
        boardingAddressId,
        returnAddressId,
    ]);

    const toggleMapExpansion = useCallback(() => {
        setIsMapExpanded((prev) => !prev);
    }, []);

    useEffect(() => {
        fetchData();
        fetchAddresses();
    }, []);

    return {
        trip,
        loading,
        error,
        isCreatingTicket,
        handleCreateTicket,
        toggleMapExpansion,
        isMapExpanded,
        addresses,
        addressesLoading,
        addNewAddress,
        boardingAddressId,
        setBoardingAddressId,
        returnAddressId,
        setReturnAddressId,
        addressesBoarding,
        setAddressesBoarding,
        addressesReturn,
        setAddressesReturn
    };
};