import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VerifyOTP from "./VerifyOTP";
import { useToast } from "../../context/ToastContext";

const LoginPage: React.FC = () => {
  const { login, verifyOTP, resendOTP, isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [requiresOTP, setRequiresOTP] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const prevPage = params.get("prev") || "/";
  const redirectPath = prevPage;
  const { addToast } = useToast();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login(mobile, password);
      if (result.requiresOTP) {
        addToast({
          message: "This is a otp sended to you!",
          type: "info",
        });
        setRequiresOTP(true);
      } else {
        navigate(redirectPath);
      }
    } catch (err: any) {
      setError(t("login.error"));
    }
  };

  const handleVerifyOTP = async (mobile: string, otp: string) => {
    await verifyOTP(mobile, otp);
    navigate(redirectPath);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setMobile(numericValue);
  };

  return (
    <div className="mx-auto p-4 bg-gradient-to-r from-primary to-primary_dark mb-36">
      {!requiresOTP ? (
        <div className="container mx-auto w-md bg-white p-6 rounded-xl translate-y-20 shadow">
          <div className="mx-auto container max-w-screen-sm">
            <div className="flex flex-row mb-12 capitalize justify-center gap-11 text-white text-xl text-center">
              <h1 className="bg-primary rounded-full w-1/2 px-12 py-2">{t("login.title")}</h1>
              <Link to="/register" className="text-black rounded-full px-8 w-1/2 py-2">
                {t("login.signup")}
              </Link>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLoginSubmit} className="flex flex-col space-y-4">
              
              <div className="flex flex-col">
                <label htmlFor="mobile" className="capitalize text-black opacity-75 mb-1">
                  {t("login.mobile_label")} *
                </label>
                <input
                  id="mobile"
                  type="text"
                  placeholder={t("login.mobile_placeholder")}
                  className="p-2 border rounded"
                  value={mobile}
                  onChange={handleMobileChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="capitalize text-black opacity-75 mb-1">
                  {t("login.password_label")} *
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder={t("login.password_placeholder")}
                  className="p-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-primary">
                {t("login.button")}
              </button>
            </form>
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-primary hover:underline">
                {t("login.forgot_password")}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <VerifyOTP
          mobile={mobile}
          onVerify={handleVerifyOTP}
          redirectPath={redirectPath}
          resendOTP={resendOTP}
          onBack={() => setRequiresOTP(false)}
          prev={prevPage}
        />
      )}
    </div>
  );
};

export default LoginPage;
