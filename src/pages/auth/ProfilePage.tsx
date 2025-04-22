import React, { useContext, useState, useEffect } from "react";
import {
  AuthContext,
  UserProfile,
  UserProfileU,
} from "../../context/AuthContext";

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
  const [profileData, setProfileData] =
    useState<Partial<UserProfileU>>(initialProfile);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if there are any updates before sending data
  const hasProfileChanged = () => {
    return (
      profileData.email !== initialProfile.email ||
      profileData.name !== initialProfile.name ||
      profileData.mobile !== initialProfile.mobile ||
      profileData.country_code !== initialProfile.country_code ||
      newAvatarFile !== null
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setNewAvatarFile(file); // Store file to send in API
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage(null);
    setError(null);

    if (!hasProfileChanged()) {
      setMessage("No changes detected. Profile is already up to date.");
      return;
    }

    try {
      const updatedData: Partial<UserProfileU> = {};
      // Only include changed fields
      if (profileData.email !== initialProfile.email)
        updatedData.email = profileData.email;
      if (profileData.name !== initialProfile.name)
        updatedData.name = profileData.name;
      if (profileData.mobile !== initialProfile.mobile)
        updatedData.mobile = profileData.mobile;
      if (profileData.country_code !== initialProfile.country_code)
        updatedData.country_code = profileData.country_code;
      if (newAvatarFile) updatedData.avatar = newAvatarFile;
      await updateProfile(updatedData);
      setMessage("Profile updated successfully!");

      // Update initial state after successful update
      setProfileData((prev) => ({ ...prev, ...updatedData }));
      setNewAvatarFile(null);
    } catch (err) {
      setError("Failed to update profile. Please check your information.");
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
            className="w-32 h-32 rounded-full mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="p-2 border rounded"
          />
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
            pattern="^0?\d{11}$"
            title="Mobile number must be 10 or 11 digits, starting with 0 is optional"
            required
          />
        </div>

        <button
          type="submit"
          className={`p-2 rounded ${
            hasProfileChanged()
              ? "bg-primary hover:bg-primary text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!hasProfileChanged()}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
