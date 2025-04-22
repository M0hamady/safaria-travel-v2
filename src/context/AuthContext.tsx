// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { apiFetch, BASE_URL } from "../components/utilies/api";
import {  useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";

export interface UserProfile {
  id: number;
  name: string;
  email: string | null; // Nullable because `email` is null in the example data
  mobile: string;
  phonecode?: string;
  status: string;
  avatar: File | any;
  country_code?: "20";
  api_token?: string;
  is_profile_completed?: boolean;
  // Add other user properties as needed, e.g., name, phone number
}
export interface UserProfileU {
  email: string;
  name: string;
  mobile: string;
  country_code: "20"; // Enforce "20" as the only valid value
  avatar?: string | File;
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (
    mobile: string,
    password: string
  ) => Promise<{ requiresOTP: boolean }>;
  logout: () => void;
  register: (
    mobile: string,
    phonecode: string,
    name: string,
    firebase_token: string,
    os_system: string,
    os_version: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  forgotPasswordResting: (mobile: string,code:string,password:string, passwordConfirmation:string) => Promise<void>;

  verifyOTP: (mobile: string, code: string) => Promise<void>;
  resendOTP: (mobile: string) => Promise<void>;
  validateOTP: (mobile: string, code: string) => Promise<void>;
  forgotPassword: (mobile: string) => Promise<void>;
  resetPassword: (
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  ) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ requiresOTP: false }),
  logout: () => {},
  register: async () => {},
  verifyOTP: async () => {},
  resendOTP: async () => {},
  validateOTP: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  forgotPasswordResting: async () => {},
  updateProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userProfile");
    setIsAuthenticated(!!token);
    if (storedUser) {
      try {
        
        setUser(JSON.parse(storedUser));
      } catch (error) {
      }
    }
  }, []);

  // Login function using the global API helper.
  // It calls the login endpoint and checks if OTP verification is required.
  const login = async (
    mobile: string,
    password: string
  ): Promise<{ requiresOTP: boolean }> => {
    try {
      const data = await apiFetch<any>(
        `${BASE_URL}/api/v1/mobile/customer/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, password, phonecode: 20 }),
        }
      );

      // If the response indicates OTP verification is needed, return that flag.
      if (data.need_verfication) {
        return { requiresOTP: true };
      }
      addToast({
        id: Date.now().toString(),
        message: "welcome!",
        type: "success",
      });
      // Otherwise, store token and user data and update the context.
      localStorage.setItem("authToken", data.data.api_token);
      localStorage.setItem("userProfile", JSON.stringify(data));
      setIsAuthenticated(true);
      navigate(-1)

      const userProfile2: UserProfile = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        mobile: data.data.mobile,
        phonecode:data.data.phonecode,
        status: data.data.status,
        avatar: data.data.avatar,
        country_code: data.data.country_code,
        api_token: data.data.api_token,
        is_profile_completed: data.data.is_profile_completed
      };
      localStorage.setItem("userProfile", JSON.stringify(userProfile2));

      setUser(userProfile2);
      return { requiresOTP: false };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = async (
    mobile: string,
    phonecode: string,
    name: string,
    firebase_token: string,
    os_system: string,
    os_version: string,
    password: string,
    password_confirmation: string
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/mobile/customer/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            mobile,
            phonecode,
            name,
            firebase_token,
            os_system,
            os_version,
            password,
            password_confirmation,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return await response.json(); // Return response data if needed
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  };

  // Verify OTP function upgraded to update localStorage and authentication state.
  const verifyOTP = async (mobile: string, code: string) => {
    try {
      // Remove leading '0' if it exists
      if (mobile.startsWith("0")) {
        mobile = mobile.substring(1);
      }

      const response = await apiFetch<any>(
        `${BASE_URL}/api/v1/mobile/customer/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json",'accept': "application/json" },
          body: JSON.stringify({ mobile, code, phonecode: 20 }),
        }
      );

      // Assuming a successful response includes a token and user data
      if (response && response.status === 200) {
        // Adjust these properties if your API response structure is different.
        const { data } = response;
        if (data) {
          localStorage.setItem("authToken", data.api_token);
          localStorage.setItem("userProfile", JSON.stringify(data));
          setIsAuthenticated(true);
          setUser(data);
        } else {
          throw new Error("Token or user data missing in verifyOTP response");
        }
      } else {
        throw new Error(response?.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  const resendOTP = async (mobile: string) => {
    if (mobile.startsWith("0")) {
      mobile = mobile.substring(1);
    }
    try {
      await apiFetch<any>(`${BASE_URL}/api/v1/mobile/customer/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, phonecode: 20 }),
      });
    } catch (error) {
      console.error("Resend OTP Error:", error);
      throw error;
    }
  };

  const validateOTP = async (mobile: string, code: string) => {
    try {
      await apiFetch<any>(`${BASE_URL}/api/v1/mobile/customer/validate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, phonecode: 20, code }),
      });
    } catch (error) {
      console.error("Validate OTP Error:", error);
      throw error;
    }
  };

  const forgotPassword = async (mobile: string) => {
    try {
      await apiFetch<any>(
        `${BASE_URL}/api/v1/mobile/customer/forget-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, phonecode: 20 }),
        }
      );
    } catch (error) {
      console.error("Forget Password Error:", error);
      throw error;
    }
  };
  const forgotPasswordResting = async (mobile: string,code:string,password:string, passwordConfirmation:string) => {
    try {
      await apiFetch<any>(
        `${BASE_URL}/api/v1/mobile/customer/forget-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, phonecode: 20,code,password,passwordConfirmation }),
        }
      );
    } catch (error) {
      console.error("Forget Password Error:", error);
      throw error;
    }
  };

  const resetPassword = async (
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("User not authenticated");
      await apiFetch<any>(
        `${BASE_URL}/api/transports/profile/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`, // No need for "Content-Type" with FormData
          },
          body: JSON.stringify({
            current_password,
            new_password,
            new_password_confirmation,
          }),
        }
      );
    } catch (error) {
      console.error("Reset Password Error:", error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("User not authenticated");

      const formData = new FormData();

      // Append text fields
      if (profileData.email) formData.append("email", profileData.email);
      if (profileData.name) formData.append("name", profileData.name);
      if (profileData.mobile) formData.append("mobile", profileData.mobile);
      if (profileData.country_code)
        formData.append("country_code", profileData.country_code);

      // Append avatar if it's a file
      if (profileData.avatar instanceof File) {
        formData.append("avatar", profileData.avatar);
      }

      const response = await fetch(`${BASE_URL}/api/transports/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // No need for "Content-Type" with FormData
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update profile");
      }

      const updatedUser = await response.json();

      // Update local storage and state
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
      setUser(updatedUser.data);

      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Profile update failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        register,
        verifyOTP,
        resendOTP,
        validateOTP,
        forgotPassword,
        resetPassword,
        forgotPasswordResting,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
