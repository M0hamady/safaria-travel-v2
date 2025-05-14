// src/components/PrivateOrderCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Order, PrivateOrder } from "../../../types/order";
import { useTranslation } from "react-i18next";
import { formatTime } from "../../utilies/functionalities";

interface PrivateOrderCardProps {
  order: PrivateOrder;
  className?: string;
}

const PrivateOrderCard: React.FC<PrivateOrderCardProps> = ({ order, className = "" }) => {
  const { t } = useTranslation();

  const isOrderCanceled = () => order.status_code === "canceled";
  const isOrderPaid = () => order.payment_data?.status === "paid";

  const getBorderClass = (): string => {
    if (isOrderCanceled()) return "border-2 border-dashed border-gray-400 opacity-70";
    if (isOrderPaid()) return "border-2 border-green-400";
    return "border-2 border-yellow-400";
  };

  return (
    <div
      className={`rounded-2xl border bg-white shadow-md duration-300 ease-in-out ${getBorderClass()} p-4 mb-6 hover:shadow-lg transition-shadow ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
           {order.bus.featured_image && 
           <img
            className="h-12 w-12 object-contain rounded-full"
            src={order.bus.featured_image}
            alt="Company Logo"
          />
           }
          <div>
<h3 className="text-xl font-semibold">{order?.bus?.name}</h3>
            <p className="text-gray-500 text-sm">{t("order.id")}: #{order.id}</p>
          </div>
        </div>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            isOrderCanceled() ? "bg-gray-300 text-gray-600" : isOrderPaid() ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isOrderCanceled()
            ? t("order.canceled")
            : isOrderPaid()
            ? t("order.paid")
            : t("order.pending")}
        </span>
      </div>

      {/* Trip Info */}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <p>
          {/* 🚍 {t("order.from")}: <strong>{order.from_location}</strong> */}
        </p>
        <p>
          {/* 🛬 {t("order.to")}: <strong>{order.to_location}</strong> */}
        </p>
        <p>
          📅 {t("order.date")}: <strong>{formatTime(order.date_time)}</strong>
        </p>
        <p>
          👥 {t("order.passengers")}: <strong>{order.id}</strong>
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        {isOrderPaid() && !isOrderCanceled() ? (
          <Link
            to={`/private/trip/${order.id}`}
            className="inline-flex h-10 px-4 items-center justify-center rounded-[8px] bg-primary text-white text-sm font-medium shadow hover:bg-primary-dark transition-colors"
          >
            {t("order.viewTrip")}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default PrivateOrderCard;
