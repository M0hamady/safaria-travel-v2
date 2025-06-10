import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VerifyOTPSVG } from "./VerifyOTPSVG";

interface VerifyOTPProps {
  mobile: string;
  onVerify: (mobile: string, otp: string) => Promise<void>;
  resendOTP: (mobile: string) => Promise<void>;
  redirectPath?: string;
  prev?: string;
  onBack: () => void;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({
  mobile,
  onVerify,
  resendOTP,
  redirectPath,
  onBack,
  prev,
}) => {
  const { t, i18n } = useTranslation();
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [prevPage] = useState<string | undefined>(prev);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Clean mobile number (remove leading '0')
  const cleanedMobile = mobile.startsWith("0") ? mobile.slice(1) : mobile;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (value.length > 1) return; // Restrict to one digit

    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("").slice(0, 4); // Ensure max 4 digits
    setOtp(updatedOtp);

    // Move to next input only if current input has a digit and not the last input
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (otp.length !== 4) {
      setError(t("enterDigit"));
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(cleanedMobile, otp);
      navigate(redirectPath || prevPage || "/");
    } catch (err: any) {
      setError(err.message || t("otpVerificationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    setMessage(null);
    setIsResending(true);
    try {
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

  // Handle language toggle
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr");
  };

  return (
    <div className="container mx-auto max-w-md bg-white p-4 rounded-xl translate-y-20">
      <div className="max-w-sm mx-auto flex justify-center">
        <VerifyOTPSVG />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">{t("verifyOTP")}</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 items-center"
      >
        <p className="text-center">{t("otpSent")}</p>
        <div
          className="flex justify-center space-x-2"
          style={{ direction: "ltr" }} // Ensure inputs are LTR (first input on left)
        >
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              className="w-12 h-12 text-center border rounded-md focus:outline-none focus:border-primary text-lg font-medium"
              value={otp[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs"
        >
          {isLoading ? t("verifying") : t("verifyOTP")}
        </button>
      </form>
      <div
        className={`mt-4 flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between max-w-sm mx-auto`}
      >
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
        <button onClick={onBack} className="text-gray-600 hover:underline">
          {t("backToLogin")}
        </button>
      </div>
      <button
        onClick={toggleLanguage}
        className="mt-4 text-sm text-primary hover:underline max-w-sm mx-auto block"
      >
        {t("switchLanguage")}
      </button>
    </div>
  );
};

export default VerifyOTP;