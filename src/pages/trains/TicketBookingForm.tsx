import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TrainsContext } from "../../context/TrainsContext";
import ConfirmAndAuthCheck from "../../components/utilies/ConfirmAndAuthCheck";
import i18n from "../../i18n";
import { useToast } from "../../context/ToastContext";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { decryptString, encryptString } from "../../components/utilies/encryption";

interface Props {
  onBook: (nationalId: string, seatsNo: number, classId: string) => void;
  loading: boolean;
}

export const TicketBookingForm = ({ onBook, loading }: Props) => {
  const { t } = useTranslation();
  const [nationalId, setNationalId] = useState<string>("");
  const [seatsNo, setSeatsNo] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const isRTL = i18n.language === "ar";
  const { addToast } = useToast();
  const { user } = useContext(AuthContext);
  const {
    selectedTrip,
    selectedClass,
    paymentResponse,
    payment_url,
    setPayment_url,
    loading: processLoading
  } = useContext(TrainsContext);

  const maxSeats = 4;
  const totalCost = selectedClass ? selectedClass.cost * seatsNo : 0;

  // Load nationalId from localStorage (decrypt it)
useEffect(() => {
  const savedId = localStorage.getItem('nationalId');
  if (savedId) {
    (async () => {
      try {
        const decrypted = await decryptString(savedId);
        setNationalId(decrypted);
        addToast({ id: 'loaded-id', message: t("Your National ID is loaded securely."), type: 'info' });
      } catch (err) {
        console.error("Decryption failed", err);
        localStorage.removeItem("nationalId");
      }
    })();
  }
}, []);

  // Save encrypted nationalId
useEffect(() => {
  if (nationalId.trim()) {
    (async () => {
      try {
        const encrypted = await encryptString(nationalId.trim());
        localStorage.setItem("nationalId", encrypted);
        addToast({ id: 'save-id', message: t("Saved securely ✅"), type: "success" });
      } catch (err) {
        console.error("Encryption failed", err);
        addToast({ id: 'enc-error', message: t("Encryption error occurred."), type: "error" });
      }
    })();
  }
}, [nationalId]);


  const increment = () => {
    if (seatsNo < maxSeats) {
      setSeatsNo(prev => prev + 1);
      addToast({ id: 'seat-up', message: t("Increased seat count."), type: "info" });
    }
  };
  const decrement = () => {
    if (seatsNo > 1) {
      setSeatsNo(prev => prev - 1);
      addToast({ id: 'seat-down', message: t("Decreased seat count."), type: "info" });
    }
  };

  const handleGetPaymentUrl = async () => {
    try {
      const token = user?.api_token || localStorage.getItem('authToken');
      if (!token) {
        return addToast({ id: 'auth-missing', message: t("toast.authMissing"), type: 'error' });
      }
      if (paymentResponse?.payment_url) {
        const response = await fetch(paymentResponse.payment_url, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        const finalUrl = data.data?.url;
        if (finalUrl) {
          setPayment_url(finalUrl);
          addToast({ id: 'payment-url-success', message: t("toast.paymentUrlSuccess"), type: 'success' });
        } else {
          addToast({ id: 'payment-url-missing', message: t("toast.paymentUrlMissing"), type: 'error' });
        }
      }
    } catch (error) {
      console.error(error);
      addToast({ id: 'payment-fetch-failure', message: t("toast.paymentFetchFailure"), type: 'error' });
    }
  };

  const handleRedirectToPayment = () => {
    if (payment_url) window.location.href = payment_url;
    else addToast({ id: 'payment-url-missing', message: t("Payment URL is not available."), type: 'error' });
  };

  const handleSubmit = () => {
    const errs: string[] = [];
    if (!nationalId.trim()) errs.push(t("National ID is required."));
    if (!selectedClass?.id) errs.push(t("No class selected."));
    if (seatsNo < 1 || seatsNo > maxSeats) {
      errs.push(t("You can book between 1 to {{max}} seats.", { max: maxSeats }));
    }

    setErrors(errs);
    if (errs.length === 0 && selectedClass) {
      onBook(nationalId.trim(), seatsNo, selectedClass.id);
      addToast({ id: 'booking-started', message: t("Booking in progress..."), type: "info" });
    }
  };

  useEffect(() => {
    if (!loading) {
      setSeatsNo(1);
      setErrors([]);
    }
  }, [loading]);

  if (!selectedTrip || !selectedClass) return null;

  return (
    <motion.div
      className="mt-8 p-6 bg-white rounded-xl shadow-md max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800">🎫 {t("Book Your Ticket")}</h3>

      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm space-y-1">
          {errors.map((err, idx) => <div key={idx}>• {err}</div>)}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("National ID")}</label>
          <input
            type="text"
            value={nationalId}
            onChange={e => setNationalId(e.target.value)}
            className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("Enter your national ID")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("Number of Seats")}</label>
          <div className="flex items-center space-x-2">
            <button onClick={decrement} disabled={seatsNo <= 1}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
              <RemoveIcon fontSize="small" />
            </button>
            <motion.span
              key={seatsNo}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-lg font-medium w-8 text-center"
            >{seatsNo}</motion.span>
            <button onClick={increment} disabled={seatsNo >= maxSeats}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
              <AddIcon fontSize="small" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border rounded px-4 py-3">
          <p className="text-sm text-gray-700"><span className="font-medium">{t("Class")}:</span> {isRTL ? selectedClass.arDesc : selectedClass.enDesc}</p>
          <p className="text-sm text-gray-700"><span className="font-medium">{t("Cost per Seat")}:</span> {selectedClass.cost} {t("price_unit")}</p>
          <p className="text-sm text-gray-700"><span className="font-medium">{t("Total Cost")}:</span> {totalCost} {t("price_unit")} </p>
          <p className="text-sm text-gray-700"><span className="font-medium">{t("Available Seats")}:</span> {selectedClass.availableSeatsCount}</p>
        </div>

        <ConfirmAndAuthCheck onConfirm={handleSubmit} loading={loading} label={t("Book Ticket")} />
      </div>

      {paymentResponse && !loading && (
        !payment_url ? (
          <button onClick={handleGetPaymentUrl}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            {t("button.getPaymentUrl")}
          </button>
        ) : (
          <button onClick={handleRedirectToPayment}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            {t("button.proceedToPayment")}
          </button>
        )
      )}
    </motion.div>
  );
};
