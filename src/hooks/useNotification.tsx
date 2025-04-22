import { useEffect, useState, useRef } from "react";
import { useToast } from "../context/ToastContext";
import { v4 as uuidv4 } from "uuid";

type ToastType = "success" | "error" | "info" | "warning";

const useNotification = () => {
  const { addToast, removeToast } = useToast();
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Store active audio instance

  // Get stored volume or default to 50 if not set
  const storedVolume = localStorage.getItem("volume");
  const volume = storedVolume ? parseInt(storedVolume, 10) : 50;

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

  const triggerToast = async (message: string, type: ToastType) => {
    const id = uuidv4();
    addToast({ id, message, type });

    // Stop sound when toast is removed
    setTimeout(() => {
      removeToast(id);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, 3000); // Adjust timeout to match toast duration
  };

  return triggerToast;
};

export default useNotification;
