import React from "react";
import { Link } from "react-router-dom";
import images from "../../assets";

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-6">
    <div className="div">
      <img
        src={images.Im_404}
        alt="safaria can not found that page "
        className="w-full h-full object-cover object-center"
      />
    </div>
    <h1 className="text-5xl font-extrabold text-gray-800 mb-4  text-center" >
      404 - Page Not Found
    </h1>
    <p className="text-lg text-gray-600 mb-8 text-center">
      Oops! The page you're looking for doesn't exist.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-primary text-white rounded shadow hover:bg-secondary transition-colors"
    >
      Go Back Home
    </Link>
  </div>
);

export default NotFoundPage;
