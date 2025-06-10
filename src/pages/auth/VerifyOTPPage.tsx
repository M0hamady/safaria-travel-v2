import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const VerifyOTPPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { verifyOTP } = useContext(AuthContext);
  const [otp, setOTP] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from URL query params
  const email = new URLSearchParams(location.search).get("email");

  // Handle language toggle (optional, for manual switching)
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr");
  };

  // Check if email is missing
  if (!email) {
    return <div className="text-center text-red-500">{t("emailRequired")}</div>;
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      await verifyOTP(email, otp);
      navigate("/dashboard");
    } catch (err) {
      setError(t("invalidOTP"));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      {/* Language toggle button (optional) */}
      <button
        onClick={toggleLanguage}
        className="mb-4 text-sm text-primary hover:underline"
      >
        {t("switchLanguage")}
      </button>

      <h1 className="text-3xl font-bold mb-4">{t("verifyOTP")}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder={t("enterOTP")}
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          className={`p-2 border rounded ${i18n.language === "ar" ? "text-right" : "text-left"}`}
          required
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        />
        <button
          type="submit"
          className="bg-primary text-white p-2 rounded hover:bg-primary-dark"
        >
          {t("verify")}
        </button>
      </form>
    </div>
  );
};

export default VerifyOTPPage;