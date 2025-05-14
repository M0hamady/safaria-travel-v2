// src/components/TrainOrderCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { formatTime } from "../../utilies/functionalities";
import { useTranslation } from "react-i18next";
import { TrainOrder } from "../../../types/order";

interface TrainOrderCardProps {
  order: TrainOrder;
  className?: string;
}

const TrainOrderCard: React.FC<TrainOrderCardProps> = ({ order, className = "" }) => {
  const { t } = useTranslation();

  const isOrderPaid = order.payment_data?.status === "paid";
  const isOrderCanceled = order.status_code === "canceled";
  const isToday = () => {
    const today = new Date();
    const orderDate = new Date(order.date_time);
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  };

  const borderStyle = () => {
    if (isOrderCanceled) return "border-gray-400 opacity-70";
    if (isToday()) return "border-primary";
    if (isOrderPaid) return "border-green-500";
    return "border-gray-300";
  };

  return (
    <div className={`rounded-2xl border-2 bg-white p-4 shadow-sm ${borderStyle()} ${className}`}>
      {/* Company logo and Train name */}
      <div className="flex items-center justify-between mb-4">
        {/* <img src={order?.train.avatar} alt="Train Logo" className="h-10 w-10 object-contain" /> */}
        <h3 className="text-lg font-bold">{order.train.name}</h3>
      </div>

      {/* Station details */}
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          🚉 <strong>{order.station_from.name}</strong> → <strong>{order.station_to.name}</strong>
        </p>
        <p>
          🕒 {formatTime(order.date_time)} | {new Date(order.date_time).toLocaleDateString()}
        </p>
        {isOrderCanceled && <p className="text-red-500 font-semibold">{t("order.canceled")}</p>}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {order.payment_data?.invoice_url && !isOrderPaid && !isOrderCanceled && (
          <a
            href={order.payment_data.invoice_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
          >
            💳 {t("order.pay")}
          </a>
        )}

        {isOrderPaid && (
          <Link
            to={`/trips/trip/${order.id}`}
            className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
          >
            {t("order.viewTrip")}
          </Link>
        )}
      </div>
    </div>
  );
};

export default TrainOrderCard;
