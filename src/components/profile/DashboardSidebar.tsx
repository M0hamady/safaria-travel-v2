import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- import here
import { AuthContext } from "../../context/AuthContext";

interface NavItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

const DashboardSidebar: React.FC = () => {
  const { t } = useTranslation(); // <-- translation hook
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const navItems: NavItem[] = [
    { label: t("dashboard.profile"), path: "/dashboard/profile" },
    { label: t("dashboard.booking"), path: "/dashboard/booking" },
    // { label: t("dashboard.addresses"), path: "/dashboard/addresses" },
    { label: t("dashboard.changePassword"), path: "/dashboard/change-password" },
    { label: t("dashboard.deleteAccount"), path: "/dashboard/delete-account" },
    {
      label: t("dashboard.logout"),
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <div className="">
      <div className="flex items-center space-x-4 mb-6 h-[20vh] flex-col ">
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={"6rem"}
          height={"6rem"}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex flex-col mt-8">
          <span className="text-gray-500 text-sm text-center">
            {t("dashboard.greeting")}
          </span>
          <span className="text-xl font-semibold text-gray-800 text-center">
            {user?.name || t("dashboard.defaultName")}
          </span>
        </div>
      </div>

      <ul className="space-y-4 mt-20">
        {navItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between hover:bg-gray-100 p-2 rounded transition-colors"
          >
            {item.path ? (
              <Link to={item.path} className="flex items-center w-full">
                <span className="flex-1 text-gray-800">{item.label}</span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className="flex items-center w-full text-left focus:outline-none"
              >
                <span className="flex-1 text-gray-800">{item.label}</span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardSidebar;
