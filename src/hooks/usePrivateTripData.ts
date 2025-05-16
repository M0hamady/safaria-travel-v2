import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTicketPayload, usePrivateSearchContext } from "../context/PrivateSearchContext";
import { PrivateTrip } from "../types/types";
import { useToast } from "../context/ToastContext";

// Types
type Address = {
    id: number;
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

    // State
    const [trip, setTrip] = useState<PrivateTrip | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [addressesBoarding, setAddressesBoarding] = useState<Address>();
    const [addressesReturn, setAddressesReturn] = useState<Address>();
    const [addressesLoading, setAddressesLoading] = useState(false);
    const [boardingAddressId, setBoardingAddressId] = useState<string | null>(null);
    const [returnAddressId, setReturnAddressId] = useState<string | null>(null);

    // Fetch trip data
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

    // Fetch saved addresses
    const fetchAddresses = useCallback(async () => {
        setAddressesLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Missing token");

            const res = await fetch("https://app.telefreik.com/api/transports/profile/address-book", {
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
        } catch (err) {
            console.error("Fetch addresses error:", err);
            addToast({
                id: "address-fetch-error",
                message: "🚨 Failed to load saved addresses.",
                type: "error",
            });
        } finally {
            setAddressesLoading(false);
        }
    }, [addToast]);

    // Add a new address
    const addNewAddress = useCallback(async (payload: AddAddressPayload) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Missing token");

            const res = await fetch("https://app.telefreik.com/api/transports/profile/address-book", {
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

            if (!boardingAddressId && newAddress) {
              setBoardingAddressId(`${newAddress.id}`)
            }
            if (boardingAddressId && !returnAddressId && newAddress) {
              setReturnAddressId(`${newAddress.id}`)
            }
            setAddresses((prev) => [...prev, enriched]);
            window.location.reload()
            addToast({
                id: "address-added",
                message: "📍 Address added successfully.",
                type: "success",
            });

            return newAddress;
        } catch (err) {
            console.error("Add address error:", err);
            addToast({
                id: "address-add-fail",
                message: "❌ Could not add address.",
                type: "error",
            });
            throw err;
        }
    }, []);
    useEffect(() => {
        if (boardingAddressId !== null) {
            localStorage.setItem("boardingAddressId", boardingAddressId.toString());
        }

        if (returnAddressId !== null) {
            localStorage.setItem("returnAddressId", returnAddressId.toString());
        }
    }, [boardingAddressId, returnAddressId]);

    // Handle ticket creation
const handleCreateTicket = useCallback(async () => {
  const boardingDate = localStorage.getItem("boardingDateTime") || "";
  const returnDate = localStorage.getItem("returnDateTime") || "";

  const boardingAddressIdFinal =
    boardingAddressId || localStorage.getItem("boardingAddressId");
  const returnAddressIdFinal =
    returnAddressId || localStorage.getItem("returnAddressId");

  if (!tripId || !trip) {
    addToast({
      id: "invalid-trip",
      message: "Invalid trip data. Please refresh and try again.",
      type: "error",
    });
    return;
  }

  if (!boardingAddressIdFinal || !boardingDate) {
    addToast({
      id: "missing-boarding",
      message: "Please select a boarding address and time.",
      type: "error",
    });
    return;
  }

  if (tripType === "round" && (!returnAddressIdFinal || !returnDate)) {
    addToast({
      id: "missing-return",
      message: "Please select a return address and time.",
      type: "error",
    });
    return;
  }

  try {
    setIsCreatingTicket(true);

const boardingDateObj = new Date(boardingDate || "");
const returnDateFinal =
  tripType === "round"
    ? returnDate
    : new Date(boardingDateObj.getTime() + 10 * 60 * 60 * 1000) // Add 3 hours
        .toISOString()
        .slice(0, 16)
        .replace("T", " "); // Format as "YYYY-MM-DD HH:mm"

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
        console.log(response);
      throw new Error("Missing payment URL from ticket response");
    }
    // Save ticket in localStorage
    localStorage.setItem("latestTicket", JSON.stringify(response));

    // Proceed to POST to the payment URL
    const paymentRes = await fetch(response.data.payment_url, {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        // Accept: "application/json",
        Authorization: `Bearer ${token}`,
          redirect: "follow"

      },
    });

    const paymentData = await paymentRes.json();

    if (paymentRes.ok && paymentData?.data?.url) {
      // Navigate to the payment page
      window.location.href = paymentData.data.url;
    } else {
      throw new Error("Failed to get payment URL from response");
    }
  } catch (err) {
    console.error("Ticket creation or payment error:", err);
    addToast({
      id: "payment-error",
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
  navigate,
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
