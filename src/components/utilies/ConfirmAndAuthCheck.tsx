import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface ConfirmAndAuthCheckProps {
  onConfirm: () => void;
  loading?: boolean;
  label?: string;
}

const ConfirmAndAuthCheck: React.FC<ConfirmAndAuthCheckProps> = ({
  onConfirm,
  loading = false,
  label,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [agreed, setAgreed] = useState(false);

  const currentPath = window.location.pathname + window.location.search;

  if (!isAuthenticated) {
    return (
      <button
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded font-medium transition"
        onClick={() => navigate(`/login?prev=${encodeURIComponent(currentPath)}`)}
      >
        {t("You must log in to confirm your reservation.")}
      </button>
    );
  }

  return (
    <div className="space-y-4">
<label className="flex items-center text-sm text-gray-700 space-x-5">
  <input
    type="checkbox"
    checked={agreed}
    onChange={(e) => setAgreed(e.target.checked)}
    className="accent-yellow-600 mx-2"
  />
  <Link
    to="/terms"
    className="text-blue-600 hover:underline"
  >
    {t("I agree to the Terms and Conditions")}
  </Link>
</label>


      <button
        onClick={onConfirm}
        disabled={!agreed || loading}
        className={`w-full text-white py-2 rounded font-medium transition ${
          !agreed || loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? t("Processing...") : label || t("Confirm Reservation")}
      </button>
    </div>
  );
};

export default ConfirmAndAuthCheck;
