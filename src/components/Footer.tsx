import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import images from "../assets";
import { Facebook, Google, Instagram, Twitter } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { JSX } from "react/jsx-runtime";

// Define the CustomLink type
export interface CustomLink {
  href: string;
  label: string;
}

// Widget Footer Menu type
export interface WidgetFooterMenu {
  id: string;
  titleKey: string; // Translation key for the title
  menus: CustomLink[];
}

// Define Social types and props for SocialsList1
interface SocialType {
  href: string;
  icon: JSX.Element;
}

interface SocialsList1Props {
  className?: string;
}

// Socials Data
const socials: SocialType[] = [
  { href: "https://www.facebook.com/SafariaaTravel", icon: <Facebook className="m-auto text-3xl" /> },
  { href: "https://x.com/Safaria_Travel", icon: <Twitter className="m-auto text-3xl" /> },
  { href: "https://www.instagram.com/safaria.travel", icon: <Instagram className="m-auto text-3xl" /> },
  { href: "https://play.google.com/store/apps/details?id=com.teleferik", icon: <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_838_19080)">
    <path d="M5.71457 1.11039C4.77562 0.591417 3.67318 0.603416 2.74023 1.11789L13.6746 11.2048L17.3479 7.53152L5.71457 1.11039Z" fill="white"/>
    <path d="M1.64654 2.1499C1.37955 2.58638 1.22656 3.08585 1.22656 3.61532V21.8333C1.22656 22.3463 1.36605 22.8352 1.61804 23.2627L12.6139 12.2668L1.64654 2.1499Z" fill="white"/>
    <path d="M22.2184 10.2195L18.7146 8.28613L14.7773 12.2219L19.6026 16.6722L22.2199 15.2277C23.1619 14.7058 23.7258 13.7698 23.7258 12.7229C23.7243 11.6759 23.1619 10.74 22.2184 10.2195Z" fill="white"/>
    <path d="M13.7173 13.2837L2.69141 24.3096C3.16988 24.5826 3.69485 24.7265 4.22282 24.7265C4.73279 24.7265 5.24576 24.5976 5.71524 24.3381L18.22 17.437L13.7173 13.2837Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_838_19080">
    <rect width="24" height="24" fill="white" transform="translate(0.476562 0.726562)"/>
    </clipPath>
    </defs>
    </svg>
    },
  { href: "https://apps.apple.com/us/app/telefreik/id6447812019", icon: <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_838_19073)">
    <path d="M16.9746 0.726562C15.6951 0.815062 14.1996 1.63406 13.3281 2.70055C12.5331 3.66805 11.8791 5.10504 12.1341 6.50153C13.5321 6.54503 14.9766 5.70653 15.8136 4.62204C16.5966 3.61255 17.1891 2.18455 16.9746 0.726562Z" fill="white"/>
    <path d="M22.0319 8.77872C20.8034 7.23823 19.0769 6.34424 17.4464 6.34424C15.2939 6.34424 14.3834 7.37473 12.8879 7.37473C11.3459 7.37473 10.1745 6.34724 8.31296 6.34724C6.48447 6.34724 4.53749 7.46473 3.30299 9.37572C1.5675 12.0667 1.8645 17.1262 4.67699 21.4356C5.68348 22.9776 7.02747 24.7116 8.78546 24.7266C10.35 24.7416 10.7909 23.7231 12.9104 23.7126C15.0299 23.7006 15.4319 24.7401 16.9934 24.7236C18.7529 24.7101 20.1704 22.7886 21.1769 21.2467C21.8984 20.1412 22.1669 19.5847 22.7264 18.3367C18.6569 16.7872 18.0044 11.0002 22.0319 8.77872Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_838_19073">
    <rect width="24" height="24" fill="white" transform="translate(0.476562 0.726562)"/>
    </clipPath>
    </defs>
    </svg>
     },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="flex items-center justify-center text-2xl text-white hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation(); // Import i18n translation functions
  const [widgetMenus, setWidgetMenus] = useState<WidgetFooterMenu[]>([
    {
      id: "1",
      titleKey: "explore", // Translation key
      menus: [{ href: "/", label: "bus" }],
    },
    {
      id: "2",
      titleKey: "resources",
      menus: [
        { href: "/terms", label: "terms" },
        { href: "/privacy", label: "privacy" },
        { href: "/faqs", label: "faqs" },
      ],
    },
    {
      id: "3",
      titleKey: "get_in_touch",
      menus: [
        { href: "/contact", label: "contact_us" },
        { href: "/about", label: "about_us" },
      ],
    },
  ]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch("https://demo.telefreik.com/api/v1/pages", {
          headers: {
            "Accept-Language": i18n.language, // Fetch pages based on current language
          },
        });
        const data = await response.json();
        if (data.status === 200) {
          let pages = data.data.map((page: any) => ({
            href: `/pages/${page.slug}`,
            label: page.title,
          }
          

        ));
        if (!pages.some((page: { label: string }) => page.label.toLowerCase() === "terms")) {
          pages.push({ href: "/terms", label: t("terms") });
        }
        if (!pages.some((page: { label: string }) => page.label.toLowerCase() === "privacy")) {
          pages.push({ href: "/privacy", label: t("privacy") });
        }
          setWidgetMenus((prevMenus) =>
            prevMenus.map((menu) =>
              menu.id === "2" ? { ...menu, menus: pages } : menu
            )
          );
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchPages();
  }, [i18n.language]); // Refetch when language changes

  return (
    <footer className="w-full bg-[#0A162A] text-white py-8 px-4">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <img src={images.Safaria_logo_white} alt="Logo" className="w-56 max-sm:w-60 mb-4" />
          <p className="text-center md:text-left text-sm opacity-70 ">
            {t("tagline")} {/* Dynamic tagline translation */}
          </p>
        </div>
        {/* Widget Menus */}
        {widgetMenus.map((menu) => (
          <div key={menu.id} className="text-sm">
            <h3 className="text-lg font-medium mb-4">{t(menu.titleKey)}</h3> {/* Dynamic title */}
            <ul className="space-y-2">
              {menu.menus.map((item, idx) => (
                <li key={idx}>
                  <Link className="text-gray-300 hover:text-white" to={item.href}>
                    {t(item.label)} {/* Dynamic menu label */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Socials & Copyright */}
      <div className="mt-8 flex flex-col items-center text-center text-sm opacity-80">
        <SocialsList1 />
        <p className="mt-4 ">
          &copy; {new Date().getFullYear()} {t("copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
