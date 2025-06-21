import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateOrder } from "../../../types/order";
import { formatTime } from "../../utilies/functionalities";
import ReviewModal from "./ReviewModalPrivate";
import { useModal } from "../../../context/ModalContext";
import { usePrivateOrder } from "../../../context/PrivateOrderContext";
import DateTimeDisplay from "../../utilies/DateTimeDisplay";
import { useOrder } from "../../../context/OrderContext";

interface PrivateOrderCardProps {
  order: PrivateOrder;
  className?: string;
}

const PrivateOrderCard: React.FC<PrivateOrderCardProps> = ({ order, className = "" }) => {
  const { t } = useTranslation();
  const { openModal ,closeModal} = useModal();
  const { cancelPrivateOrder } = usePrivateOrder(); // ✅ Hook for canceling
  const [loading, setLoading] = useState(false);
  const {  downloadTicket } = useOrder();


  const now = new Date();
  const orderDate = new Date(order.date_time);

  const isCanceled = order.status_code === "canceled";
  const isPaid = order.payment_data?.status === "paid";
  const isFuture = orderDate > now;
  const canPay = order.can_pay;
    // Payment status helpers
  const isOrderPaid = () => order.payment_data?.status === "paid";
  const isOrderPending = () => order.payment_data?.status_code === "pending";
  const isOrderCanceled = () => order.status_code === "canceled";

  // Time-related helpers
  const isOrderInPast = () => new Date(order.date_time) < new Date();
  const isOrderToday = () => {
    const today = new Date();
    const orderDate = new Date(order.date_time);
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  };
 const determineOrderStatus = (): string => {
    if (isOrderCanceled()) return "canceled";
    if (isOrderPending()) return "pendingPayment";
    if (isOrderPaid()) {
      if (isOrderInPast())
        return isOrderToday() ? "todayAndPaid" : "pastAndPaid";
      return "futureAndPaid";
    }
    return "default";
  };
  const getBorderStyle = () => {
     const status = determineOrderStatus();
    switch (status) {
      case "pendingPayment":
        return "border-2 border-dashed border-red-400";
      case "todayAndPaid":
        return "border-2 border-primary";
      case "futureAndPaid":
        return "border-2 border-green-400";
      case "pastAndPaid":
        return "border-sky-600";
      case "canceled":
        return "border-2 border-dashed border-gray-400 opacity-70";
      default:
        return "border-2 border-dashed border-gray-400";
    }
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
      button2Action: () => {closeModal()},
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
  const handleDownloadTicket = () => {
    openModal({
      title: t("order.downloadTicket"),
      message: t("order.downloadConfirmation"),
      button1Label: t("download"),
      button2Label: t("cancel"),
      button1Action: () => downloadTicket(order.id),
      button2Action: () => {}, // Just closes the modal
    });
  };
  const renderActionButtons = () => {
    const status = determineOrderStatus();
    const isLoading = loading ;

    switch (status) {
      case "pendingPayment":
        return (
          <>
            <a
              href={order.payment_data?.invoice_url}
              className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] bg-primary text-white text-lg max-sm:text-sm max-sm:py-2 font-medium shadow hover:bg-primary transition-colors"
            >
              💰 {t("order.pay")}
            </a>
            {order.can_be_cancel && (
              <button
                onClick={handleCancelOrder}
                disabled={isLoading}
                className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] bg-red-500 text-white text-lg max-sm:text-sm max-sm:py-2 font-medium shadow hover:bg-red-600 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>❌ {t("order.cancel")}</>
                )}
              </button>
            )}

          </>
        );

      case "todayAndPaid":
      case "futureAndPaid":
        return (
          <Link
            to={`/trips/trip/${order.id}`}
            className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] border border-sky-600 bg-white text-lg font-medium text-sky-600 shadow hover:bg-sky-50 transition-colors"
          >
            {t("order.viewTrip")}
          </Link>
        );

      case "pastAndPaid":
        return (
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
        );

      case "canceled":
        return (
          <button
            disabled
            className="inline-flex h-12 px-2 items-center justify-center rounded-[9px] bg-gray-400 text-white text-lg max-sm:text-sm max-sm:py-2 font-medium shadow cursor-not-allowed"
          >
            {t("order.canceled")}
          </button>
        );

      default:
        return null;
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
      <div className="flex justify-between border-t pt-4 text-sm text-gray-700 border-b-2">
             <div className="flex flex-col gap-4">
          <div className="text-base text-stone-900 flex flex-col w-full ">
            <span className="text-bold text-lg w-full text-start flex">

              <span > {order.from_location?.name} {" "}  </span>
              -
              <span >
                ({order.from_address?.name})
              </span>
            </span>
            <div className="text-base text-stone-900">
              <DateTimeDisplay isLined={true} value={order.date_time} />
            </div>
          </div>
          <div className="text-base text-stone-900 flex flex-col">
            <span className="text-bold text-lg flex">

              <span >{order.to_location?.name}  </span>
              -

              <span >({order.from_location?.name}) </span>
            </span>
            <div className="text-base text-stone-900">
              <DateTimeDisplay value={order.date_time} />
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">{renderActionButtons()}</div>
    </div>
  );
};

export default PrivateOrderCard;
