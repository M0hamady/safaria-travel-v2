import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch, BASE_URL } from "../components/utilies/api";
import { PrivateOrder } from "../types/order";

interface PrivateOrderContextType {
  privateOrders: PrivateOrder[];
  loading: boolean;
  fetchPrivateOrders: () => void;
  getPrivateOrderById: (orderId: number) => Promise<PrivateOrder | null>;
  addReview: (orderId: number, rating: number, comment: string) => Promise<boolean>;
  cancelPrivateOrder: (orderId: number) => Promise<boolean>;
}

const PrivateOrderContext = createContext<PrivateOrderContextType | undefined>(undefined);

export const PrivateOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [privateOrders, setPrivateOrders] = useState<PrivateOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.api_token) fetchPrivateOrders();
  }, [user?.api_token]);

  const fetchPrivateOrders = async () => {
    if (!user?.api_token) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ data: PrivateOrder[] }>(
        `${BASE_URL}/api/transports/profile/orders/private`,
        {
          headers: { Authorization: `Bearer ${user.api_token}` },
        }
      );
      setPrivateOrders(data.data);
    } catch (error) {
      console.error("Error fetching private orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPrivateOrderById = async (orderId: number): Promise<PrivateOrder | null> => {
    try {
      return await apiFetch<PrivateOrder>(
        `${BASE_URL}/api/transports/profile/orders/private/${orderId}`,
        {
          headers: { Authorization: `Bearer ${user?.api_token}` },
        }
      );
    } catch (error) {
      console.error(`Error fetching private order ${orderId}:`, error);
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
      fetchPrivateOrders();
      return true;
    } catch (error) {
      console.error(`Error adding review to private order ${orderId}:`, error);
      return false;
    }
  };

  const cancelPrivateOrder = async (orderId: number): Promise<boolean> => {
    try {
      await apiFetch(`${BASE_URL}/api/transports/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.api_token}` },
      });
      fetchPrivateOrders();
      return true;
    } catch (error) {
      console.error(`Error canceling private order ${orderId}:`, error);
      return false;
    }
  };

  return (
    <PrivateOrderContext.Provider
      value={{
        privateOrders,
        loading,
        fetchPrivateOrders,
        getPrivateOrderById,
        addReview,
        cancelPrivateOrder,
      }}
    >
      {children}
    </PrivateOrderContext.Provider>
  );
};

export const usePrivateOrder = () => {
  const context = useContext(PrivateOrderContext);
  if (!context) {
    throw new Error("usePrivateOrder must be used within a PrivateOrderProvider");
  }
  return context;
};
