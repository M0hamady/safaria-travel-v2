import React from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NotFoundPage from "../../pages/auth/NotFoundPage";

// import all your type-specific booking pages…
import BusAllBookings   from "../bookings/bus/BusAllBookings";
import PrivateAllBookings   from "../bookings/private/PrivateAllBookings";
import TrainAllBookings from "../bookings/train/TrainAllBookings";
import BusCurrentBookings from "../bookings/bus/BusCurrentBookings";
import BusPendingBookings from "../bookings/bus/BusPendingBookings";
import BusPreviousBookings from "../bookings/bus/BusPreviousBookings";
import PrivateCurrentBookings from "../bookings/private/PrivateCurrentBookings";
import PrivatePendingBookings from "../bookings/private/PrivatePendingBookings";
import PrivatePreviousBookings from "../bookings/private/PrivatePreviousBookings";
import TrainCurrentBookings from "../bookings/train/TrainCurrentBookings";
import TrainPendingBookings from "../bookings/train/TrainPendingBookings";
import TrainPreviousBookings from "../bookings/train/TrainPreviousBookings";
// …and likewise Current/Pending/Previous for each type

type SearchType = "bus" | "private" | "train";
const subTabs = ["all", "current", "pending", "previous"] as const;

const BookingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // extract `/dashboard/booking/:type/:sub…`
  const [, , , currentType = "bus", currentSub = "all"] = location.pathname.split("/");

  const isRTL = i18n.language === "ar";

  return (
    <div className="p-4">
      {/* Top-level types */}
      <div
        className={`flex overflow-auto border-b pb-2 ${
          isRTL ? "flex-row-reverse space-x-reverse" : "space-x-4"
        }`}
      >
        {(["bus", "private", "train"] as SearchType[]).map((type) => (
          <Link
            key={type}
            to={`/dashboard/booking/${type}/all`}
            className={`px-4 py-2 ${
              currentType === type ? "border-b-2 border-orange-500" : ""
            }`}
          >
            {t(`bookings.${type}`)}
          </Link>
        ))}
      </div>

      {/* Second-level subs */}
      <div
        className={`flex overflow-auto border-b mt-4 pb-2 ${
          isRTL ? "flex-row-reverse space-x-reverse" : "space-x-4"
        }`}
      >
        {subTabs.map((sub) => (
          <Link
            key={sub}
            to={`/dashboard/booking/${currentType}/${sub}`}
            className={`px-4 py-2 ${
              currentSub === sub ? "border-b-2 border-orange-500" : ""
            }`}
          >
            {t(`bookings.${sub}`)}
          </Link>
        ))}
      </div>

      {/* Nested routes */}
      <div className="mt-4">
        <Routes>
          {/* Bus */}
          <Route path="bus">
            <Route path="all"    element={<BusAllBookings />} />
            <Route path="current" element={<BusCurrentBookings />} />
            <Route path="pending" element={<BusPendingBookings />} />
            <Route path="previous"element={<BusPreviousBookings />} />
          </Route>

          {/* Private */}
          <Route path="private">
            <Route path="all"     element={<PrivateAllBookings />} />
            <Route path="current" element={<PrivateCurrentBookings />} />
            <Route path="pending" element={<PrivatePendingBookings />} />
            <Route path="previous"element={<PrivatePreviousBookings />} />
          </Route>

          {/* Train */}
          <Route path="train">
            <Route path="all"     element={<TrainAllBookings />} />
            <Route path="current" element={<TrainCurrentBookings />} />
            <Route path="pending" element={<TrainPendingBookings />} />
            <Route path="previous"element={<TrainPreviousBookings />} />
          </Route>

          <Route path="*" element={<BusAllBookings />} />
        </Routes>
      </div>
    </div>
  );
};

export default BookingPage;
