import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import images from "../../assets";
import { AuthContext } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { Order } from "../../types/order";

const SuccessPayment: React.FC = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { orders, fetchOrders } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();

  // Countdown state
  const [countdown, setCountdown] = useState(8);
  // Store the found order (if any)
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  // Get orderId from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const orderIdParam = searchParams.get("orderId");

  // If authenticated and orders haven't been loaded, fetch orders.
  useEffect(() => {
    if (isAuthenticated && orders.length === 0) {
      fetchOrders();
    }
  }, [isAuthenticated, orders, fetchOrders]);

  // Find the order based on orderId query parameter
  useEffect(() => {
    if (orderIdParam && orders.length > 0) {
      const order = orders.find(
        (order) => String(order.id) === orderIdParam
      );
      setFoundOrder(order || null);
    }
  }, [orderIdParam, orders]);

  // Countdown and redirect logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // After 4 seconds, navigate to the appropriate page
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/dashboard/booking");
      } else {
        navigate("/login");
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isAuthenticated, navigate]);

  // Determine if the payment is successful
  const isPaymentSuccessful =
    isAuthenticated &&
    orderIdParam &&
    foundOrder &&
    (foundOrder.payment_data.status_code === "success" ||
      foundOrder.payment_data.status_code === "paid");

  // Choose image source based on payment status
  const imageSource = isPaymentSuccessful ? images.paymentSuccess : images.Secured;
  const imageAlt = isPaymentSuccessful ? "Payment Success" : "Secured";

  // Determine what message to display based on the order lookup
  let messageContent;
  if (!orderIdParam) {
    messageContent = (
      <>
        <p className="text-xl text-gray-800 mb-2">
          Your order data is incomplete.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your payment.
        </p>
      </>
    );
  } else if (foundOrder) {
    if (isPaymentSuccessful) {
      messageContent = (
        <>
          <p className="text-xl text-gray-800 mb-2">
            Order Found: Thank you for your payment!
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Your order has been confirmed.
          </p>
          <button
            onClick={() => navigate("/dashboard/booking")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Go to My Bookings
          </button>
        </>
      );
    } else {
      messageContent = (
        <>
          <p className="text-xl text-gray-800 mb-2">
            Order Found, But Payment Not Confirmed
          </p>
          <p className="text-lg text-gray-600 mb-6">
            We could not verify the payment status for this order.
          </p>
        </>
      );
    }
  } else {
    messageContent = (
      <>
        <p className="text-xl text-gray-800 mb-2">Order Not Found</p>
        <p className="text-lg text-gray-600 mb-6">
          We couldn’t locate this order in your account. Thank you for your payment.
        </p>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <img
        src={imageSource}
        alt={imageAlt}
        className="w-64 h-auto mb-6"
      />
      <h1
        className={`text-3xl font-extrabold mb-4 ${
          isPaymentSuccessful ? "text-green-600" : "text-red-900"
        }`}
      >
        {isAuthenticated && user?.name
          ? isPaymentSuccessful
            ? `Success Payment, ${user.name}!`
            : "Payment Issue Detected"
          : "Access Secured"}
      </h1>
      {messageContent}
      <p className="text-md text-gray-500">
        Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
      </p>
    </div>
  );
};

export default SuccessPayment;
