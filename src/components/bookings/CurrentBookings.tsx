import { FC } from "react";
import OrderCard from "./OrderCard";
import { useOrder } from "../../context/OrderContext";
import { Order } from "../../types/order";
import { useTranslation } from "react-i18next";

const CurrentBookings: FC = () => {
  const { orders, loading } = useOrder();
  const { t } = useTranslation();

  // Helper functions to filter orders
  const isOrderPaid = (order: Order) => order.payment_data?.status === "paid";
  const isOrderRunning = (order: Order) =>
    new Date(order.station_from.arrival_at) <= new Date() &&
    new Date(order.station_to.arrival_at) > new Date();

  // Filter orders to show only running or paid ones
  const filteredOrders = orders.filter(
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
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{t("bookings.noBookings")}</p>
      )}
    </div>
  );
};

export default CurrentBookings;
