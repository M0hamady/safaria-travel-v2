import React, { JSX, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TrainOrder } from "../../../types/order";
import DateTimeDisplay from "../../utilies/DateTimeDisplay";
import { useModal } from "../../../context/ModalContext";
import ReviewModal from "./ReviewModal";

interface TrainOrderCardProps {
  order: TrainOrder;
  className?: string;
  onCancel?: (orderId: string) => void;
  onReview?: (orderId: string) => void;
}

const TrainOrderCard: React.FC<TrainOrderCardProps> = ({ 
  order, 
  className = "", 
  onCancel, 
  onReview 
}) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  // Order status logic
  const getOrderStatus = () => {
    const now = new Date();
    const orderDate = new Date(order.date_time);
    
    if (order.status_code === "canceled") return "canceled";
    if (order.payment_data?.status_code === "pending") return "pendingPayment";
    
    if (order.payment_data?.status === "paid") {
      const isToday = orderDate.toDateString() === now.toDateString();
      if (orderDate < now) return isToday ? "todayAndPaid" : "pastAndPaid";
      return "futureAndPaid";
    }
    
    return "default";
  };

  const orderStatus = getOrderStatus();

  // Border style based on status
  const getBorderStyle = () => {
    switch (orderStatus) {
      case "pendingPayment": return "border-2 border-dashed border-red-400";
      case "todayAndPaid": return "border-2 border-primary";
      case "futureAndPaid": return "border-2 border-green-400";
      case "pastAndPaid": return "border-sky-600";
      case "canceled": return "border-2 border-dashed border-gray-400 opacity-70";
      default: return "border-2 border-dashed border-gray-400";
    }
  };

  // Review handling
  const handleReviewSubmit = async (rating: number, comment: string): Promise<void> => {
    console.log("Review submitted:", { orderId: order.id, rating, comment });
    await new Promise(resolve => setTimeout(resolve, 500));
    if (onReview) {
      await onReview(`${order.id}`);
    }
  };

  const handleAddReview = () => {
    let triggerSubmit: () => void;

    openModal({
      title: t("tripDetails.addReview"),
      children: (
        <ReviewModal
          orderId={order.id}
          setTriggerSubmit={(fn: () => void) => { triggerSubmit = fn; }}
          onSubmit={handleReviewSubmit}
        />
      ),
      button1Label: t("submit"),
      button2Label: t("cancel"),
      button1Action: () => triggerSubmit?.(),
      button2Action: closeModal,
    });
  };

  // Order actions
  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      const success = await onCancel?.(`${order.id}`);
      if (success) window.location.reload();
      else alert(t("tripDetails.cancelFailed"));
    } finally {
      setLoading(false);
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
      if (data.status === 200 && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(t("tripDetails.paymentError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    openModal({
      title: t("order.downloadTicket"),
      message: t("order.downloadConfirmation"),
      button1Label: t("download"),
      button2Label: t("cancel"),
      button1Action: () => console.log("Download ticket", order.id),
      button2Action: closeModal,
    });
  };

  // Action buttons based on status
const renderActionButtons = () => {
    const buttons: Record<string, JSX.Element | null> = {
      pendingPayment: (
        <>
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] bg-primary text-white text-lg max-sm:text-sm max-sm:py-2 font-medium shadow hover:bg-primary transition-colors disabled:opacity-75"
          >
            {loading ? <Spinner /> : `💰 ${t("order.pay")}`}
          </button>
          {order.can_be_cancel && (
            <button
              onClick={handleCancelOrder}
              disabled={loading}
              className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] bg-red-500 text-white text-lg max-sm:text-sm max-sm:py-2 font-medium shadow hover:bg-red-600 transition-colors disabled:opacity-75"
            >
              {loading ? <Spinner /> : `❌ ${t("order.cancel")}`}
            </button>
          )}
        </>
      ),
      todayAndPaid: (
        <Link
          to={`/trips/trip/${order.id}`}
          className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] border border-sky-600 bg-white text-lg font-medium text-sky-600 shadow hover:bg-sky-50 transition-colors"
        >
          {t("order.viewTrip")}
        </Link>
      ),
      futureAndPaid: (
        <Link
          to={`/trips/trip/${order.id}`}
          className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] border border-sky-600 bg-white text-lg font-medium text-sky-600 shadow hover:bg-sky-50 transition-colors"
        >
          {t("order.viewTrip")}
        </Link>
      ),
      pastAndPaid: (
        <>
          <button
            onClick={handleDownloadTicket}
            className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] border border-sky-600 bg-white text-lg font-medium text-sky-600 shadow hover:bg-sky-50 transition-colors"
          >
            {t("order.viewTicket")}
          </button>
          <button
            onClick={handleAddReview}
            className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] bg-purple-500 text-white text-lg max-sm:text-sm max-sm:py-2 font-medium shadow hover:bg-purple-600 transition-colors"
          >
            {t("order.feedback")}
          </button>
        </>
      ),
      canceled: (
        <button
          disabled
          className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] bg-gray-400 text-white text-lg max-sm:text-sm max-sm:py-2 font-medium shadow cursor-not-allowed"
        >
          {t("order.canceled")}
        </button>
      ),
      default: null
    };

    return buttons[orderStatus] ?? null;
  };
  // Helper component for loading spinner
  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className={`rounded-2xl bg-white shadow-md transition-shadow duration-300 ease-in-out p-4 mb-6 hover:shadow-lg ${getBorderStyle()} ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold">{order?.number}</h3>
            <p className="text-gray-500 text-xs">#{order.id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-primary">{order.total} {t('price_unit')}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex justify-between border-t pt-4 text-sm text-gray-700 border-b-2">
        <div className="flex flex-col gap-4">
          <div className="text-base text-stone-900 flex flex-col w-full">
            <span className="text-bold text-lg w-full text-start flex">
              <span>{order.station_from.name}</span> -
            </span>
            <DateTimeDisplay isLined={true} value={order.date_time} />
          </div>
          <div className="text-base text-stone-900 flex flex-col">
            <span className="text-bold text-lg flex">
              <span>{order.station_to?.name}</span> -
            </span>
            <DateTimeDisplay value={order.date_time} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">{renderActionButtons()}</div>
    </div>
  );
};

export default TrainOrderCard;