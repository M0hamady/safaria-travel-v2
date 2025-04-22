import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTPPage: React.FC = () => {
  const { verifyOTP } = useContext(AuthContext);
  const [otp, setOTP] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const email = new URLSearchParams(location.search).get("email");

  if (!email) {
    return <div>Email is required.</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verifyOTP(email, otp);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid OTP or verification failed.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Verify OTP</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-primary">
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOTPPage;
