import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await forgotPassword(mobile);
      setMessage("An OTP has been sent to your mobile number.");
      setTimeout(() => {
        navigate(`/forgot-password/verify?mobile=${mobile}`);
      }, 2000);
    } catch (err) {
      setError("Failed to initiate password reset.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Forgot Password
        </h1>
        {message && (
          <p className="text-green-600 text-center mb-4 font-medium">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <input
            type="text"
            placeholder="Enter your mobile number"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
