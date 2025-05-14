import { FC } from "react";
import { useTrainOrder } from "../../../context/TrainOrderContext";
import { TrainOrder } from "../../../types/order";
import { useTranslation } from "react-i18next";
import TrainOrderCard from "../componenns/TrainOrderCard";

const PendingBookings: FC = () => {
  const { trainOrders, loading } = useTrainOrder();
  const { t } = useTranslation();

  // Enhanced order filtering with only date_time available
  const isOrderPending = (order: TrainOrder) => {
    // Check payment status (multiple possible pending indicators)
    const isPaymentPending = 
      order.payment_data?.status === "pending" || 
      order.payment_data?.status_code === "pending";

    // Check order status
    const isOrderNotCanceled = order.status_code !== "canceled";
    const isOrderNotCompleted = order.status !== "completed";
    
    // Additional check for train-specific status
    const isTrainAvailable = !order.is_confirmed;

    return isPaymentPending && 
           isOrderNotCanceled && 
           isOrderNotCompleted &&
           isTrainAvailable;
  };

  // Filter and sort orders by trip date_time (newest first)
  const pendingOrders = trainOrders
    .filter(isOrderPending)
    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        {t("bookings.pending")} ({t("transport.train")})
      </h2>

      {loading ? (
        <p className="mt-4 text-gray-600">{t("Loading")}...</p>
      ) : pendingOrders.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {pendingOrders.map((order) => (
            <TrainOrderCard 
              key={order.id} 
              order={order}
              onCancel={() => console.log("Cancel order:", order.id)}
              onReview={() => console.log("Review order:", order.id)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600">
          {t("bookings.noBookings")}
        </p>
      )}
    </div>
  );
};

export default PendingBookings;