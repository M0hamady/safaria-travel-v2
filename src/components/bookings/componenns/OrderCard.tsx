// src/components/OrderCard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Order } from "../../../types/order";
import { formatTime } from "../../utilies/functionalities";
import { useOrder } from "../../../context/OrderContext";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../context/ModalContext";
import { Star } from "@mui/icons-material";
import ReviewModal from "./ReviewModal";
import DateTimeDisplay from "../../utilies/DateTimeDisplay";
import images from "../../../assets";

// ... (keep all your existing interfaces and constants)

interface OrderCardProps {
  order: Order;
  className?: string;
}
const OrderCard: React.FC<OrderCardProps> = ({ order, className = "" }) => {
  // ... (keep all your existing state and hooks)
  const { cancelOrder, loading, addReview, downloadTicket } = useOrder();
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const [localLoading, setLocalLoading] = useState(false);

  // Local state for review form inputs
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");

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
  const isOrderRunning = () =>
    new Date(order.station_from.arrival_at) <= new Date() &&
    new Date(order.station_to.arrival_at) > new Date();

  // Determine order status for styling and actions
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
  useEffect(() => {

    if (order?.review && order.review) {
      setReviewRating(order.review.rating);
    }
  }, []);
  useEffect(() => {
    if (order?.review && order.review) {
      setReviewRating(order.review.rating);
    }
  }, [order]);

  const getBorderClass = (): string => {
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
  // Handler for order cancellation with confirmation modal
  const handleCancel = async () => {
    openModal({
      title: t("order.confirmCancel"),
      message: t("order.cancelConfirmationMessage"),
      button1Label: t("confirm"),
      button2Label: t("cancel"),
      button1Action: async () => {
        setLocalLoading(true);
        try {
          await cancelOrder(order.id);
        } finally {
          setLocalLoading(false);
        }
      },
       button2Action: () => {
        console.log('closing');
        closeModal()
      }, // Just closes the modal
    });
  };

  // Improved review modal handler
  const handleAddReview = () => {
    let triggerSubmit: () => void;

    openModal({
      title: t("order.addReview"),
          scrollToModal: true ,// Explicitly enable auto-scroll

      children: (
        <ReviewModal
          orderId={order.id}
          setTriggerSubmit={(fn: any) => {
            triggerSubmit = fn;
          }}
          onSubmit={async (rating: number, comment: string) => {
            await addReview(order.id, rating, comment);
          }}
          
          initialRating={reviewRating}
          initialComment={reviewComment}
        />
      ),
      button1Label: t("submit"),
      button2Label: t("cancel"),
      button1Action: async () => {
        if (triggerSubmit) {
          triggerSubmit();
        }
      },
      button2Action: () => {
        console.log('closing');
        closeModal()
      }, // Just closes the modal
    });
  };

  // Add a download confirmation modal
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

  // Update your renderActionButtons to use the new handlers
  const renderActionButtons = () => {
    const status = determineOrderStatus();
    const isLoading = loading || localLoading;

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
                onClick={handleCancel}
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
      className={`rounded-2xl border bg-white shadow-lg duration-300 ease-in-out ${getBorderClass()} p-4  mb-6 hover:shadow-xl transition-shadow ${className} `}
    >
      {/* Header */}
      <div className="flex justify-between ">
        <div className="flex gap-3 justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-2">
          <img
            className="h-10  object-contain"
            src={order.company_data.avatar}
            alt="Company Logo"
          />
          <div className="flex max-sm:w-fit">
            {[1, 2, 3, 4, 5].map((i) =>
              i <= (order?.review?.rating || 0) ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  className="max-sm:w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.7289 2.1886L14.4889 5.7086C14.7289 6.1986 15.3689 6.6686 15.9089 6.7586L19.0989 7.2886C21.1389 7.6286 21.6189 9.1086 20.1489 10.5686L17.6689 13.0486C17.2489 13.4686 17.0189 14.2786 17.1489 14.8586L17.8589 17.9286C18.4189 20.3586 17.1289 21.2986 14.9789 20.0286L11.9889 18.2586C11.4489 17.9386 10.5589 17.9386 10.0089 18.2586L7.01893 20.0286C4.87893 21.2986 3.57893 20.3486 4.13893 17.9286L4.84893 14.8586C4.97893 14.2786 4.74893 13.4686 4.32893 13.0486L1.84893 10.5686C0.388932 9.1086 0.858933 7.6286 2.89893 7.2886L6.08893 6.7586C6.61893 6.6686 7.25893 6.1986 7.49893 5.7086L9.25893 2.1886C10.2189 0.278604 11.7789 0.278604 12.7289 2.1886Z"
                    fill="#0D72B9"
                    stroke="#0074C3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  key={i}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  className="max-sm:w-4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.7289 4.1886L15.4889 7.7086C15.7289 8.1986 16.3689 8.6686 16.9089 8.7586L20.0989 9.2886C22.1389 9.6286 22.6189 11.1086 21.1489 12.5686L18.6689 15.0486C18.2489 15.4686 18.0189 16.2786 18.1489 16.8586L18.8589 19.9286C19.4189 22.3586 18.1289 23.2986 15.9789 22.0286L12.9889 20.2586C12.4489 19.9386 11.5589 19.9386 11.0089 20.2586L8.01893 22.0286C5.87893 23.2986 4.57893 22.3486 5.13893 19.9286L5.84893 16.8586C5.97893 16.2786 5.74893 15.4686 5.32893 15.0486L2.84893 12.5686C1.38893 11.1086 1.85893 9.6286 3.89893 9.2886L7.08893 8.7586C7.61893 8.6686 8.25893 8.1986 8.49893 7.7086L10.2589 4.1886C11.2189 2.2786 12.7789 2.2786 13.7289 4.1886Z"
                    stroke="#003458"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )
            )}
          </div>
        </div>

        <div className="flex gap-3 items-center justify-center max-sm:gap-1  ">
          <div className="relative font-Cairo mx-2 text-xl max-sm:text-sm text-neutral-500 flex items-center justify-center gap-3 group">
            {/* Show ticket count */}
            <div className="flex items-center gap-1 cursor-default">
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 22"
                className="mt-1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.749 5C12.749 5.99456 12.3539 6.94839 11.6507 7.65165C10.9474 8.35491 9.99356 8.75 8.999 8.75C8.00444 8.75 7.05061 8.35491 6.34735 2.34835C5.64409 3.05161 5.249 4.00544 5.249 5C5.249 4.00544 5.64409 3.05161 6.34735 2.34835C7.05061 1.64509 8.00444 1.25 8.999 1.25C9.99356 1.25 10.9474 1.64509 11.6507 2.34835C12.3539 3.05161 12.749 4.00544 12.749 5ZM1.5 19.118C1.53213 17.1504 2.33634 15.2742 3.73918 13.894C5.14202 12.5139 7.03109 11.7405 8.999 11.7405C10.9669 11.7405 12.856 12.5139 14.2588 13.894C15.6617 15.2742 16.4659 17.1504 16.498 19.118C14.1454 20.1968 11.5871 20.7535 8.999 20.75C6.323 20.75 3.783 20.166 1.5 19.118Z"
                  stroke="#69696A"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{order.tickets.length} مقعد</span>
            </div>

            {/* Chair icons on hover */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-neutral-700 border rounded-lg shadow-md p-3 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="text-sm font-medium mb-2">المقاعد:</div>
              <ul className="flex flex-wrap gap-2">
                {order.tickets.map((ticket) => (
                  <li key={ticket.id} className="flex flex-col items-center text-[10px] text-center">
                    <img
                      src={images.seat_reserved} // Replace with your chair image path
                      alt={`Chair ${ticket.seat_number}`}
                      className="w-8 h-8"
                    />
                    {ticket.seat_number}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-xl max-sm:text-sm font-medium text-sky-600">
            {order.total.slice(0, 3)} {order.total.slice(4)}
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="mt-4 flex justify-between border-t border-slate-200 p-4 max-sm:gap-4 border-b-2">
        <div className="flex flex-col gap-4">
          <div className="text-base text-stone-900 flex flex-col w-full ">
            <span className="text-bold text-lg w-full text-start flex">

              <span > {order.station_from.city_name} {" "}  </span>
              -
              <span >
                ({order.station_from.name})
              </span>
            </span>
            <div className="text-base text-stone-900">
              <DateTimeDisplay isLined={true} value={order.station_from.arrival_at} />
            </div>
          </div>
          <div className="text-base text-stone-900 flex flex-col">
            <span className="text-bold text-lg flex">

              <span >{order.station_to.city_name}  </span>
              -

              <span >({order.station_to.name}) </span>
            </span>
            <div className="text-base text-stone-900">
              <DateTimeDisplay value={order.station_to.arrival_at} />
            </div>
          </div>

        </div>
        <div className="flex flex-col justify-evenly">


        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">{renderActionButtons()}</div>
    </div>
  );
};

export default OrderCard;
