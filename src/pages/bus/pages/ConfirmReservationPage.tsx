import React, { useState, useContext, useEffect } from "react";
import { useSearchContext } from "../../../context/SearchContext";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import ReservationLayout from "../../../components/ReservationLayout";
import { Link, useNavigate } from "react-router-dom";
import TripProgressTracker from "../../../components/TripProgressTracker";
import { useTranslation } from "react-i18next";
import images from "../../../assets";

interface CompanyData {
  name: string;
  avatar: string;
  bus_image: string;
}

interface PaymentData {
  status: string;
  status_code: string;
  invoice_id: number;
  gateway: string;
  invoice_url: string;
  data: {
    notes: string;
  };
}

interface Station {
  id: number;
  city_id: number;
  city_name: string;
  arrival_at: string;
  name: string;
  latitude: string;
  longitude: string;
  price: number;
  original_price: number;
  final_price: number;
}

interface Ticket {
  id: number;
  seat_number: string;
  price: string;
}

export interface TicketOrderRound {
  can_be_cancel: boolean;
  cancel_url: string;
  discount: string;
  id: string;
  original_tickets_totals: string;
  payment_data: PaymentData;
  payment_fees: string;
  payment_url: string;
  status: string;
  status_code: string;
  tickets_totals_after_discount: string;
  total: string;
  trip_type: string;
  trips: TicketOrderMin[];
}

export interface TicketOrderMin {
  trip_id: number;
  gateway_order_id: number;
  company_data: CompanyData;
  gateway_id: string;
  station_from: Station;
  station_to: Station;
  tickets: Ticket[];
  date: string;
  date_time: string;
  payment_url: string;
  cancel_url: string;
  original_tickets_totals: string;
  discount: string;
  tickets_totals_after_discount: string;
  payment_fees: string;
  total: string;
}

export interface TicketOrder {
  number: string;
  id: number;
  trip_id: number;
  gateway_order_id: number;
  company_data: CompanyData;
  status: string;
  status_code: string;
  gateway_id: string;
  company_name: string;
  category: string;
  can_be_cancel: boolean;
  trip_type: string;
  is_confirmed: boolean;
  review: null | string;
  can_review: boolean;
  payment_data: PaymentData;
  station_from: Station;
  station_to: Station;
  tickets: Ticket[];
  date: string;
  date_time: string;
  payment_url: string;
  cancel_url: string;
  original_tickets_totals: string;
  discount: string;
  wallet_discount: string;
  tickets_totals_after_discount: string;
  payment_fees: string;
  total: string;
}

