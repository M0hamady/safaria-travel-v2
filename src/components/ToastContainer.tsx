import React, { useEffect, useState, useRef } from "react";
import { useToast } from "../context/ToastContext";
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  createdAt: number;
}

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const MIN_TIMER = 1000; // Minimum time (in ms)
  const DEFAULT_DURATION = 3000; // Default time (in ms)
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: number }>({});
  const timerRefs = useRef<{ [key: string]: { intervalId: NodeJS.Timeout; timeoutId: NodeJS.Timeout } }>({});
  const pauseRefs = useRef<{ [key: string]: boolean }>({});
  const pauseStartRefs = useRef<{ [key: string]: number }>({});
  const pausedDurationRefs = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const timers = toasts.map((toast: Toast) => {
      const duration = Math.max(MIN_TIMER, DEFAULT_DURATION);

      // Initialize progress and time remaining
      setProgress((prev) => ({
        ...prev,
        [toast.id]: 0,
      }));
      setTimeRemaining((prev) => ({
        ...prev,
        [toast.id]: Math.floor(duration / 1000),
      }));
      pausedDurationRefs.current[toast.id] = 0; // Initialize paused duration

      // Progress and time update interval
      const intervalId = setInterval(() => {
        if (!pauseRefs.current[toast.id]) {
          const elapsed = Date.now() - toast.createdAt - (pausedDurationRefs.current[toast.id] || 0);
          const newProgress = Math.min((elapsed / duration) * 100, 100);
          const newTimeRemaining = Math.max(0, Math.floor((duration - elapsed) / 1000));

          setProgress((prev) => ({
            ...prev,
            [toast.id]: newProgress,
          }));

          setTimeRemaining((prev) => ({
            ...prev,
            [toast.id]: newTimeRemaining,
          }));

          // Check if toast should be removed (deferred to avoid render-time update)
          setTimeout(() => {
            if (newProgress >= 100 || newTimeRemaining <= 0) {
              if (timerRefs.current[toast.id]) {
                clearInterval(timerRefs.current[toast.id].intervalId);
                clearTimeout(timerRefs.current[toast.id].timeoutId);
                delete timerRefs.current[toast.id];
                delete pausedDurationRefs.current[toast.id];
                delete pauseStartRefs.current[toast.id];
                removeToast(toast.id);
              }
            }
          }, 0);
        }
      }, 1000);

      // Auto-dismiss after duration
      const timeoutId = setTimeout(() => {
        if (timerRefs.current[toast.id]) {
          clearInterval(timerRefs.current[toast.id].intervalId);
          delete timerRefs.current[toast.id];
          delete pausedDurationRefs.current[toast.id];
          delete pauseStartRefs.current[toast.id];
          removeToast(toast.id);
        }
      }, duration);

      timerRefs.current[toast.id] = { intervalId, timeoutId };

      return toast.id;
    });

    // Cleanup timers for toasts that are no longer present
    return () => {
      Object.keys(timerRefs.current).forEach((id) => {
        if (!toasts.find((toast) => toast.id === id)) {
          clearInterval(timerRefs.current[id].intervalId);
          clearTimeout(timerRefs.current[id].timeoutId);
          delete timerRefs.current[id];
          delete pausedDurationRefs.current[id];
          delete pauseStartRefs.current[id];
        }
      });
    };
  }, [toasts, removeToast]);

  const handleMouseEnter = (toastId: string) => {
    pauseRefs.current[toastId] = true;
    pauseStartRefs.current[toastId] = Date.now(); // Record when pause starts
  };

  const handleMouseLeave = (toastId: string) => {
    if (pauseRefs.current[toastId]) {
      const pauseDuration = Date.now() - (pauseStartRefs.current[toastId] || Date.now());
      pausedDurationRefs.current[toastId] = (pausedDurationRefs.current[toastId] || 0) + pauseDuration;
      pauseRefs.current[toastId] = false;

      // Adjust timeout to account for paused duration
      if (timerRefs.current[toastId]) {
        clearTimeout(timerRefs.current[toastId].timeoutId);
        const duration = Math.max(MIN_TIMER, DEFAULT_DURATION);
        const toast = toasts.find((t) => t.id === toastId);
        if (toast) {
          const elapsed = Date.now() - toast.createdAt - (pausedDurationRefs.current[toastId] || 0);
          const remaining = Math.max(0, duration - elapsed);
          timerRefs.current[toastId].timeoutId = setTimeout(() => {
            if (timerRefs.current[toastId]) {
              clearInterval(timerRefs.current[toastId].intervalId);
              delete timerRefs.current[toastId];
              delete pausedDurationRefs.current[toastId];
              delete pauseStartRefs.current[toastId];
              removeToast(toastId);
            }
          }, remaining);
        }
      }
    }
  };

  const handleClose = (toastId: string) => {
    if (timerRefs.current[toastId]) {
      clearInterval(timerRefs.current[toastId].intervalId);
      clearTimeout(timerRefs.current[toastId].timeoutId);
      delete timerRefs.current[toastId];
      delete pausedDurationRefs.current[toastId];
      delete pauseStartRefs.current[toastId];
    }
    removeToast(toastId);
  };

  const getToastConfig = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: <SuccessIcon className="text-green-500" />,
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
          progress: "bg-green-500",
        };
      case "error":
        return {
          icon: <ErrorIcon className="text-red-500" />,
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-300",
          progress: "bg-red-500",
        };
      case "info":
        return {
          icon: <InfoIcon className="text-blue-500" />,
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-300",
          progress: "bg-blue-500",
        };
      case "warning":
        return {
          icon: <WarningIcon className="text-yellow-500" />,
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
          progress: "bg-yellow-500",
        };
      default:
        return {
          icon: <InfoIcon className="text-gray-500" />,
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
          progress: "bg-gray-500",
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 space-y-3 w-80 max-w-full sm:w-96">
      {toasts.map((toast) => {
        const config = getToastConfig(toast.type);

        return (
          <div
            key={toast.id}
            className={`grid grid-cols-[auto,1fr,auto] items-start p-4 rounded-lg shadow-lg border ${config.bg} ${config.text} ${config.border} transition-all duration-300 transform hover:scale-[1.02] animate-slide-in`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            onMouseEnter={() => handleMouseEnter(toast.id)}
            onMouseLeave={() => handleMouseLeave(toast.id)}
          >
            {/* Toast Icon */}
            <div className="flex-shrink-0 pt-0.5 mr-3">{config.icon}</div>

            {/* Toast Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>

            {/* Close Button */}
            <div className="ml-3 flex-shrink-0 flex justify-center items-start">
              <IconButton
                size="small"
                onClick={() => handleClose(toast.id)}
                className="opacity-70 hover:opacity-100 focus:outline-none"
                aria-label="Close toast"
              >
                <CloseIcon className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-2 h-1.5 rounded-full bg-gray-200 col-span-3">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progress[toast.id] || 0}%`,
                  backgroundColor: config.progress,
                }}
              ></div>
            </div>

            {/* Timer Display */}
            <div className="mt-2 text-xs text-gray-600 col-span-3">
              {timeRemaining[toast.id] >= 0 ? `${timeRemaining[toast.id]}s left` : "0s left"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;