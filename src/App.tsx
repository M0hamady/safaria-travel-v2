import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { SearchProvider } from "./context/SearchContext";
import { SearchTypeProvider } from "./context/SearchTypeContext";
import { PrivateSearchProvider } from "./context/PrivateSearchContext";
import { OrderProvider } from "./context/OrderContext";
import { ModalProvider } from "./context/ModalContext";

// Components & Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";
import ModalContainer from "./components/ModalContainer";
import AuthRoute from "./components/AuthRoute";
import DashboardLayout from "./layouts/DashboardLayout.";

// Pages - Public
import WelcomePage from "./pages/bublic/Welcome";
import AboutUsPage from "./pages/bublic/AboutUsPage";
import ContactPage from "./pages/bublic/ContactPage";
import Terms from "./pages/bublic/Terms";
import Privacy from "./pages/bublic/Privacy";
import ErrorPage from "./pages/bublic/ErrorPage";

// Pages - Auth
import LoginPage from "./pages/auth/LoginPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/auth/ProfilePage";
import SuccessPayment from "./pages/auth/SuccessPayment";
import NotFoundPage from "./pages/auth/NotFoundPage";

// Pages - Bus
import BusSearchResults from "./pages/bus/pages/BusSearchResults";
import BusSearchResultsReturn from "./pages/bus/pages/BusSearchResultsReturn";
import TripDetailsPage from "./pages/bus/pages/TripDetailsPage";
import TripDetailsPageReturn from "./pages/bus/pages/TripDetailsPageReturn";
import ConfirmReservationPage from "./pages/bus/pages/ConfirmReservationPage";
import ConfirmReservationPageReturn from "./pages/bus/pages/ConfirmReservationPageReturn";

// Pages - Private
import PrivateTripSearchResults from "./pages/private/PrivateTripSearchResults";
import PrivateTripDetailsPage from "./pages/private/PrivateTripDetailsPage";

// i18n
import "./i18n";
import i18next from "i18next";

// Global Styles
import "./App.css";
import { TrainsProvider } from "./context/TrainsContext";
import TrainSearchResults from "./pages/trains/TrainSearchResults";
import TrainTripDetailsPage from "./pages/trains/TrainTripDetailsPage";
import TrainSearchResultsContainer from "./pages/trains/TrainSearchResultsContainer";
import { HelmetProvider } from "react-helmet-async";
import { TrainOrderProvider } from "./context/TrainOrderContext";
import { PrivateOrderProvider } from "./context/PrivateOrderContext";
import PrivateTripDetailsPageData from "./pages/private/PrivateTripDetailsPageData";

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
                <TrainsProvider>
                  <AuthProvider>
                    <OrderProvider>
                    <TrainOrderProvider>
                    <PrivateOrderProvider>
                      <Navbar />
                      <ToastContainer />
                      <ModalContainer />

                      <Routes>
                        {/* ------------------- Public Routes ------------------- */}
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/about" element={<AboutUsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />

                        {/* ------------------- Bus Routes ------------------- */}
                        <Route path="/bus-search" element={<BusSearchResults />} />
                        <Route path="/bus-search/trip/:tripId" element={<TripDetailsPage />} />
                        <Route path="/bus-search-return" element={<BusSearchResultsReturn />} />
                        <Route path="/bus-search-return/trip/:tripId" element={<TripDetailsPageReturn />} />

                        {/* ------------------- Private Trip Routes ------------------- */}
                        <Route path="/private-trips-search" element={<PrivateTripSearchResults />} />
                        <Route path="/private-trips-search/trip/:tripId" element={<PrivateTripDetailsPage />} />
                        <Route path="/private-trips-search/trip/shared/:tripId" element={<PrivateTripDetailsPageData />} />
                        <Route path="/private-search/trip/:tripId" element={<TripDetailsPage />} />

                        {/* ------------------- Train Routes (Planned) ------------------- */}
                        {/* Add your train routes here */}
                            <Route path="/train-search" element={<TrainSearchResultsContainer />} />
                            <Route path="/train-search/trip/:tripId" element={<TrainTripDetailsPage />} />

                        {/* ------------------- Auth Routes ------------------- */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route path="/verify-otp" element={<VerifyOTPPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/forgot-password/verify" element={<ResetPasswordPage />} />
                        <Route path="/success-payment" element={<SuccessPayment />} />

                        {/* ------------------- Protected Routes ------------------- */}
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

                        {/* ------------------- Error Handling ------------------- */}
                        <Route path="/error" element={<ErrorPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>

                      <Footer />
                    </PrivateOrderProvider>
                    </TrainOrderProvider>
                    </OrderProvider>
                  </AuthProvider>
                </TrainsProvider>
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
