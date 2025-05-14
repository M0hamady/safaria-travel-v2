import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useOrder } from "../../../context/OrderContext";
import { Order, TrainOrder } from "../../../types/order";
import OrderCard from "../componenns/OrderCard";
import { useTrainOrder } from "../../../context/TrainOrderContext";
import TrainOrderCard from "../componenns/TrainOrderCard";

const CurrentBookings: FC = () => {
  const { trainOrders, loading } = useTrainOrder();
  const { t } = useTranslation();

  // Helper functions to filter orders
  const isOrderPaid = (order: TrainOrder) => order.payment_data?.status === "paid";
  const isOrderRunning = (order: TrainOrder) =>
    new Date(order.date_time) <= new Date() &&
    new Date(order.date) > new Date();

  // Filter orders to show only running or paid ones
  const filteredOrders = trainOrders.filter(
    (order) => isOrderPaid(order) || isOrderRunning(order)
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800">{t("bookings.CurrentBookings")}</h2>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : filteredOrders.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {filteredOrders.map((order) => (
            <TrainOrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{t("bookings.noBookings")}</p>
      )}
    </div>
  );
};

export default CurrentBookings;
