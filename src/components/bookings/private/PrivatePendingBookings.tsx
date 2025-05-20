import { FC } from "react";
import { useOrder } from "../../../context/OrderContext";
import { Order, PrivateOrder } from "../../../types/order";
import OrderCard from "../componenns/OrderCard";
import { usePrivateOrder } from "../../../context/PrivateOrderContext";
import PrivateOrderCard from "../componenns/PrivateOrderCard";


const PendingBookings: FC = () => {
  const { privateOrders: orders ,loading,fetchPrivateOrders} = usePrivateOrder();
  const now = new Date();

  // Helper function to check if an order is pending
  const isOrderPending = (order: PrivateOrder) => order.payment_data?.status_code === "pending" && order.can_pay && new Date(order.date_time) > now;

  // Filter orders to show only pending ones
  const pendingOrders = orders.filter(isOrderPending);

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

export default PendingBookings;
