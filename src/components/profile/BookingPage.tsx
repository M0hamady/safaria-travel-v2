import { Link, Route, Routes, useLocation } from "react-router-dom";
import AllBookings from "../bookings/AllBookings";
import CurrentBookings from "../bookings/CurrentBookings";
import PendingBookings from "../bookings/PendingBookings";
import PreviousBookings from "../bookings/PreviousBookings";
import NotFoundPage from "../../pages/auth/NotFoundPage";
import { useTranslation } from "react-i18next";

const BookingPage = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isTabActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="p-4">
      <div className="flex space-x-4 border-b pb-2 overflow-auto">
        <Link
          to="/dashboard/booking/all"
          className={`px-4 py-2 ${isTabActive("all") ? "border-b-2 border-orange-500" : ""}`}
        >
          {t("bookings.all")}
        </Link>
        <Link
          to="/dashboard/booking/current"
          className={`px-4 py-2 ${isTabActive("current") ? "border-b-2 border-orange-500" : ""}`}
        >
          {t("bookings.current")}
        </Link>
        <Link
          to="/dashboard/booking/pending"
          className={`px-4 py-2 ${isTabActive("pending") ? "border-b-2 border-orange-500" : ""}`}
        >
          {t("bookings.pending")}
        </Link>
        <Link
          to="/dashboard/booking/previous"
          className={`px-4 py-2 ${isTabActive("previous") ? "border-b-2 border-orange-500" : ""}`}
        >
          {t("bookings.previous")}
        </Link>
      </div>

      <div className="mt-4">
        <Routes>
          <Route index element={<AllBookings />} />
          <Route path="all" element={<AllBookings />} />
          <Route path="current" element={<CurrentBookings />} />
          <Route path="pending" element={<PendingBookings />} />
          <Route path="previous" element={<PreviousBookings />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default BookingPage;
