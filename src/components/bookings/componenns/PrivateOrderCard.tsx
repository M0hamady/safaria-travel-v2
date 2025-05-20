import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateOrder } from "../../../types/order";
import { formatTime } from "../../utilies/functionalities";
import ReviewModal from "./ReviewModalPrivate";
import { useModal } from "../../../context/ModalContext";
import { usePrivateOrder } from "../../../context/PrivateOrderContext";
import DateTimeDisplay from "../../utilies/DateTimeDisplay";

interface PrivateOrderCardProps {
  order: PrivateOrder;
  className?: string;
}

const PrivateOrderCard: React.FC<PrivateOrderCardProps> = ({ order, className = "" }) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { cancelPrivateOrder } = usePrivateOrder(); // ✅ Hook for canceling
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const orderDate = new Date(order.date_time);

  const isCanceled = order.status_code === "canceled";
  const isPaid = order.payment_data?.status === "paid";
  const isFuture = orderDate > now;
  const canPay = order.can_pay;

  const getBorderStyle = () => {
    if (isCanceled) return "border-red-500 border-2 border-dashed opacity-70";
    if (canPay) return "border-primary border-2 border-dashed";
    if (isPaid && isFuture) return "border-green-400 border-2 border-dashed";
    if (isPaid && !isFuture) return "border-green-700 border-2 border-dashed opacity-80";
    return "border-yellow-400 border-2 border-dashed";
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    console.log("Review submitted:", { orderId: order.id, rating, comment });
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

 const handleAddReview = () => {
    let triggerSubmit: () => void;

    openModal({
      title: t("tripDetails.addReview"),
      children: (
        <ReviewModal
          orderId={order.id}
          setTriggerSubmit={(fn: () => void) => {
            triggerSubmit = fn;
          }}
          onSubmit={async (rating, comment) => {
            await handleReviewSubmit(rating, comment);
          }}
        />
      ),
      button1Label: t("submit"),
      button2Label: t("cancel"),
      button1Action: async () => {
        if (triggerSubmit) triggerSubmit();
      },
      button2Action: () => {},
    });
  };
  const handleCancelOrder = async () => {
    setLoading(true);
    const success = await cancelPrivateOrder(order.id);
    setLoading(false);
    if (success) {
      window.location.reload(); // optional, or update UI state
    } else {
      alert(t("tripDetails.cancelFailed")); // optional better error handling
    }
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(order.payment_url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Payment initiation failed");
  const data = await response.json();

    if (response.ok && data.status === 200 && data.data?.url) {
      window.location.href = data.data.url; // ✅ Redirect to payment page
    } else {
      console.error("Invalid response:", data);
      alert(t("tripDetails.paymentError")); // Optional: show a toast instead
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert(t("tripDetails.paymentError"));
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`rounded-2xl bg-white shadow-md transition-shadow duration-300 ease-in-out p-4 mb-6 hover:shadow-lg ${getBorderStyle()} ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {order.bus.featured_image && (
            <img
              className="h-12 w-12 object-contain rounded-full"
              src={order.bus.featured_image}
              alt="Bus Logo"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{order?.bus?.name}</h3>
            <p className="text-gray-500 text-xs">#{order.id}</p>
          </div>
        </div>
        {/* <div className="flex gap-1 text-yellow-500 text-sm">★★★★★</div> */}
        <div className="text-right">
          <p className="text-base font-bold text-primary">{order.total} {t('price_unit')}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex justify-between border-t pt-4 text-sm text-gray-700">
        <div className="flex-1">
          <p>📍 {t("tripDetails.from")}: <strong>{order.from_location?.name}</strong></p>
          <p className="mt-2">📌 {t("tripDetails.to")}: <strong>{order.to_location?.name}</strong></p>
        </div>
        <div className="text-right">
          <p><DateTimeDisplay  value={order.date_time} /></p>
          {order.date ? (
            <p className="mt-2"><DateTimeDisplay  value={order.date} /></p>
          ) : (
            <p className="mt-2"><DateTimeDisplay  value={order.date_time} /></p>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {order.can_be_cancel && !isCanceled && (
          <button
            onClick={handleCancelOrder}
            disabled={loading}
            className="h-10 px-4 inline-flex items-center justify-center rounded-md border border-red-500 text-red-600 hover:bg-red-50 text-sm font-medium"
          >
            {loading ? t("loading") : t("tripDetails.cancel")}
          </button>
        )}

        {canPay && !isCanceled && (
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="h-10 px-4 inline-flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary-dark text-sm font-medium"
          >
            {loading ? t("loading") : t("tripDetails.pay")}
          </button>
        )}

        {isPaid && !isCanceled && (
          <Link
            to={`/private/trip/${order.id}`}
            className="h-10 px-4 inline-flex items-center justify-center rounded-md bg-gray-800 text-white hover:bg-gray-700 text-sm font-medium"
          >
            {t("tripDetails.viewTrip")}
          </Link>
        )}

        {isFuture && isPaid && !isCanceled && (
          <button
            onClick={handleAddReview}
            className="h-10 px-4 rounded-md border border-yellow-600 text-yellow-800 hover:bg-yellow-50 text-sm font-medium"
          >
            {t("tripDetails.leaveReview")}
          </button>
        )}
      </div>
    </div>
  );
};

export default PrivateOrderCard;
