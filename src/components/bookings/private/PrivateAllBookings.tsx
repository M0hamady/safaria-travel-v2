import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOrder } from "../../../context/OrderContext";
import OrderCard from "../componenns/OrderCard";
import { usePrivateOrder } from "../../../context/PrivateOrderContext";
import TrainOrderCard from "../componenns/TrainOrderCard";
import PrivateOrderCard from "../componenns/PrivateOrderCard";

const PrivateAllBookings : React.FC = () => {
  const { privateOrders ,fetchPrivateOrders} = usePrivateOrder();
  const { t } = useTranslation();

  useEffect(() => {

    fetchPrivateOrders()

  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t("bookings.allBookings")} private</h2>

      {privateOrders.length === 0 ? (
        <p className="text-gray-500">{t("bookings.noBookings")}</p>
      ) : (
        <div className="flex flex-col ">
          {privateOrders.map((order) => (
            <PrivateOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivateAllBookings ;
