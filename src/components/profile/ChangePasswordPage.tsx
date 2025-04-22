import { FC, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ChangePasswordPage: FC = () => {
  const { resetPassword, logout } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Validate new password
  const isPasswordValid = (password: string) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    // 🔹 Validate inputs before sending the request
    if (!currentPassword || !newPassword || !newPasswordConfirmation) {
      setError("⚠️ جميع الحقول مطلوبة.");
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setError("❌ كلمات المرور غير متطابقة.");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setError("🔒 يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في ذلك أرقام وحروف.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("⚠️ كلمة المرور الجديدة لا يمكن أن تكون نفس القديمة.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(currentPassword, newPassword, newPasswordConfirmation);
      setSuccess("✅ تم تغيير كلمة المرور بنجاح! سيتم تسجيل خروجك.");

      // Logout after 1.5 seconds
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err) {
      setError("❌ فشل تغيير كلمة المرور. تأكد من صحة كلمة المرور الحالية.");
      console.error("Reset Password Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">🔑 تغيير كلمة المرور</h2>

      {/* Messages */}
      {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-2">{error}</p>}
      {success && <p className="text-green-600 bg-green-100 p-2 rounded mb-2">{success}</p>}

      {/* Current Password */}
      <div className="mb-4">
        <label className="block text-gray-700">كلمة المرور الحالية</label>
        <input
          type="password"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-primary"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      {/* New Password */}
      <div className="mb-4">
        <label className="block text-gray-700">كلمة المرور الجديدة</label>
        <input
          type="password"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-primary"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {/* Password Strength Indicator */}
        {newPassword && (
          <p className={`mt-1 text-sm ${isPasswordValid(newPassword) ? "text-green-600" : "text-red-600"}`}>
            {isPasswordValid(newPassword) ? "✅ كلمة المرور قوية" : "⚠️ كلمة المرور ضعيفة"}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="mb-4">
        <label className="block text-gray-700">تأكيد كلمة المرور الجديدة</label>
        <input
          type="password"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-primary"
          value={newPasswordConfirmation}
          onChange={(e) => setNewPasswordConfirmation(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        className={`w-full p-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-primary hover:bg-primary"
        }`}
        onClick={handleResetPassword}
        disabled={loading}
      >
        {loading ? "⏳ جارٍ المعالجة..." : "🔑 تغيير كلمة المرور"}
      </button>
    </div>
  );
};

export default ChangePasswordPage;
