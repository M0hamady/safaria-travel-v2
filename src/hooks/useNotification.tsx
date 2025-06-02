import { useToast } from "../context/ToastContext";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number; // Optional duration in milliseconds
}

const useNotification = () => {
  const { addToast } = useToast();

  const triggerToast = async ({ message, type, duration = 3000 }: ToastOptions) => {
    addToast({ message, type });
  };

  return triggerToast;
};

export default useNotification;