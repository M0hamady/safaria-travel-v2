import { FC } from "react";
import { useOrder } from "../../../context/OrderContext";
import { Order } from "../../../types/order";
import OrderCard from "../componenns/OrderCard";


const PreviousBookings: FC = () => {
  const { orders, loading } = useOrder();

  // Helper function to check if an order is in the past and paid
  const isOrderInPastAndPaid = (order: Order) => {
    return order.payment_data?.status === "paid" && new Date(order.date_time) < new Date();
  };

  // Filter orders to show only previous ones
  const previousOrders = orders.filter(isOrderInPastAndPaid);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800">Previous Bookings private</h2>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : previousOrders.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {previousOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No previous bookings found.</p>
      )}
    </div>
  );
};

export default PreviousBookings;
