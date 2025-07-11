import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionFeatures from "./SectionFeatures";
import images from "../assets";

interface TripCardData {
  title: string;
  image: string;
}

const tripCards: TripCardData[] = [
  { title: "Alexandria", image: images.alex },
  { title: "Hurghada", image: images.hurghada },
  { title: "Dahab", image: images.dahap2 },
  { title: "Marsa Alam ", image: images.hurghada3 },
  { title: "Luxor", image: images.luxor },
  { title: "Sohag", image: images.sohag },
];

const StepsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-primary text-white pt-16 px-0" id="steps">
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold text-center mb-10"
      >
        {t("Steps Title")}
      </motion.h2>

   
      {/* Trip Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-sm:px-3">
        {tripCards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden group"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/25 backdrop-blur-md rounded-full shadow text-center">
              <p className="text-sm sm:text-base font-bold text-black font-['Inter'] leading-tight  text-nowrap">
                {t(card.title)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
       {/* Image */}
        <motion.div className="w-full flex gap-5">
          <div>
            <img
              key={images.worldWelcome}
              src={images.worldWelcome}
              alt={t("welcome_image_alt")}
            />
          </div>
        </motion.div>
    </section>
  );
};

export default StepsSection;
