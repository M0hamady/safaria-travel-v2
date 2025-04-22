import { motion } from "framer-motion";
import { Apple, PlayArrow } from "@mui/icons-material";
import images from "../assets/index";
import { useTranslation } from "react-i18next";

const SectionDownloadApp: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Check if the current language is Arabic

  return (
    <section className="w-full text-black py-16 px-4">
      <div className={`container mx-auto flex flex-col md:flex-row items-center gap-8 ${isRTL ? "md:flex-row-reverse" : ""}`}>
        {/* Animated Image Section */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img
            src={images.safariaMobile}
            alt={t("App preview")}
            className="w-[340px] md:w-[520px] "
          />
        </motion.div>

        {/* Animated Text and Buttons Section */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`w-full md:w-1/2 text-center md:text-left ${isRTL ? "md:text-right" : ""}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("The World in a click:")}
          </h2>
          <p className="text-lg mb-6">
            {t("Using Safaria Application, you can plan and book your trips and instantly compare rates to identify the best choice. Download the application and explore the world.")}
          </p>
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            {t("Get the Safaria app")}
          </h2>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="https://apps.apple.com/us/app/telefreik/id6447812019"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-4 rounded-lg shadow-lg duration-700 hover:bg-secondary">
                <Apple />
                <span>{t("App Store")}</span>
              </button>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.teleferik&pli=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-4 rounded-lg shadow-lg duration-700 hover:bg-secondary">
                <PlayArrow />
                <span>{t("Google Play")}</span>
              </button>
            </a>
          </div>


        </motion.div>
      </div>
    </section>
  );
};

export default SectionDownloadApp;
