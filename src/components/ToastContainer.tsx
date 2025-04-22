import React, { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const MIN_TIMER = 1000; // Minimum time (in ms) the toast should be visible (1 second)
  const MAX_TIMER = 3000; // Maximum time (in ms) the toast should be visible (3 seconds)
  const ONE_MINUTE = 60000; // 1 minute (in ms)
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const timers = toasts.map((toast) => {
      const duration = Math.max(MIN_TIMER, MAX_TIMER);
      let intervalId: NodeJS.Timeout;
      let removeAfterOneMinute: NodeJS.Timeout;

      // Start the progress bar from 0% and increment it
      setProgress((prev) => ({
        ...prev,
        [toast.id]: 0,
      }));

      // Initialize the timeRemaining with the duration
      setTimeRemaining((prev) => ({
        ...prev,
        [toast.id]: Math.floor(duration / 1000), // Convert to seconds
      }));

      intervalId = setInterval(() => {
        setProgress((prev) => {
          const newProgress = (prev[toast.id] || 0) + (100 / duration);
          if (newProgress >= 100) {
            clearInterval(intervalId);
            removeToast(toast.id);
          }
          return {
            ...prev,
            [toast.id]: newProgress,
          };
        });

        // Update the timeRemaining every second
        setTimeRemaining((prev) => {
          const newTime = (prev[toast.id] || 0) - 1;
          if (newTime <= 0) {
            clearInterval(intervalId);
            removeToast(toast.id);
          }
          return {
            ...prev,
            [toast.id]: newTime,
          };
        });
      }, 1000); // Update progress and time every second

      // Timer to remove toast after 1 minute
      removeAfterOneMinute = setTimeout(() => {
        removeToast(toast.id); // Remove toast if it exceeds 1 minute
      }, ONE_MINUTE);

      setTimeout(() => {
        clearInterval(intervalId);
        clearTimeout(removeAfterOneMinute);
        removeToast(toast.id);
      }, duration);

      return intervalId;
    });

    // Cleanup timers when component is unmounted or toasts change
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts,]);

  const getToastConfig = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: <SuccessIcon className="text-green-500" />,
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
        };
      case "error":
        return {
          icon: <ErrorIcon className="text-red-500" />,
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-300",
        };
      case "info":
        return {
          icon: <InfoIcon className="text-blue-500" />,
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-300",
        };
      case "warning":
        return {
          icon: <WarningIcon className="text-yellow-500" />,
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
        };
      default:
        return {
          icon: <InfoIcon className="text-gray-500" />,
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 space-y-3 w-80 max-w-full">
      {toasts.map((toast) => {
        const config = getToastConfig(toast.type);

        return (
          <div
            key={toast.id}
            className={`grid grid-cols-[auto,1fr,auto] items-start p-4 rounded-lg shadow-lg border ${config.bg} ${config.text} ${config.border} transition-all duration-300 transform hover:scale-[1.02]`}
            role="alert"
          >
            {/* Toast Icon */}
            <div className="flex-shrink-0 pt-0.5 mr-3">
              {config.icon}
            </div>

            {/* Toast Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>

            {/* Close Button */}
            <div className="ml-3 flex-shrink-0 flex justify-center items-start">
              <IconButton
                size="small"
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 focus:outline-none"
                aria-label="Close"
              >
                <CloseIcon className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-2 h-1.5 rounded-full bg-gray-200 col-span-3">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress[toast.id] || 0}%`,
                  background: config.bg, // Matching the toast background color
                }}
              ></div>
            </div>

            {/* Timer Display */}
            <div className="mt-2 text-xs text-gray-600">
              {timeRemaining[toast.id]}s left
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
