import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOrder } from "../../../context/OrderContext";
import { useTrainOrder } from "../../../context/TrainOrderContext";
import TrainOrderCard from "../componenns/TrainOrderCard";

const BusAllBookings : React.FC = () => {
  const { trainOrders ,fetchTrainOrders} = useTrainOrder();
  const { t } = useTranslation();

  useEffect(() => {

    fetchTrainOrders()

  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t("bookings.allBookings")}</h2>

      {trainOrders.length === 0 ? (
        <p className="text-gray-500">{t("bookings.noBookings")}</p>
      ) : (
        <div className="flex flex-col gap-5 ">
          {trainOrders.map((order) => (
            <TrainOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BusAllBookings ;
