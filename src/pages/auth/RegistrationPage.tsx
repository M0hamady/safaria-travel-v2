import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import VerifyOTP from "./VerifyOTP";
import { useTranslation } from "react-i18next";

const RegistrationPage: React.FC = () => {
  const { register } = useContext(AuthContext);
  const [mobile, setMobile] = useState<string>("");
  const [phoneCode, setPhoneCode] = useState<string>("20"); // Default Egypt
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firebaseToken] = useState<string>("010");
  const [osSystem] = useState<string>("website");
  const [osVersion] = useState<string>("v2");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [requiresOTP, setRequiresOTP] = useState<boolean>(false);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    return password.length >= 6 && /\d/.test(password); // At least 6 chars, 1 digit
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{10,15}$/.test(mobile)) {
      setError("Invalid mobile number. It must be 10-15 digits.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters long and include a number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(
        mobile,
        phoneCode,
        name,
        firebaseToken,
        osSystem,
        osVersion,
        password,
        confirmPassword
      );
      setRequiresOTP(true); // Show OTP verification instead of navigating
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (
    mobile: string,
    otp: string
  ): Promise<void> => {
    navigate("/dashboard"); // Redirect after successful OTP verification
  };

  const resendOTP = async (mobile: string): Promise<void> => {
  };
  const { t } = useTranslation();

  return (
    <div className="mx-auto p-4 bg-gradient-to-r from-primary to-primary_dark mb-36">
      <div className="container mx-auto w-md bg-white p-6 rounded-xl translate-y-20 shadow">
        <div className="max-w-screen-sm mx-auto">
          {requiresOTP ? (
            <VerifyOTP
              mobile={mobile}
              onVerify={handleVerifyOTP}
              redirectPath="/dashboard"
              resendOTP={resendOTP}
              onBack={() => setRequiresOTP(false)}
            />
          ) : (
            <>
              <div className="flex justify-center flex-row-reverse mb-12 text-white text-xl text-center capitalize gap-11">
                <h1 className="bg-primary rounded-full w-1/2 px-12 py-2 text-center">
                  {t("register.title")}
                </h1>

                <Link
                  to="/login"
                  className="text-black rounded-full px-8 w-1/2 py-2 text-center"
                >
                  {t("register.login")}
                </Link>
              </div>

              {error && (
                <p className="text-red-500 mb-4 text-center">{error}</p>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <label className="flex flex-col">
                  {t("register.mobile_label")}
                  <input
                    type="text"
                    className="p-2 border rounded"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </label>
                <label className="flex flex-col">
                  {t("register.name_label")}
                  <input
                    type="text"
                    className="p-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label className="flex flex-col">
                  {t("register.password_label")}
                  <input
                    type="password"
                    className="p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
                <label className="flex flex-col">
                  {t("register.confirm_password_label")}
                  <input
                    type="password"
                    className="p-2 border rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded hover:bg-primary disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("register.registering")
                    : t("register.button")}
                </button>
                <div className="text-center">
                  <span>
                    {t("register.already_have_account")}{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      {t("register.login")}
                    </Link>
                  </span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
