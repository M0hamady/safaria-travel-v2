import { FC, useCallback } from "react";
import { Trip } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import images from "../../assets";
import { useTranslation } from "react-i18next";
import { BusinessCenter, EventSeat, ShareOutlined } from "@mui/icons-material";
import { usePrivateSearchContext } from "../../context/PrivateSearchContext";
const categoryBadgeClasses: Record<string, string> = {
  unknown: "bg-gray-200 text-gray-800",
  limousine: "bg-purple-200 text-purple-800",
  Bus: "bg-blue-200 text-blue-800",
  "Hi-ACE": "bg-green-200 text-green-800",
  Costar: "bg-yellow-200 text-yellow-800",
};
export const TripCard: FC<{ trip: Trip }> = ({ trip }) => {
  const navigate = useNavigate();
  const handleSelect = () => navigate(`/private-trips-search/trip/${trip.id}`);
  const { t } = useTranslation();
  const { tripType } =
    usePrivateSearchContext();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": trip.company,
    "itemOffered": {
      "@type": "Product",
      "name": trip.category,
      "image": trip.company_data.avatar || trip.company_data.bus_image,
      "description": `${trip.company} offers a ${trip.category} trip with ${trip.available_seats} seats available. Luggage: 1 large + 1 small.`
    },
    "priceCurrency": "EGP",
    "price": trip.price_start_with,
    "availability": trip.available_seats > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    "url": `https://yourdomain.com/private-trips-search/trip/${trip.id}`
  };
  const category = trip.bus.category;

  const badgeClass =
    categoryBadgeClasses[category] || "bg-gray-100 text-gray-700"; // fallback
  const label = t(`categories.${category}`, category);
  const handleShare = useCallback(() => {
    const params = new URLSearchParams({
      id: trip.id.toString(),
      company: trip.company,
      category: trip.category,
      date: trip.date,
      time: trip.time,
      availableSeats: trip.available_seats.toString(),
      price: trip.price_start_with.toString(),
      busCategory: trip.bus.category,
      // Add departure and arrival cities
      fromCity: trip.cities_from[0]?.name || '',
      toCity: trip.cities_to[0]?.name || '',
      // Add departure and arrival stations if available
      fromStation: trip.stations_from[0]?.name || '',
      toStation: trip.stations_to[0]?.name || '',
      // Add bus type and features
      busType: trip.bus.type,
      busSalon: trip.bus.salon,
      // Add pricing information
      originalPrice: trip.prices_start_with?.original_price?.toString() || '0',
      finalPrice: trip.prices_start_with?.final_price?.toString() || '0',
      offer: trip.prices_start_with?.offer || '',
      // Add company details
      companyName: trip.company_data.name,
      companyAvatar: trip.company_data.avatar,
      companyBusImage: trip.company_data.bus_image,
      // Add gateway/reference if available
      gatewayId: trip.gateway_id || ''
    }).toString();
    const url = `${window.location.origin}/private-trips-search/trip/shared/${trip.id}?${params}`;
    if (navigator.share) {
      navigator.share({ title: trip.company, url });
    } else {
      navigator.clipboard.writeText(url);
      alert(t('shareLinkCopied'));
    }
  }, [trip.id, trip.company, t]);
  return (
    <article
      className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-start md:items-center gap-4"
      itemScope
      itemType="https://schema.org/Offer"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="px-[18px] py-[17px] bg-white rounded-lg shadow-[0px_4px_4px_rgba(217,217,217,0.25)] inline-flex flex-col justify-start items-start gap-4 w-full w-full">
        <div className="w-full inline-flex justify-start items-center gap-[60px] max-sm:flex-wrap">
          <div className="inline-flex flex-col  justify-center items-center gap-4">
            <img
              className="w-[139.82px] h-20 object-contain"
              src={trip.company_data.avatar || trip.company_logo}
              alt={trip.company_logo}
            />
          </div>

          <div className="flex-1 inline-flex flex-col justify-center items-start gap-6 max-sm:flex-wrap">
            <div className="inline-flex justify-start items-center gap-1">
              <div className="text-[#1e1e1e] text-xl font-medium leading-[30px] font-cairo">
                {trip.company}
              </div>
              
            </div>

            <div className="self-stretch inline-flex justify-start items-center gap-5">
              <div className={`w-[139.82px] px-2.5 py-2 rounded-3xl flex justify-center items-start gap-2.5 border border-[#ddd] ${badgeClass}`}>
                <div className={`text-[#68696a] text-base font-normal leading-normal font-cairo }`}>
                  {trip.category}
                </div>
              </div>

              <div className="inline-flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-start gap-2">
                  <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
                    {trip.available_seats}  {t("seats")} <EventSeat />
                  </div>
                </div>
              </div>

              <div className="inline-flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-start gap-2">
                  <div className="text-[#68696a] text-base font-normal leading-normal font-cairo">
                    {t("luggageInfo")} <BusinessCenter />
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        <div className="w-full pt-4 border-t border-[#b9c4d5] inline-flex justify-end items-center gap-4">
          <div className="flex-1 flex justify-between items-center gap-4 ">
            <div className="inline-flex flex-col  justify-start items-start gap-1">
              <div className="text-primary font-bold text-xl  leading-[30px] font-cairo">
                
                  { tripType === 'round'   ? trip.round_price :trip.go_price} 
                   {' '} {t("busSearchTrips.LE")}
              </div>
              <div className="text-[#68696a] text-xs font-normal leading-[18px] font-cairo">
                { tripType === 'one-way'   ? t("goingTripPrice") : t("roundTripPrice")}
              </div>
              {/* <div
                className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}
              >
                {label}
              </div> */}
            </div>

            <div className="w-[110px] flex justify-start items-start">
              <div
                onClick={handleSelect} // ✅ Navigate on click
                className="flex-1 h-[54px] p-4 bg-[#0074c3] rounded-[9px] shadow-[0px_4px_4px_rgba(217,217,217,0.25)] flex justify-center items-center gap-2 cursor-pointer hover:brightness-90 transition"
              >
                <div className="text-white text-xl font-medium leading-[30px] font-cairo">
                  {t("select")}
                </div>
                {/* <button
                  onClick={handleShare}
                  className="p-2 rounded-full "
                  aria-label={t('share')}
                >
                  <ShareOutlined className="text-white" />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};