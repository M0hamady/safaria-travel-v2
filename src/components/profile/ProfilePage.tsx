import React, { useContext, useState } from "react";
import { AuthContext, UserProfile } from "../../context/AuthContext";

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useContext(AuthContext);

  // Store initial state to compare changes
  const initialProfile = {
    email: user?.email || "",
    name: user?.name || "",
    mobile: user?.mobile || "",
    country_code: "20" as const, // Explicitly set as "20"
    avatar: user?.avatar || "",
  };

  const [profileData, setProfileData] = useState<Partial<UserProfile>>(initialProfile);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setNewAvatarFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(initialProfile.avatar || "");
      setNewAvatarFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!profileData.email || !profileData.name || !profileData.mobile) {
        throw new Error("Please fill out all required fields.");
      }

      // Prepare data to send
      const updatedData: Partial<UserProfile> = {
        email: profileData.email,
        name: profileData.name,
        mobile: profileData.mobile,
        country_code: "20", // Explicitly set as "20"
      };

      // Include avatar only if updated
      if (newAvatarFile) {
        updatedData.avatar = newAvatarFile;
      }

      await updateProfile(updatedData);
      setMessage("Profile updated successfully!");

      // Reset avatar file after successful update
      setNewAvatarFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile. Please check your information.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Update Profile</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <img 
            src={avatarPreview || "/default-avatar.png"} 
            alt="Avatar"
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="p-2 border rounded"
          />
          {avatarPreview !== initialProfile.avatar && (
            <button
              type="button"
              onClick={() => {
                setAvatarPreview(initialProfile.avatar || "");
                setNewAvatarFile(null);
              }}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Reset Avatar
            </button>
          )}
        </div>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={profileData.email || ""}
          onChange={handleInputChange}
          required
        />

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="p-2 border rounded"
          value={profileData.name || ""}
          onChange={handleInputChange}
          required
        />

        {/* Mobile with Country Code */}
        <div className="flex items-center">
          <span className="bg-gray-200 p-2 rounded-l">+20</span>
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            className="p-2 border rounded-r flex-1"
            value={profileData.mobile || ""}
            onChange={handleInputChange}
            pattern="[0-9]{10}"
            title="10-digit mobile number without country code"
            required
          />
        </div>

        <button 
          type="submit" 
          className={`p-2 rounded ${
            isLoading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-primary hover:bg-primary text-white"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;