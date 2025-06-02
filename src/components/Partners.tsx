// Partners.tsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Partner } from "../types/types"; // Ensure Partner interface is defined here
import axios from "axios";
const getPartners = async (): Promise<any> => {
	const res = await axios.get(
		`https://demo.telefreik.com/api/v1/partners`,
		{
			headers: {
				"Content-Type": "application/json",
				// "Accept-Language": i18n?.language,
			},
		},
	);
	return res;
}
const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const response = await getPartners();
        // Assuming the API response structure is { data: { data: Partner[] } }
        setPartners(response.data.data);
      } catch (err) {
        setError("Failed to fetch partners.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return <div className="w-full text-center py-8">Loading partners...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full text-black ">
      <Swiper
        slidesPerView={4}
        spaceBetween={5}
        dir="rtl"
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {partners.map((partner) => (
          <SwiperSlide key={partner.id}>
            <div className="w-[150px] h-[150px] flex justify-center items-center max-sm:w-[50px] max-sm:h-[50px] ease-in-out">
              <img
                src={partner.image}
                alt={`Partner ${partner.id}`}
                className="object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Partners;
