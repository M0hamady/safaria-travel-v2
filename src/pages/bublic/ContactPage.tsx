import React, { useState } from "react";
import { Send, Phone, Email } from "@mui/icons-material";
import images from "../../assets/index";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ContactForm: React.FC = () => {
  const { t, i18n } = useTranslation(); // Use translation hook

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await axios.post(
        "https://app.telefreik.com/api/v1/contact",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": i18n.language, // Dynamically set language header
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setStatus({
          type: "success",
          message: t("contact_form.success_message"), // Success translation
        });
        setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
      } else {
        throw new Error(t("contact_form.error_message")); // Error translation
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: t("contact_form.error_message"), // Error translation
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-start justify-start px-44 max-sm:p-0 max-sm:px-3 max-sm:pt-56 pt-56 min-h-screen bg-cover bg-center bg-no-repeat p-4 mb-24 max-sm:mb-36"
      style={{ backgroundImage: `url(${images.safariabus})` }}
    >
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 translate-y-14 ">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("contact_form.title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("contact_form.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-base">
              {t("contact_form.name_label")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-[50px] border border-gray-300 rounded px-3 outline-none focus:ring-2 focus:ring-primary"
              placeholder={t("contact_form.name_placeholder")}
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-base">
              {t("contact_form.email_label")} *
            </label>
            <div className="relative">
              <Email className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[50px] border border-gray-300 rounded pl-10 px-3 outline-none focus:ring-2 focus:ring-primary"
                placeholder={t("contact_form.email_placeholder")}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-base">
              {t("contact_form.phone_label")} *
            </label>
            <div className="flex">
              <div className="w-20 h-[50px] border border-gray-300 flex items-center justify-center rounded-l bg-gray-100">
                <Phone className="text-gray-500" />
                <span className="ml-2 text-gray-700">+02</span>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-[50px] border border-gray-300 rounded-r px-3 outline-none focus:ring-2 focus:ring-primary"
                placeholder={t("contact_form.phone_placeholder")}
                required
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-base">
              {t("contact_form.message_label")} *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              minLength={25}
              className="w-full h-28 border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              placeholder={t("contact_form.message_placeholder")}
              required
            ></textarea>
          </div>

          {/* Feedback Message */}
          {status.type && (
            <div
              className={`p-3 rounded-lg text-center text-white ${
                status.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Send Button */}
          <div className="w-full flex justify-end " >
            <button
              type="submit"
              className="w-fit h-[50px] bg-primary px-11 text-white text-lg flex  rtl:flex-row-reverse items-center justify-center gap-2 rounded-full hover:bg-primary transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? t("contact_form.loading") : t("contact_form.send_button")}
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
