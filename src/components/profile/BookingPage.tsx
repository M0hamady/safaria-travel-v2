import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

// Booking views by type and status
import BusAllBookings from "../bookings/bus/BusAllBookings";
import BusCurrentBookings from "../bookings/bus/BusCurrentBookings";
import BusPendingBookings from "../bookings/bus/BusPendingBookings";
import BusPreviousBookings from "../bookings/bus/BusPreviousBookings";

import PrivateAllBookings from "../bookings/private/PrivateAllBookings";
import PrivateCurrentBookings from "../bookings/private/PrivateCurrentBookings";
import PrivatePendingBookings from "../bookings/private/PrivatePendingBookings";
import PrivatePreviousBookings from "../bookings/private/PrivatePreviousBookings";

import TrainAllBookings from "../bookings/train/TrainAllBookings";
import TrainCurrentBookings from "../bookings/train/TrainCurrentBookings";
import TrainPendingBookings from "../bookings/train/TrainPendingBookings";
import TrainPreviousBookings from "../bookings/train/TrainPreviousBookings";

import NotFoundPage from "../../pages/auth/NotFoundPage";

// Tabs
const bookingTypes = ["bus", "private", "train"] as const;
type BookingType = typeof bookingTypes[number];
const subTabs = ["all", "current", "pending", "previous"] as const;
type SubTab = typeof subTabs[number];

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ type?: string; subTab?: string }>();
  const { t } = useTranslation();

  const paramType = params.type ?? "bus";
  const paramSubTab = params.subTab ?? "all";

  const [bookingType, setBookingType] = useState<BookingType>(
    bookingTypes.includes(paramType as BookingType) ? (paramType as BookingType) : "bus"
  );

  const currentSubTab = subTabs.includes(paramSubTab as SubTab) ? (paramSubTab as SubTab) : "all";

  // Update local state when URL param changes
  useEffect(() => {
    if (bookingTypes.includes(paramType as BookingType)) {
      setBookingType(paramType as BookingType);
    }
  }, [paramType]);

  const handleBookingTypeChange = (newType: BookingType) => {
    setBookingType(newType);
    navigate(`/dashboard/booking/${newType}/all`);
  };

  const isSubTabActive = (tab: string) => location.pathname.endsWith(tab);

  const renderComponent = () => {
    switch (bookingType) {
      case "bus":
        switch (currentSubTab) {
          case "all": return <BusAllBookings />;
          case "current": return <BusCurrentBookings />;
          case "pending": return <BusPendingBookings />;
          case "previous": return <BusPreviousBookings />;
        }
        break;
      case "private":
        switch (currentSubTab) {
          case "all": return <PrivateAllBookings />;
          case "current": return <PrivateCurrentBookings />;
          case "pending": return <PrivatePendingBookings />;
          case "previous": return <PrivatePreviousBookings />;
        }
        break;
      case "train":
        switch (currentSubTab) {
          case "all": return <TrainAllBookings />;
          case "current": return <TrainCurrentBookings />;
          case "pending": return <TrainPendingBookings />;
          case "previous": return <TrainPreviousBookings />;
        }
        break;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="p-4">
      <Helmet>
        <title>{t(`seo.booking.title`)} - {t(`bookingTypes.${bookingType}`)}</title>
        <meta name="description" content={t(`seo.booking.description`)} />
      </Helmet>

      {/* Booking Type Tabs */}
      <div className="flex space-x-4 mb-4 overflow-auto border-b pb-2">
        {bookingTypes.map(type => (
          <button
            key={type}
            onClick={() => handleBookingTypeChange(type)}
            className={`px-4 py-2 capitalize ${
              bookingType === type ? "border-b-2 border-orange-500 font-semibold" : "text-gray-500"
            }`}
          >
            {t(`bookings.${type}`)}
          </button>
        ))}
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-4 border-b pb-2 overflow-auto">
        {subTabs.map(tab => (
          <Link
            key={tab}
            to={`/dashboard/booking/${bookingType}/${tab}`}
            className={`px-4 py-2 ${isSubTabActive(tab) ? "border-b-2 border-orange-500" : ""}`}
          >
            {t(`bookings.${tab}`)}
          </Link>
        ))}
      </div>

      {/* Booking Content */}
      <div className="mt-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default BookingPage;
