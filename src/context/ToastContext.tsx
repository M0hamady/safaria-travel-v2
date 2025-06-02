import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import sounds from "../assets/sounds";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  createdAt: number; // Timestamp when toast is created
}
export type ToastFunction = (message: string, type: "success" | "error" | "info" | "warning") => void;

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id" | "createdAt">) => void; // ID and createdAt are not required in the input
  removeToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get stored volume or default to 50
  const storedVolume = localStorage.getItem("volume");
  const volume = storedVolume ? parseInt(storedVolume, 10) / 100 : 0.5;

  // Sound files for different toast types
  const soundFiles: Record<string, string> = {
    success: sounds.bus,
    error: sounds.bus,
    info: sounds.bus,
    warning: sounds.bus,
  };

  // Vibration patterns for success and error toasts
  const vibrationPatterns: Partial<Record<string, number[]>> = {
    success: [100], // Short 100ms pulse for success
    error: [200], // Slightly longer 200ms pulse for error
  };

  // Track user interaction for sound and vibration
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  const addToast = (toast: Omit<Toast, "id" | "createdAt">) => {
    const id = uuidv4(); // Always generate a random ID
    const createdAt = Date.now(); // Record creation timestamp
    setToasts((prevToasts) => [...prevToasts, { ...toast, id, createdAt }]);

    // Play sound and vibrate if user has interacted
    if (userInteracted) {
      // Play sound
      if (soundFiles[toast.type]) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        audioRef.current = new Audio(soundFiles[toast.type]);
        audioRef.current.volume = volume;
        audioRef.current.play().catch((error) => console.error("Audio playback failed:", error));
      }

      // Trigger vibration for success or error
      const pattern = vibrationPatterns[toast.type];
      if (pattern && "vibrate" in navigator) {
        try {
          navigator.vibrate(pattern);
        } catch (error) {
          console.error("Vibration failed:", error);
        }
      }
    }
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};