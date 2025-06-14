import React, { createContext, useContext, useState, useEffect } from "react";
import { Order } from "../types/order";
import { AuthContext } from "./AuthContext";
import { apiFetch, BASE_URL } from "../components/utilies/api";

// Define the context type
interface OrderContextType {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => void;
  getOrderById: (orderId: number) => Promise<Order | null>;
  addReview: (orderId: number, rating: number, comment: string) => Promise<boolean>;
  cancelOrder: (orderId: number) => Promise<boolean>;
}

// Create Order Context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // ✅ Added loading state

  useEffect(() => {
    if (user?.api_token) fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    if (!user?.api_token) return;
    
    setLoading(true); // ✅ Start loading
    try {
      const data = await apiFetch<{ data: Order[] }>(`${BASE_URL}/api/transports/profile/orders`, {
        headers: { Authorization: `Bearer ${user.api_token}` },
      });
      setOrders(data.data); // ✅ Update orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  // Get order details by ID
  const getOrderById = async (orderId: number): Promise<Order | null> => {
    try {
      return await apiFetch<Order>(`${BASE_URL}/api/transports/profile/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${user?.api_token}` },
      });
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return null;
    }
  };

  // Add a review to an order
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
      fetchOrders()
      return true;
    } catch (error) {
      console.error(`Error adding review to order ${orderId}:`, error);
      return false;
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId: number): Promise<boolean> => {
    try {
      await apiFetch(`${BASE_URL}/api/transports/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.api_token}` },
      });
      fetchOrders(); // Refresh orders after canceling
      return true;
    } catch (error) {
      console.error(`Error canceling order ${orderId}:`, error);
      return false;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders, getOrderById, addReview, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook for using the Order Context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
