import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOrder } from "../../../context/OrderContext";
import OrderCard from "../componenns/OrderCard";

const BusAllBookings : React.FC = () => {
  const { orders ,fetchOrders} = useOrder();
  const { t } = useTranslation();

  useEffect(() => {

    fetchOrders()

  }, []);

  return (
    <div className="p-4 max-sm:px-0">
      <h2 className="text-xl font-bold mb-4">{t("bookings.allBookings")}</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">{t("bookings.noBookings")}</p>
      ) : (
        <div className="flex flex-col ">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BusAllBookings ;
