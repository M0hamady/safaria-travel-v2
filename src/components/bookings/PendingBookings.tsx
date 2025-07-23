import { FC } from "react";
import OrderCard from "./OrderCard";
import { useOrder } from "../../context/OrderContext";
import { Order } from "../../types/order";

const PendingBookings: FC = () => {
  const { orders, loading } = useOrder();

  // Helper function to check if an order is pending
  const isOrderPending = (order: Order) => order.payment_data?.status_code === "pending";

  // Filter orders to show only pending ones
  const pendingOrders = orders.filter(isOrderPending);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800">Pending Bookings</h2>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : pendingOrders.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {pendingOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No pending bookings found.</p>
      )}
    </div>
  );
};

export default PendingBookings;
