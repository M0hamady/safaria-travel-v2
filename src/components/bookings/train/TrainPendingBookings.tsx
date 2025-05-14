import { FC } from "react";
import { useOrder } from "../../../context/OrderContext";
import { Order, TrainOrder } from "../../../types/order";
import OrderCard from "../componenns/OrderCard";
import { useTrainOrder } from "../../../context/TrainOrderContext";
import TrainOrderCard from "../componenns/TrainOrderCard";


const PendingBookings: FC = () => {
  const { trainOrders, loading } = useTrainOrder();

  // Helper function to check if an order is pending
  const isOrderPending = (order: TrainOrder) => order.payment_data?.status_code === "pending";

  // Filter orders to show only pending ones
  const pendingOrders = trainOrders.filter(isOrderPending);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800">Pending Bookings</h2>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : pendingOrders.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {pendingOrders.map((order) => (
            <TrainOrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No pending bookings found.</p>
      )}
    </div>
  );
};

export default PendingBookings;
