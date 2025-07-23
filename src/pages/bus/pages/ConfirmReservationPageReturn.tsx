import React, { useState, useContext, useEffect } from "react";
import { useSearchContext } from "../../../context/SearchContext";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import ReservationLayout from "../../../components/ReservationLayout";
import { Link, useNavigate } from "react-router-dom";
import TripProgressTracker from "../../../components/TripProgressTracker";
import { useTranslation } from "react-i18next";
import images from "../../../assets";

const ConfirmReservationPageReturn: React.FC = () => {
  const [confirmationStatus, setConfirmationStatus] = useState<string | null>(
    null
  );
  const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [countPassenger, setCountPassenger] = useState(0);
  const [isConfirmedTerms, setIsConfirmedTerms] = useState(false);
  const {
    seatsSelected,
    seatsSelectedReturn,
    selectedSeatsReturn,
    selectedTrip,
    selectedTripReturn,
    tripStations,
    tripStationsReturn,
    tripType,
    tripCycleStep,
    reservationData,
    setReservationDataReturn,
    roundTripCycleStep,
    setTripCycleStep,
    setRoundTripCycleStep,
    returnTrips,
    confirmReservationReturn,
    reservationDataReturn,
  } = useSearchContext();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const reservationRequestData = {
    round: 2,
    boarding: {
      trip_id: `${selectedTrip?.id}`,
      from_city_id: `${selectedTrip?.cities_from?.[0]?.id || 0}`,
      to_city_id: `${selectedTrip?.cities_to?.[0]?.id || 0}`,
      from_location_id: `${selectedTrip?.stations_from?.[0]?.id || 0}`,
      to_location_id: `${selectedTrip?.stations_to?.[0]?.id || 0}`,
      date: selectedTrip?.date || "",
      seats: seatsSelected?.map((seat) => ({
        seat_type_id: `${seat.id}`,
        seat_id: `${seat.seat_no}`,
      })),
    },

    return: {
      from_city_id: `${selectedTripReturn?.cities_from?.[0]?.id || 0}`,
      to_city_id: `${selectedTripReturn?.cities_to?.[0]?.id || 0}`,
      from_location_id: `${selectedTripReturn?.stations_from?.[0]?.id || 0}`,
      to_location_id: `${selectedTripReturn?.stations_to?.[0]?.id || 0}`,
      date: selectedTripReturn?.date || "",
      trip_id: `${selectedTripReturn?.id}`,
      seats: seatsSelectedReturn?.map((seat) => ({
        seat_type_id: seat.id,
        seat_id: seat.seat_no,
      })),
    },
  };

  useEffect(() => {
    if (!reservationDataReturn) {
      confirmReservation();
    }
  }, []);

  useEffect(() => {
    if (reservationDataReturn) {
      setReservationDataReturn(reservationDataReturn);
      let count = 0;
      reservationDataReturn?.trips.forEach((trip) => {
        if (trip.tickets.length > 0) {
          count += trip.tickets.length;
          setCountPassenger(count);
        }
      });
    }
  }, [reservationDataReturn]);

  const confirmReservation = async () => {
    setIsConfirming(true);
    setErrorMessage(null);
    try {
      const response: any = await fetch(
        `https://portal.safaria.travel/api/v2/transports/buses/create-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${user?.api_token}`,
          },
          body: JSON.stringify(reservationRequestData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();
      setReservationDataReturn(data.data);
      setConfirmationStatus(t("reservation.confirmationSuccess"));
      fetchPaymentLink(data.data.id);
    } catch (error: any) {
      setErrorMessage(t(`errors.${error.message}`) || error.message);
    } finally {
      setIsConfirming(false);
    }
  };

  const fetchPaymentLink = async (reservationId: string) => {
    try {
      setIsLoadingPayment(true);
      setErrorMessage(null);
      const token = user?.api_token;
      const config = {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const paymentUrl = `https://portal.safaria.travel/api/v2/transports/orders/${reservationId}/pay`;
      const response = await axios.post(paymentUrl, null, config);
      const { url } = response?.data?.data;

      if (url) {
        setPaymentUrl(url);
      } else {
        throw new Error("paymentLinkNotFound");
      }
    } catch (error: any) {
      setErrorMessage(t("errors.paymentLinkFailed"));
    } finally {
      setRoundTripCycleStep("CONFIRMING_RESERVATION");
      setIsLoadingPayment(false);
    }
  };

  return (
    <ReservationLayout>
      <div className="p-8 bg-gray-50 min-h-screen max-sm:px-1">
        {errorMessage && (
          <p className="text-white rounded my-4 bg-secondary font-bold px-2 py-2">
            {errorMessage}
          </p>
        )}

        {isConfirming && !reservationDataReturn && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">{t("reservation.confirming")}</p>
          </div>
        )}
        
        <div className="flex gap-4 w-full max-sm:flex-col">
          <div className="bg-slate-300 w-full mt-9 rounded-xl shadow p-4">
            <div className="bg-white p-5 rounded-xl flex flex-col gap-4">
              <div className="border-b-2 pb-6 flex flex-col gap-4">
                <div className="flex w-full justify-between">
                  <h2 className="text-2xl font-semibold">
                    {t("ticket.summary")}
                  </h2>
                  <button
                    className="text-primary capitalize"
                    onClick={() => navigate(-3)}
                  >
                    {t("common.edit")}
                  </button>
                </div>
                <div>
                  {selectedTrip?.company_data?.avatar && (
                    <img
                      src={selectedTrip.company_data.avatar}
                      alt={t("company.logoAlt")}
                      className="h-12 w-12"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-12 w-full h-[170px] border-b-2">
                <div className="col-span-1 flex-col flex items-center pb-8 pt-2">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <div className="w-1 h-full rounded-full bg-slate-600"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
                <div className="col-span-11 flex flex-col gap-8">
                  <div>
                    <div>{tripStations?.stations_to?.name || ""}</div>
                    <div>{tripStations?.stations_to?.arrival_at || ""}</div>
                  </div>
                  <div>
                    <div>{tripStations?.stations_from?.name || ""}</div>
                    <div>{tripStations?.stations_from?.arrival_at || ""}</div>
                  </div>
                </div>
              </div>
              <p className="flex gap-3">
                {seatsSelected?.map((seat, index) => (
                  <div key={index} className="seat-icon">
                    <img
                      src={images.seat_reserved}
                      alt={t("seat.iconAlt")}
                      width={48}
                      height={48}
                    />
                    <div className="text-center w-full">{seat.seat_no}</div>
                  </div>
                ))}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-300 mt-9 w-full rounded-xl shadow p-4">
            <div className="bg-white p-5 rounded-xl flex flex-col gap-4">
              <div className="border-b-2 pb-6 flex flex-col gap-4">
                <div className="flex w-full justify-between">
                  <h2 className="text-2xl font-semibold">
                    {t("ticket.summary")}
                  </h2>
                  <button
                    className="text-primary capitalize"
                    onClick={() => navigate(-1)}
                  >
                    {t("common.edit")}
                  </button>
                </div>
                <div>
                  {selectedTripReturn?.company_data?.avatar && (
                    <img
                      src={selectedTripReturn.company_data.avatar}
                      alt={t("company.logoAlt")}
                      className="h-12 w-12"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-12 w-full h-[170px] border-b-2">
                <div className="col-span-1 flex-col flex items-center pb-8 pt-2">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <div className="w-1 h-full rounded-full bg-slate-600"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
                <div className="col-span-11 flex flex-col gap-8">
                  <div>
                    <div>{tripStationsReturn?.stations_to?.name || ""}</div>
                    <div>{tripStationsReturn?.stations_to?.arrival_at || ""}</div>
                  </div>
                  <div>
                    <div>{tripStationsReturn?.stations_from?.name || ""}</div>
                    <div>{tripStationsReturn?.stations_from?.arrival_at || ""}</div>
                  </div>
                </div>
              </div>
              <p className="flex gap-3">
                {seatsSelectedReturn?.map((seat, index) => (
                  <div key={index} className="seat-icon">
                    <img
                      src={images.seat_reserved}
                      alt={t("seat.iconAlt")}
                      width={48}
                      height={48}
                    />
                    <div className="text-center w-full">{seat.seat_no}</div>
                  </div>
                ))}
              </p>
            </div>
          </div>
        </div>

        {reservationDataReturn && (
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-600" viewBox="0 0 18 22">
                  {/* User SVG from original component */}
                </svg>
                <h2 className="text-xl font-semibold">
                  {countPassenger} {t("passengers.title", { count: countPassenger })}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {reservationDataReturn.trips.map((trip) => {
                    if (trip.tickets.length > 0) {
                      return trip.tickets.map((ticket) => (
                        <div
                          key={ticket.seat_number}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <svg
                            className="w-5 h-5 text-gray-500"
                            viewBox="0 0 18 22"
                          >
                            {/* User SVG from original component */}
                          </svg>
                          <div className="flex justify-between w-full">
                            <div>
                              <p className="font-medium">
                                {t("seat.label")} {ticket.seat_number}
                              </p>
                              <p className="text-gray-500">
                                {ticket.price} {t("currency")}
                              </p>
                            </div>
                            <div>
                              <img
                                src={images.seat_reserved}
                                alt={t("seat.iconAlt")}
                                width={48}
                                height={48}
                              />
                            </div>
                          </div>
                        </div>
                      ));
                    }
                    return null;
                  })}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">{t("trip.details")}</h3>
                    {reservationDataReturn?.trips?.map((trip) => (
                      <div key={trip.trip_id}>
                        <p className="text-gray-600">
                          {trip.station_from?.name} → {trip.station_to?.name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {trip.date_time}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>{t("payment.subtotal")}:</span>
                      <span>
                        {reservationDataReturn.original_tickets_totals} {t("currency")}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>{t("payment.discount")}:</span>
                      <span className="text-green-600">
                        -{reservationDataReturn.discount} {t("currency")}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>{t("payment.fees")}:</span>
                      <span>
                        {reservationDataReturn.payment_fees} {t("currency")}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>{t("payment.total")}:</span>
                      <span>
                        {reservationDataReturn.total} {t("currency")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 p-4 bg-primary rounded-lg flex items-start gap-3">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={isConfirmedTerms}
                onChange={(e) => setIsConfirmedTerms(e.target.checked)}
                className="mt-1 h-5 w-5 text-primary focus:ring-primary"
              />
              <label htmlFor="termsCheckbox" className="text-sm text-gray-700">
                {t("termsRe.agreement")}{" "}
                <Link
                  to="/terms"
                  className="text-primary hover:text-primary_dark underline"
                  target="_blank"
                >
                  {t("termsRe.conditions")}
                </Link>
              </label>
            </div>
            <div className="p-6 bg-gray-50">
              {isLoadingPayment ? (
                <div className="animate-pulse text-center py-4 text-gray-600">
                  {t("payment.generatingLink")}
                </div>
              ) : paymentUrl && isConfirmedTerms ? (
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary hover:bg-primary_dark text-white py-3 px-6 rounded-lg font-medium text-center transition-colors"
                >
                  {t("payment.proceed")}
                </a>
              ) : (
                <div className="space-y-4">
                  {!isConfirmedTerms && (
                    <div className="text-center py-4 text-gray-600">
                      {t("termsRe.confirmRequired")}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="text-red-600">{errorMessage}</div>
                  )}
                  <button
                    onClick={() => fetchPaymentLink(reservationDataReturn.id)}
                    className="w-full bg-primary hover:bg-primary_dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {errorMessage
                      ? t("payment.retry")
                      : t("payment.generateLink")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ReservationLayout>
  );
};

export default ConfirmReservationPageReturn;