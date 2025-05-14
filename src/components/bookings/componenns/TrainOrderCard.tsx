import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatTime } from "../../utilies/functionalities";
import { TrainOrder } from "../../../types/order";
import DateTimeDisplay from "../../utilies/DateTimeDisplay";

interface TrainOrderCardProps {
  order: TrainOrder;
  className?: string;
  onCancel?: (orderId: string) => void;
  onReview?: (orderId: string) => void;
}

const TrainOrderCard: React.FC<TrainOrderCardProps> = ({ order, className = "", onCancel, onReview }) => {
  const { t } = useTranslation();

  const isOrderPaid = order.payment_data?.status === "paid";
  const isOrderCanceled = order.status_code === "canceled";
  const canBeReviewed = order.can_review;
  const ticketsCount = order?.tickets?.length || 0;

  const isFutureOrder = () => {
    const today = new Date();
    const orderDate = new Date(order.date_time);
    return orderDate > today;
  };

  const borderStyle = () => {
    if (isOrderCanceled) return "border-red-500";
    if (isOrderPaid) return "border-green-500";
    if (isFutureOrder()) return "border-blue-500 border-dashed";
    return "border-gray-300";
  };

  return (
    <div className={`rounded-xl border-2 p-5 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out ${borderStyle()} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">{order.train.name}</h3>
        <span className="text-base text-gray-600" title={t("passengers.title_plural", { count: ticketsCount })}>
          🎫 {t("passengers.title_plural", { count: ticketsCount })}
        </span>
      </div>

      {/* Trip Info */}
      <div className="text-base text-gray-700 space-y-2">
        <p>
          🚉 <strong>{t("From")}:</strong> {order.station_from.name} → <strong>{t("To")}:</strong> {order.station_to.name}
        </p>
        <p>
          🕒 <strong>{t("departure")}:</strong> <DateTimeDisplay  value={order.date}/> 
        </p>
        {isOrderCanceled && <p className="text-red-600 font-semibold">{t("order.canceled")}</p>}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap gap-3">
        {/* Payment Button */}
        {order.payment_data?.invoice_url && !isOrderPaid && !isOrderCanceled && (
          <a
            href={order.payment_data.invoice_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200 ease-in-out"
          >
            💳 {t("order.pay")}
          </a>
        )}

        {/* Trip Details */}
        {isOrderPaid && (
          <Link
            to={`/trips/trip/${order.id}`}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            📜 {t("order.viewTrip")}
          </Link>
        )}

        {/* Cancel Order */}
        {!isOrderCanceled && !isFutureOrder() && (
          <button
            onClick={() => onCancel?.(`${order.id}`)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200 ease-in-out"
          >
            ❌ {t("order.cancel")}
          </button>
        )}

        {/* Review */}
        {canBeReviewed && isOrderPaid && (
          <button
            onClick={() => onReview?.(`${order.id}`)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200 ease-in-out"
          >
            ⭐ {t("order.review")}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainOrderCard;