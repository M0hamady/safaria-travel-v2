import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { VerifyOTPSVG } from "./VerifyOTPSVG";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPasswordPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { forgotPasswordResting, resendOTP, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  if (user) {
    navigate('/')
  }
  // Extract mobile from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mobileFromQuery = params.get("mobile") || "";
    const cleanedMobile = mobileFromQuery.replace(/\D/g, "").replace(/^0+/, "");
    setMobile(cleanedMobile);
  }, [location.search]);

  // Countdown effect for resend timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendTimer]);

  // Mobile number validation
  const validateMobile = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned || cleaned.length < 7) {
      setMobileError(t("mobileInvalid"));
      return false;
    }
    setMobileError(null);
    return true;
  };

  // Password validation
  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError(t("passwordTooShort"));
      return false;
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
      setPasswordError(t("passwordWeak"));
      return false;
    }
    setPasswordError(null);
    return true;
  };

  // OTP input handling
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("").slice(0, 4);
    setOtp(updatedOtp);

    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP handler
  const handleResendOTP = async () => {
    if (!validateMobile(mobile)) return;
    setError(null);
    setMessage(null);
    setIsResending(true);
    try {
      const cleanedMobile = mobile.startsWith("0") ? mobile.slice(1) : mobile;
      await resendOTP(cleanedMobile);
      setMessage(t("otpResent"));
      setResendTimer(240); // 4 minutes
    } catch (err: any) {
      setError(err.message || t("resendFailed"));
    } finally {
      setIsResending(false);
    }
  };

  // Format timer display as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateMobile(mobile)) return;
    if (otp.length !== 4) {
      setError(t("enterDigit"));
      return;
    }
    if (!validatePassword(newPassword)) return;
    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    try {
      const cleanedMobile = mobile.startsWith("0") ? mobile.slice(1) : mobile;
      await forgotPasswordResting(cleanedMobile, otp, newPassword, confirmPassword);
      setMessage(t("passwordResetSuccess"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(t("passwordResetFailed"));
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="container mx-auto max-w-md bg-white p-6 rounded-xl translate-y-20 mb-24 ">
      <div className="max-w-sm mx-auto flex justify-center">
        <VerifyOTPSVG />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">{t("resetPassword")}</h1>
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        {/* Mobile Number */}
        <div className="relative">
          <label
            className={`absolute top-0 ${i18n.language === "ar" ? "right-4" : "left-4"} text-gray-500 transition-all duration-300 ease-in-out ${mobile ? "text-xs -top-6 text-primary font-medium" : "text-base translate-y-4"}`}
          >
            {t("mobileNumber")}
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            className={`w-full h-14 border ${mobileError ? "border-red-500" : "border-gray-300"} rounded-lg bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${i18n.language === "ar" ? "text-right" : "text-left"} text-base`}
            value={mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setMobile(value);
              validateMobile(value);
            }}
            required
          />
          {mobileError && (
            <p className={`mt-1 text-sm text-red-500 ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
              {mobileError}
            </p>
          )}
        </div>

        {/* OTP Inputs */}
        <div className="relative">
          <label
            className={`absolute top-0 ${i18n.language === "ar" ? "right-4" : "left-4"} text-gray-500 transition-all duration-300 ease-in-out ${otp ? "text-xs -top-6 text-primary font-medium" : "text-base translate-y-4"}`}
          >
            {t("otp")}
          </label>
          <div className="flex justify-center space-x-2 pt-6" style={{ direction: "ltr" }}>
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg font-medium"
                value={otp[index] || ""}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                required
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleResendOTP}
              disabled={isResending || resendTimer > 0}
              className="text-primary hover:underline disabled:opacity-50"
            >
              {isResending
                ? t("resending")
                : resendTimer > 0
                ? t("resendOTPIn", { time: formatTime(resendTimer) })
                : t("resendOTP")}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="relative">
          <label
            className={`absolute top-0 ${i18n.language === "ar" ? "right-4" : "left-4"} text-gray-500 transition-all duration-300 ease-in-out ${newPassword ? "text-xs -top-6 text-primary font-medium" : "text-base translate-y-4"}`}
          >
            {t("newPassword")}
          </label>
          <div className="flex items-center border h-14 rounded-lg bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-transparent focus:outline-none text-gray-700 text-base"
              style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`text-gray-500 ${i18n.language === "ar" ? "mr-2" : "ml-2"}`}
              aria-label={t(showPassword ? "hidePassword" : "showPassword")}
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </button>
          </div>
          {passwordError && (
            <p className={`mt-1 text-sm text-red-500 ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
              {passwordError}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label
            className={`absolute top-0 ${i18n.language === "ar" ? "right-4" : "left-4"} text-gray-500 transition-all duration-300 ease-in-out ${confirmPassword ? "text-xs -top-6 text-primary font-medium" : "text-base translate-y-4"}`}
          >
            {t("confirmPassword")}
          </label>
          <div className="flex items-center border h-14 rounded-lg bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full bg-transparent focus:outline-none text-gray-700 text-base"
              style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className={`text-gray-500 ${i18n.language === "ar" ? "mr-2" : "ml-2"}`}
              aria-label={t(showConfirmPassword ? "hidePassword" : "showPassword")}
            >
              {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition transform active:scale-95 w-full"
        >
          {t("resetPassword")}
        </button>
      </form>
      <div
        className={`mt-4 flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between max-w-sm mx-auto`}
      >
        <button
          onClick={() => navigate("/login")}
          className="text-primary hover:underline"
        >
          {t("backToLogin")}
        </button>
        <button
          onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}
          className="text-primary hover:underline"
        >
          {t("switchLanguage")}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;