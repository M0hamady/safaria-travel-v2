import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const DeleteAccountPage: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/transports/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if using context for auth
        },
      });

      if (!response.ok) {
        throw new Error("فشل حذف الحساب، يرجى المحاولة مرة أخرى لاحقًا.");
      }

      setSuccess("✅ تم حذف الحساب بنجاح! سيتم تسجيل خروجك...");
      
      setTimeout(() => {
        logout(); // Logout after deletion
      }, 1500);
    } catch (err:any) {
      setError(err.message || "حدث خطأ أثناء حذف الحساب.");
    } finally {
      setLoading(false);
      setIsModalOpen(false); // Close modal
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">🚨 حذف الحساب</h2>

      {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-2">{error}</p>}
      {success && <p className="text-green-600 bg-green-100 p-2 rounded mb-2">{success}</p>}

      <p className="text-gray-700 text-center mb-4">
        ⚠️ هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.
      </p>

      <button
        className="w-full p-2 rounded text-white bg-red-600 hover:bg-red-700"
        onClick={() => setIsModalOpen(true)} // Open modal
      >
        🗑️ حذف الحساب نهائيًا
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">تأكيد حذف الحساب</h3>
            <p className="text-gray-600 mb-4">⚠️ هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.</p>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)} // Close modal
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "⏳ جارٍ الحذف..." : "🗑️ تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountPage;
