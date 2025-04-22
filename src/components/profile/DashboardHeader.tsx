import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <div className="bg-primary w-full h-[20vh] col-span-2 px-8 py-12 flex items-center justify-between">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white hover:opacity-80"
        aria-label={t("dashboard.back")}
      >
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.75 20.1538L8.25 12.6538L15.75 5.15381"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t("dashboard.back")}
      </button>
      <div className="flex items-center gap-4">
        {/* Future content */}
      </div>
    </div>
  );
};

export default DashboardHeader;
