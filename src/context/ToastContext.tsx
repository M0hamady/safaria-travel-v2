import React, { createContext, useContext, useState, useEffect } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}
export type ToastFunction = (message: string, type: "success" | "error" | "info" | "warning") => void;

interface ToastContextType {
  addToast: (toast: Toast) => void;
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

  const addToast = (toast: Toast) => {
    setToasts((prevToasts) => [...prevToasts, toast]);

    // Set a timer to automatically remove the toast after 1 minute (60000ms)
    setTimeout(() => {
      removeToast(toast.id);
    }, 4000); // 1 minute
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Cleanup: Remove any toast older than 1 minute (if needed)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => currentTime - new Date(toast.id).getTime() < 60000)
      );
    }, 4000); // Check every 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};
