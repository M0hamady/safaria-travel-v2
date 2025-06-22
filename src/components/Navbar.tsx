// src/components/Navbar.tsx

import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Logo from "./utilies/Logo";
import WorldIcon from "./utilies/WorldIcon";
import { AuthContext } from "../context/AuthContext";
import { formatUserName } from "./utilies/functionalities";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on navigation
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  // Usage in your component:
  <div>{formatUserName(user?.name)}</div>;
  return (
    <div className="w-full bg-white shadow-md " >
      {/* Desktop Navbar */}
      <div className="hidden md:flex w-full max-w-[1440px] h-20 mx-auto px-5 justify-between items-center ">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center gap-6 ">
          <Link to={"/"}>
            <Logo />
          </Link>{" "}
          <nav className="flex gap-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-base font-normal ${
                location.pathname === "/"
                  ? "bg-[#e6f1f9] text-[#1e1e1e]"
                  : "text-[#1e1e1e]"
              }`}
            >
                            {t("home")}

            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 text-base font-normal ${
                location.pathname === "/about"
                  ? "text-primary font-semibold"
                  : "text-[#1e1e1e]"
              }`}
            >
              {t("about")}
              </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 text-base font-normal ${
                location.pathname === "/contact"
                  ? "text-primary font-semibold"
                  : "text-[#1e1e1e]"
              }`}
            >
              {t("contact")}
              </Link>
          </nav>
        </div>

        {/* Right Section - Language, Profile/Logout if logged in, or {t("signIn")}/{t("joinUs")} */}
        <div className="flex items-center gap-4">
        <div className="relative">
            <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-2 cursor-pointer">
              🌍 <span>{t("language")}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-md p-2 rounded-md z-50 w-[120px]">
                <button onClick={() => {
                  i18n.changeLanguage("en")
                  setIsMobileMenuOpen(!langMenuOpen)
                  window.location.reload()
                  }} className="block w-full text-left p-2 hover:bg-gray-200">
                  🇬🇧 English
                </button>
                <button onClick={() => {
                  i18n.changeLanguage("ar")
                  setIsMobileMenuOpen(!langMenuOpen)
                  window.location.reload()
                  }} className="block w-full text-left p-2 hover:bg-gray-200">
                  🇪🇬 العربية
                </button>
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <>
              <Link
                to="dashboard/profile"
                className="flex items-center gap-2 cursor-pointer"
              >
                <PersonOutlineIcon className="text-primary text-2xl" />
                <span className="text-primary text-base font-normal">
                  {formatUserName(user?.name) || t("profile")}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ExitToAppIcon className="text-primary text-2xl" />
                <span className="text-primary text-base font-normal">
                {t("logout")}
                </span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 cursor-pointer"
              >
                <PersonOutlineIcon className="text-primary text-2xl" />
                <span className="text-primary text-base font-normal">
                  {t("signIn")}
                </span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 cursor-pointer"
              >
                <GroupAddIcon className="text-primary text-2xl" />
                <span className="text-primary text-base font-normal">
                  {t("joinUs")}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center px-5 py-3 bg-white">
        <button onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <CloseIcon className="text-2xl text-[#1E1E1E]" />
          ) : (
            <MenuIcon className="text-2xl text-[#1E1E1E]" />
          )}
        </button>
        <Link to={"/"}>
          <Logo />
        </Link>
        <div className="flex gap-3">
        <div className="relative md:hidden">
            <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="">
               <WorldIcon />
            </button>
            {langMenuOpen && (
              <div className="absolute left-0 max-sm:-left-20 max-sm:rtl:-right-20  max-sm:mt-6 z-50 max-sm:w-[120px]  mt-2 bg-white shadow-md p-2 rounded-md">
                <button onClick={() => {
                  
                  i18n.changeLanguage("en")
                  setIsMobileMenuOpen(!langMenuOpen)
                  window.location.reload()
                  }} className="block w-full text-left p-2 hover:bg-gray-200">
                  🇬🇧 English
                </button>
                <button onClick={() =>{
                   i18n.changeLanguage("ar")
                   setIsMobileMenuOpen(!langMenuOpen)
                   window.location.reload()
                   }} className="block w-full text-left p-2 hover:bg-gray-200">
                  🇪🇬 العربية
                </button>
              </div>
            )}
          </div>
          
          {user ? (
            <Link to="/dashboard/profile">
              <PersonOutlineIcon />
            </Link>
          ) : (
            <Link to="/login">
              <PersonOutlineIcon />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-primary flex flex-col items-start px-5 pt-16 space-y-4 text-white z-50 mt-12">
          <Link
            to="/"
            className="w-full py-3 border-b border-[#b9c4d5]"
            onClick={closeMobileMenu}
          >
           {t("home")}
          </Link>
          {/* <Link
            to="/bus-search"
            className="w-full py-3 border-b border-[#b9c4d5]"
            onClick={closeMobileMenu}
          >
            Booking
          </Link> */}
          <Link
            to="/about"
            className="w-full py-3 border-b border-[#b9c4d5]"
            onClick={closeMobileMenu}
          >
            {t("about")}
          </Link>
          <Link
            to="/contact"
            className="w-full py-3 border-b border-[#b9c4d5]"
            onClick={closeMobileMenu}
          >
            {t("contact")}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/profile"
                className="w-full py-3 border-b border-[#b9c4d5]"
                onClick={closeMobileMenu}
              >
                {t("profile")}
              </Link>
              <button onClick={handleLogout} className="w-full text-left py-3">
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full py-3 border-b border-[#b9c4d5]"
                onClick={closeMobileMenu}
              >
                {t("signIn")}
              </Link>
              <Link
                to="/register"
                className="w-full py-3"
                onClick={closeMobileMenu}
              >
                {t("joinUs")}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
