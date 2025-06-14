import React, { createContext, useContext, useEffect, useState } from "react";
import { TrainOrder } from "../types/order"; // Adjust if TrainOrder is in a different file
import { AuthContext } from "./AuthContext";
import { apiFetch, BASE_URL } from "../components/utilies/api";

// Define the context type
interface TrainOrderContextType {
trainOrders: TrainOrder[];
  loading: boolean;
  fetchTrainOrders: () => void;
  getTrainOrderById: (orderId: number) => Promise<TrainOrder | null>;
  addReview: (orderId: number, rating: number, comment: string) => Promise<boolean>;
  cancelTrainOrder: (orderId: number) => Promise<boolean>;
}

// Create Train Order Context
const TrainOrderContext = createContext<TrainOrderContextType | undefined>(undefined);

export const TrainOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [trainOrders, setTrainOrders] = useState<TrainOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.api_token) fetchTrainOrders();
  }, []);

  const fetchTrainOrders = async () => {
    if (!user?.api_token) return;

    setLoading(true);
    try {
      const data = await apiFetch<{ data: TrainOrder[] }>(
        `${BASE_URL}/api/transports/profile/orders/trains`,
        {
          headers: { Authorization: `Bearer ${user.api_token}` },
        }
      );
      setTrainOrders(data.data);
    } catch (error) {
      console.error("Error fetching train orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrainOrderById = async (orderId: number): Promise<TrainOrder | null> => {
    try {
      return await apiFetch<TrainOrder>(
        `${BASE_URL}/api/transports/profile/orders/trains/${orderId}`,
        {
          headers: { Authorization: `Bearer ${user?.api_token}` },
        }
      );
    } catch (error) {
      console.error(`Error fetching train order ${orderId}:`, error);
      return null;
    }
  };

  const addReview = async (orderId: number, rating: number, comment: string): Promise<boolean> => {
    try {
      await apiFetch(`${BASE_URL}/api/transports/orders/${orderId}/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.api_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });
      fetchTrainOrders();
      return true;
    } catch (error) {
      console.error(`Error adding review to train order ${orderId}:`, error);
      return false;
    }
  };

  const cancelTrainOrder = async (orderId: number): Promise<boolean> => {
    try {
      await apiFetch(`${BASE_URL}/api/transports/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.api_token}` },
      });
      fetchTrainOrders();
      return true;
    } catch (error) {
      console.error(`Error canceling train order ${orderId}:`, error);
      return false;
    }
  };

  return (
    <TrainOrderContext.Provider
      value={{ trainOrders, loading, fetchTrainOrders, getTrainOrderById, addReview, cancelTrainOrder }}
    >
      {children}
    </TrainOrderContext.Provider>
  );
};

// Custom hook to use the Train Order Context
export const useTrainOrder = () => {
  const context = useContext(TrainOrderContext);
  if (!context) {
    throw new Error("useTrainOrder must be used within a TrainOrderProvider");
  }
  return context;
};
