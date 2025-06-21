import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardHeader from "../components/profile/DashboardHeader";
import DashboardSidebar from "../components/profile/DashboardSidebar";
import ProfilePage from "../components/profile/ProfilePage";
import BookingPage from "../components/profile/BookingPage";
import AddressesPage from "../components/profile/AddressesPage";
import ChangePasswordPage from "../components/profile/ChangePasswordPage";
import DeleteAccountPage from "../components/profile/DeleteAccountPage";
import SettingsPage from "../components/profile/SettingsPage";

const DashboardLayout: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3 bg-boarder">
      <DashboardHeader />
      <div className="bg-boarder w-full col-span-2 grid grid-cols-12 ">
        <div className="col-span-1 max-sm:hidden"></div>
        <div className="col-span-4 max-sm:hidden sm:block rounded-xl bg-white p-4    mx-4 my-4 -translate-y-14 ">
          <DashboardSidebar />
        </div>
        <div className="col-span-12 rounded-xl sm:hidden bg-white p-4    mx-4 my-4  max-sm:mx-1 -translate-y-14 ">
          <DashboardSidebar />
        </div>
        <div className="max-sm:hidden sm:block col-span-6 p-4  bg-white rounded-xl shadow  mt-4">
          <Routes>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="booking/*" element={<BookingPage />} />
            <Route path="addresses" element={<AddressesPage/>} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route path="delete-account" element={<DeleteAccountPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </div>
        <div className="col-span-1 max-sm:hidden"></div>
        <div className="col-span-1 sm:hidden "></div>
        <div className="sm:hidden max-sm:px-0 max-sm:col-span-12 p-4 bg-white rounded-xl shadow  mt-4 max-sm:mx-1">
          <Routes>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="booking/*" element={<BookingPage />} />
            <Route path="addresses" element={<AddressesPage/>} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route path="delete-account" element={<DeleteAccountPage />} />
            <Route path="settings" element={<SettingsPage />} />
            
          </Routes>
        </div>
        <div className="col-span-1 sm:hidden"></div>
      </div>
    </div>
  );
};

export default DashboardLayout;
