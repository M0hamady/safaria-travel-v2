// src/components/ReviewModal.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useOrder } from "../../../context/OrderContext";
import { useToast } from "../../../context/ToastContext";

type ReviewModalProps = {
  orderId: number;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  setTriggerSubmit?: (submitFn: () => void) => void;
};

const ReviewModal: React.FC<ReviewModalProps> = ({
  orderId,
  onSubmit,
  setTriggerSubmit,
}) => {
  const { t } = useTranslation();
  const { addReview, loading } = useOrder();
  const { addToast } = useToast();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Reset form when orderId changes
  useEffect(() => {
    setRating(0);
    setComment("");
    setSubmitted(false);
  }, [orderId]);

  // Expose submit trigger externally
  useEffect(() => {
    if (setTriggerSubmit) {
      setTriggerSubmit(handleSubmit);
    }
  }, [rating, comment, setTriggerSubmit]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!rating && !comment) return; // Prevent empty submit
    try {
      await addReview(orderId, rating, comment);
      await onSubmit(rating, comment);
      setSubmitted(true);
      addToast({
        id: Date.now().toString(),
        message: t("order.reviewSuccess") || "Review submitted successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to submit review:", err);
      addToast({
        id: Date.now().toString(),
        message: t("order.reviewError") || "Failed to submit review.",
        type: "warning",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* SVG Graphic */}
      <div className="w-full flex justify-center">
        <svg
          width="252"
          height="149"
          viewBox="0 0 252 149"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M53.7344 111.969C57.5902 124.014 60.482 136.474 63.8072 148.678"
            stroke="#003458"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M62.4023 115.736C65.9398 125.862 68.5928 136.28 71.7942 146.529"
            stroke="#003458"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M70.2468 57.6779C77.6931 55.5289 85.8999 54.1848 93.5673 52.9909C94.655 52.8229 99.8904 51.2222 100.642 51.8766C102.614 53.5127 103.162 59.9596 103.64 62.3828C105.471 71.7392 108.84 82.9439 108.124 92.6099L104.701 92.9283C101.164 93.397 97.5822 93.8126 94.036 94.467C89.2095 95.3133 84.3417 95.9037 79.4529 96.2357C78.8604 96.2357 75.1992 96.7929 74.9604 96.4038C72.9264 92.9902 73.0591 86.1276 72.44 82.3249C70.1938 68.4847 67.3108 52.7786 75.27 40.2385C79.2496 33.9684 86.6958 28.5031 94.5577 31.0855C100.748 33.1018 104.498 40.6187 106.797 46.1813C111.44 57.4215 117.33 85.9772 116.056 98.6766C116.056 98.9684 108.336 99.6759 107.655 99.782C97.9802 101.179 88.1992 100.949 78.4713 102.656C63.906 105.212 49.491 108.555 34.9169 111.013C29.3543 111.951 21.4659 114.896 15.8944 112.782C9.14682 110.262 7.24542 100.834 5.41481 94.7147C1.41753 81.2725 -3.6852 50.0726 9.43861 39.0712C13.2325 35.8964 19.5733 35.5868 24.2339 34.7555C36.6679 32.5447 49.1815 31.3861 61.7393 30.2452C65.7189 29.8915 78.374 30.9351 80.1251 26.4337C84.8917 14.2562 63.6142 -5.62413 51.587 3.18404C48.7836 5.22689 49.2522 14.6187 52.3298 16.5643C54.6114 18.0058 59.0774 17.2276 61.6509 16.9799C65.7366 16.5731 69.8046 15.4323 73.8992 15.2112"
            stroke="#003458"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* ... include the rest of your paths exactly as above */}
        </svg>
      </div>

      {/* Rating Stars */}
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            fontSize="large"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            sx={{
              cursor: "pointer",
              color:
                (hoverRating ?? rating) >= star ? "#ffc107" : "#e4e5e9",
              transition: "color 200ms",
            }}
          />
        ))}
      </div>

      {/* Comment Box */}
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        placeholder={t("order.reviewPlaceholder") || "Write your review..."}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={submitted}
      />

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || submitted || (!rating && !comment)}
        >
          {t("order.submitReview") || "Submit Review"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewModal;
