import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import WelcomePage from "./pages/bublic/Welcome";
import AboutUsPage from "./pages/bublic/AboutUsPage";
import ContactPage from "./pages/bublic/ContactPage";
import BusSearchResults from "./pages/bus/pages/BusSearchResults";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ProfilePage from "./pages/auth/ProfilePage";
import AuthRoute from "./components/AuthRoute";
import DashboardLayout from "./layouts/DashboardLayout.";
import LoginPage from "./pages/auth/LoginPage";
import "./App.css";
import Footer from "./components/Footer";
import TripDetailsPage from "./pages/bus/pages/TripDetailsPage";
import ConfirmReservationPage from "./pages/bus/pages/ConfirmReservationPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import NotFoundPage from "./pages/auth/NotFoundPage";
import ErrorPage from "./pages/bublic/ErrorPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import PrivateTripSearchResults from "./pages/private/PrivateTripSearchResults";
import BusSearchResultsReturn from "./pages/bus/pages/BusSearchResultsReturn";
import TripDetailsPageReturn from "./pages/bus/pages/TripDetailsPageReturn";
import ConfirmReservationPageReturn from "./pages/bus/pages/ConfirmReservationPageReturn";
import { OrderProvider } from "./context/OrderContext";
import "./i18n"; // Import your i18n configuration
import i18next from "i18next";
import Terms from "./pages/bublic/Terms";
import Privacy from "./pages/bublic/Privacy";
import ToastContainer from "./components/ToastContainer";
import ModalContainer from "./components/ModalContainer";
import { ModalProvider } from "./context/ModalContext";
import SuccessPayment from "./pages/auth/SuccessPayment";
import { SearchTypeProvider } from "./context/SearchTypeContext";
import { PrivateSearchProvider } from "./context/PrivateSearchContext";
import PrivateTripDetailsPage from "./pages/private/PrivateTripDetailsPage";

const App: React.FC = () => {
  const currentLanguage = i18next.language;
  return (
    <div
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      className={currentLanguage === "ar" ? "font-ar" : "font-en"}
    >
      <BrowserRouter>
        <ModalProvider>
          <ToastProvider>
            <SearchTypeProvider>
              <SearchProvider>
              <PrivateSearchProvider>

                <AuthProvider>
                  <OrderProvider>
                    <Navbar />
                    <ToastContainer />
                    <ModalContainer />
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<WelcomePage />} />
                      <Route path="/about" element={<AboutUsPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route
                        path="/bus-search"
                        element={<BusSearchResults />}
                      />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route
                        path="/private-trips-search/trip/:tripId"
                        element={<PrivateTripDetailsPage />}
                      />
                      <Route
                        path="/private-search/trip/:tripId"
                        element={<TripDetailsPage />}
                      />
                      <Route
                        path="/bus-search-return"
                        element={<BusSearchResultsReturn />}
                      />
                      <Route
                        path="/bus-search-return/trip/:tripId"
                        element={<TripDetailsPageReturn />}
                      />
                      <Route
                        path="/private-trips-search"
                        element={<PrivateTripSearchResults />}
                      />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegistrationPage />} />
                      <Route path="/verify-otp" element={<VerifyOTPPage />} />
                      <Route
                        path="/success-payment"
                        element={<SuccessPayment />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                      />
                      <Route
                        path="/forgot-password/verify"
                        element={<ResetPasswordPage />}
                      />

                      {/* Authenticated Routes */}
                      <Route
                        path="/confirm-reservation"
                        element={
                          <AuthRoute>
                            <ConfirmReservationPage />
                          </AuthRoute>
                        }
                      />

                      <Route
                        path="/confirm-reservation/return"
                        element={
                          <AuthRoute>
                            <ConfirmReservationPageReturn />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/dashboard/*"
                        element={
                          <AuthRoute>
                            <DashboardLayout />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <AuthRoute>
                            <ProfilePage />
                          </AuthRoute>
                        }
                      />

                      {/* Error Handling */}
                      <Route path="/error" element={<ErrorPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    <Footer />
                  </OrderProvider>
                </AuthProvider>
              </PrivateSearchProvider>

              </SearchProvider>
            </SearchTypeProvider>
          </ToastProvider>
        </ModalProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
