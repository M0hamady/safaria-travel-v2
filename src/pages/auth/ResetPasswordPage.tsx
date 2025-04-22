import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const { forgotPasswordResting } = useContext(AuthContext);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await forgotPasswordResting(mobile, otp, newPassword, confirmPassword);
      setMessage("Your password has been reset successfully.");
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (err) {
      setError("Failed to reset password. Please check the OTP and try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
      
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Enter your mobile number"
          className="p-2 border rounded"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        
        <input
          type="text"
          placeholder="Enter OTP"
          className="p-2 border rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="p-2 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="p-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