const ConfirmReservationPage: React.FC = () => {
  const [confirmationStatus, setConfirmationStatus] = useState<string | null>(
    null
  );
  const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isConfirmingTerms, setIsConfirmingTerms] = useState<boolean>(false);
  const [autoConfirmed, setAutoConfirmed] = useState<boolean>(false);

  const {
    seatsSelected,
    selectedTrip,
    tripStations,
    tripType,
    tripCycleStep,
    setTripCycleStep,
    reservationData,
    setReservationData,
  } = useSearchContext();

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const reservationRequestData = {
    from_city_id: selectedTrip?.cities_from?.[0]?.id || 0,
    to_city_id: selectedTrip?.cities_to?.[0]?.id || 0,
    from_location_id: selectedTrip?.stations_from?.[0]?.id || 0,
    to_location_id: selectedTrip?.stations_to?.[0]?.id || 0,
    date: selectedTrip?.date || "",
    seats: seatsSelected?.map((seat) => ({
      seat_type_id: seat.id,
      seat_id: seat.seat_no,
    })),
  };

  const reservationRequestDataRound = {
    round: 1,
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
  };

  useEffect(() => {
    setAutoConfirmed(false);
    setReservationData(undefined);
  }, []);
  useEffect(() => {
    if (!autoConfirmed || !reservationData) {
      const confirmReservation = async () => {
        try {
          setIsConfirming(true);
          setErrorMessage(null);

          const endpoint =
            tripType === "round"
              ? "https://portal.safaria.travel/api/v2/transports/buses/create-ticket"
              : `https://portal.safaria.travel/api/transports/trips/${selectedTrip?.id}/create-ticket`;

          const body =
            tripType === "round"
              ? reservationRequestDataRound
              : reservationRequestData;

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${user?.api_token}`,
            },
            body: JSON.stringify(body),
          });

          if (response.status === 401) {
            navigate("/login");
            return;
          }

          if (response.status === 400) {
            const data = await response.json();
            setErrorMessage(
              data.message ||
                t("Error confirming reservation. Please try again.")
            );
            return;
          }

          if (!response.ok) {
            throw new Error("Reservation failed");
          }

          if (tripType === "one-way" && tripCycleStep === "SELECTING_SEATS") {
            setTripCycleStep("CONFIRMING_RESERVATION");
          }

          const data = await response.json();
          setReservationData(data.data);
          setConfirmationStatus(t("successReservation"));
          fetchPaymentLink(data.data.id);
        } catch (error) {
          console.error("Error confirming reservation:", error);
          setErrorMessage(t("errReservation"));
        } finally {
          setIsConfirming(false);
          setAutoConfirmed(true);
        }
      };

      confirmReservation();
    }
  }, []);

  const fetchPaymentLink = async (reservationId: string) => {
    try {
      setIsLoadingPayment(true);
      setErrorMessage(null);
      const token = user?.api_token;
      const config = {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en",
          Authorization: `Bearer ${token}`,
        },
      };

      const paymentUrl = `https://portal.safaria.travel/api/transports/orders/${reservationId}/pay`;
      const response = await axios.post(paymentUrl, null, config);
      const { url } = response?.data?.data;

      if (url) {
        setPaymentUrl(url);
      } else {
        throw new Error("Payment link not found");
      }
    } catch (error: any) {
      console.error("Error fetching payment link:", error);
      setErrorMessage(t("Failed to fetch payment link. Please retry."));
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleRetryReservation = () => {
    setErrorMessage(null);
    setAutoConfirmed(false);
  };

  if (isConfirming && !reservationData) {
    return (
      <ReservationLayout>
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t("Confirming your reservation...")}</p>
          </div>
        </div>
      </ReservationLayout>
    );
  }

  if (errorMessage && !reservationData) {
    return (
      <ReservationLayout>
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
            <div className="text-red-500 mb-4">{errorMessage}</div>
            <button
              onClick={handleRetryReservation}
              className="mt-4 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary_dark"
            >
              {t("Retry Reservation")}
            </button>
          </div>
        </div>
      </ReservationLayout>
    );
  }

  if (!reservationData) {
    return (
      <ReservationLayout>
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p>{t("Preparing your reservation...")}</p>
          </div>
        </div>
      </ReservationLayout>
    );
  }

  return (
    <ReservationLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {errorMessage && <p className="text-red-500">{t(errorMessage)}</p>}
        {confirmationStatus && (
          <p className="text-green-500 mb-4">{confirmationStatus}</p>
        )}
        <div className="bg-slate-300 mt-9 rounded-xl shadow p-4">
          <div className="bg-white p-5  rounded-xl flex flex-col gap-4 ">
            <div className="border-b-2 pb-6 flex flex-col gap-4 ">
              <div className="flex w-full justify-between ">
                <h2 className="text-2xl font-semibold">
                  {t("Ticket Summary")}
                </h2>
                <button
                  className="text-primary capitalize"
                  onClick={() => navigate(-1)}
                >
                  {t("Edit")}
                </button>
              </div>
              <div>
                {selectedTrip?.company_data?.avatar && (
                  <img
                    src={selectedTrip.company_data.avatar}
                    alt="Company Logo"
                    className="h-12 w-12"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 w-full  h-[170px]  border-b-2">
              <div className="col-span-1 flex-col flex items-center pb-8 pt-2 ">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <div className="w-1 h-full rounded-full bg-slate-600"></div>
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
              <div className="col-span-11 flex flex-col gap-8 ">
                <div>
                  <div className=" ">
                    {tripStations?.stations_to
                      ? tripStations.stations_to.name
                      : ""}
                  </div>
                  <div className=" ">
                    {tripStations?.stations_to
                      ? tripStations.stations_to.arrival_at
                      : ""}
                  </div>
                </div>
                <div>
                  <div className=" ">
                    {tripStations?.stations_from
                      ? tripStations.stations_from.name
                      : ""}
                  </div>
                  <div className=" ">
                    {tripStations?.stations_from
                      ? tripStations.stations_from.arrival_at
                      : ""}
                  </div>
                </div>
              </div>
            </div>
            <p className="flex gap-3 ">
              {seatsSelected?.map((seat, index) => (
                <div key={index} className="seat-icon">
                  <img
                    src={images.seat_reserved} // Replace with your actual image path
                    alt="Seat Icon"
                    width={48}
                    height={48}
                  />
                  <div className="text-center w-full   "> {seat.seat_no}</div>
                </div>
              ))}
            </p>
          </div>
        </div>
        <div className="mt-6 bg-slate-300 p-8 rounded-xl max-sm:p-4">
          <div className="main-container rounded-xl flex flex-col bg-white">
            <div className="header border-b-2 pb-5 pt-2 flex px-8">
              <svg
                width="18"
                height="22"
                viewBox="0 0 18 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.751 5C12.751 5.99456 12.3559 6.94839 11.6526 7.65165C10.9493 8.35491 9.99552 8.75 9.00095 8.75C8.00639 8.75 7.05256 8.35491 6.3493 7.65165C5.64604 6.94839 5.25095 5.99456 5.25095 5C5.25095 4.00544 5.64604 3.05161 6.3493 2.34835C7.05256 1.64509 8.00639 1.25 9.00095 1.25C9.99552 1.25 10.9493 1.64509 11.6526 2.34835C12.3559 3.05161 12.751 4.00544 12.751 5ZM1.50195 19.118C1.53409 17.1504 2.33829 15.2742 3.74113 13.894C5.14397 12.5139 7.03304 11.7405 9.00095 11.7405C10.9689 11.7405 12.8579 12.5139 14.2608 13.894C15.6636 15.2742 16.4678 17.1504 16.5 19.118C14.1473 20.1968 11.5891 20.7535 9.00095 20.75C6.32495 20.75 3.78495 20.166 1.50195 19.118Z"
                  stroke="#69696A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="ml-2">
                {reservationData?.tickets?.length} {t("passenger")}
              </span>
            </div>

            <div className="content pb-5 pt-4 grid grid-cols-2 px-8">
              <div className="col-span-1 flex flex-col gap-2 border-b-2">
                {reservationData?.tickets?.map((ticket, index) => (
                  <div key={index} className="flex gap-2">
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.751 5C12.751 5.99456 12.3559 6.94839 11.6526 7.65165C10.9493 8.35491 9.99552 8.75 9.00095 8.75C8.00639 8.75 7.05256 8.35491 6.3493 7.65165C5.64604 6.94839 5.25095 5.99456 5.25095 5C5.25095 4.00544 5.64604 3.05161 6.3493 2.34835C7.05256 1.64509 8.00639 1.25 9.00095 1.25C9.99552 1.25 10.9493 1.64509 11.6526 2.34835C12.3559 3.05161 12.751 4.00544 12.751 5ZM1.50195 19.118C1.53409 17.1504 2.33829 15.2742 3.74113 13.894C5.14397 12.5139 7.03304 11.7405 9.00095 11.7405C10.9689 11.7405 12.8579 12.5139 14.2608 13.894C15.6636 15.2742 16.4678 17.1504 16.5 19.118C14.1473 20.1968 11.5891 20.7535 9.00095 20.75C6.32495 20.75 3.78495 20.166 1.50195 19.118Z"
                        stroke="#69696A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {ticket.seat_number}
                  </div>
                ))}
                <div className="mt-4">
                  {reservationData?.station_from?.name} - (
                  {reservationData?.station_from?.city_name}) |{" "}
                  {reservationData?.station_to?.name} - (
                  {reservationData?.station_to?.city_name})
                </div>
              </div>

              <div className="col-span-1 flex flex-col gap-2 items-end border-b-2 pb-4">
                {reservationData?.tickets?.map((ticket, index) => (
                  <div key={index} className="flex gap-2">
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.751 5C12.751 5.99456 12.3559 6.94839 11.6526 7.65165C10.9493 8.35491 9.99552 8.75 9.00095 8.75C8.00639 8.75 7.05256 8.35491 6.3493 7.65165C5.64604 6.94839 5.25095 5.99456 5.25095 5C5.25095 4.00544 5.64604 3.05161 6.3493 2.34835C7.05256 1.64509 8.00639 1.25 9.00095 1.25C9.99552 1.25 10.9493 1.64509 11.6526 2.34835C12.3559 3.05161 12.751 4.00544 12.751 5ZM1.50195 19.118C1.53409 17.1504 2.33829 15.2742 3.74113 13.894C5.14397 12.5139 7.03304 11.7405 9.00095 11.7405C10.9689 11.7405 12.8579 12.5139 14.2608 13.894C15.6636 15.2742 16.4678 17.1504 16.5 19.118C14.1473 20.1968 11.5891 20.7535 9.00095 20.75C6.32495 20.75 3.78495 20.166 1.50195 19.118Z"
                        stroke="#69696A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {ticket.price}
                  </div>
                ))}
                <div className="mt-4 font-semibold">
                  {reservationData?.original_tickets_totals}
                </div>
              </div>

              <div className="col-span-1 flex flex-col gap-2 border-b-2 mt-4">
                <div>{t("discount")}</div>
                <div>{t("tax-include")}</div>
                <div className="font-semibold">{t("Total")}</div>
              </div>

              <div className="col-span-1 flex flex-col gap-2 items-end border-b-2 pb-4 mt-4">
                <div>{reservationData?.discount}</div>
                <div>{reservationData?.payment_fees}</div>
                <div className="font-semibold">
                  {reservationData?.tickets_totals_after_discount}
                </div>
              </div>
            </div>

            <div className="bottom pb-5 pt-4 px-8">
              {isLoadingPayment ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
                  <p>{t("Loading Payment Link...")}</p>
                </div>
              ) : !isConfirmingTerms ? (
                <div className="flex items-start mb-4 flex-col   ">
                  <div className="flex items-center align-middle ">

                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={isConfirmingTerms}
                  onChange={()=>setIsConfirmingTerms(!isConfirmingTerms)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary focus:ring-2 dark:bg-primary dark:border-primary"
                />
                <Link
                  to="/terms"
                  className="my-auto mx-auto p-1 text-sm font-medium text-primary underline "
                >
                  {t("terms")}
                </Link>
                  </div>
                <label
                  htmlFor="terms-checkbox"
                  className="ms-2 text-sm font-medium text-red-900 "
                >
                  {t("terms_line")}
                </label>
                
              </div>
              ) :  paymentUrl ? (
                <div className="flex flex-col gap-4">
                  <a
                    href={paymentUrl}
                    className="bg-primary text-white rounded-xl px-8 py-4 capitalize text-center hover:bg-primary_dark transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Pay Now")}
                  </a>
                  {tripType === "round" && (
                    <button
                      className="bg-secondary text-white py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors"
                      onClick={() => navigate("/bus-search-return")}
                    >
                      {t("Continue to Select Return Trip")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => fetchPaymentLink(`${reservationData?.id}`)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t("Retry Payment Link")}
                  </button>
                  {tripType === "round" && (
                    <button
                      className="bg-secondary text-white py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors"
                      onClick={() => navigate("/bus-search-return")}
                    >
                      {t("Continue to Select Return Trip")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ReservationLayout>
  );
};

export default ConfirmReservationPage;
