import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Navigate to home or retry logic here; adjust according to your needs
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6 h-full ">
      <h1 className="text-5xl font-extrabold text-red-500 mb-4">
        An Error Occurred
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        We're sorry, something went wrong.
      </p>
      <button
        onClick={handleRetry}
        className="px-8 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorPage;
