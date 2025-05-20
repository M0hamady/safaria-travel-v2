import { FC, useEffect } from "react";
import { usePrivateOrder } from "../../../context/PrivateOrderContext";
import PrivateOrderCard from "../componenns/PrivateOrderCard";

const PreviousBooking: FC = () => {
  const { privateOrders: orders, loading, fetchPrivateOrders } = usePrivateOrder();

  // Define what counts as a "pending" order correctly
  // Assuming pending means payment status is not "paid" or "success" but rather still pending?
  // But from your code, you probably want only orders with status "paid" or "success"
  
  const now = new Date();
  
  const isOrderPending = (order: any) => {
    const status = order.payment_data?.status_code;
    return status === "paid" || status === "success" && new Date(order.date_time) > now;
  };

  const pendingOrders = orders.filter(isOrderPending);

  // Optional: auto-fetch orders on mount
  useEffect(() => {
    if (!orders.length) {
      fetchPrivateOrders();
    }
  }, [fetchPrivateOrders, orders.length]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800">Pending Bookings private</h2>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : pendingOrders.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {pendingOrders.map((order) => (
            <PrivateOrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No pending bookings found.</p>
      )}
    </div>
  );
};

export default PreviousBooking;
