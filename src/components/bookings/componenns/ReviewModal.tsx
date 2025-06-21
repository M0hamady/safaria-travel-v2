// src/components/ReviewModal.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useOrder } from "../../../context/OrderContext";
import { useToast } from "../../../context/ToastContext";

interface ReviewModalProps {
  orderId: number;
  setTriggerSubmit: (fn: () => void) => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  initialRating?: number;  // Make these optional if needed
  initialComment?: string;
}
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
    if (!rating && !comment) return;
    try {
      await addReview(orderId, rating, comment);
      await onSubmit(rating, comment);
      setSubmitted(true);
      addToast({
        message: t("order.reviewSuccess") || "Review submitted successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to submit review:", err);
      addToast({
        message: t("order.reviewError") || "Failed to submit review.",
        type: "warning",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Rating */}
      <div>
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
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M62.4023 115.736C65.9398 125.862 68.5928 136.28 71.7942 146.529"
              stroke="#003458"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M70.2468 57.6779C77.6931 55.5289 85.8999 54.1848 93.5673 52.9909C94.655 52.8229 99.8904 51.2222 100.642 51.8766C102.614 53.5127 103.162 59.9596 103.64 62.3828C105.471 71.7392 108.84 82.9439 108.124 92.6099L104.701 92.9283C101.164 93.397 97.5822 93.8126 94.036 94.467C89.2095 95.3133 84.3417 95.9037 79.4529 96.2357C78.8604 96.2357 75.1992 96.7929 74.9604 96.4038C72.9264 92.9902 73.0591 86.1276 72.44 82.3249C70.1938 68.4847 67.3108 52.7786 75.27 40.2385C79.2496 33.9684 86.6958 28.5031 94.5577 31.0855C100.748 33.1018 104.498 40.6187 106.797 46.1813C111.44 57.4215 117.33 85.9772 116.056 98.6766C116.056 98.9684 108.336 99.6759 107.655 99.782C97.9802 101.179 88.1992 100.949 78.4713 102.656C63.906 105.212 49.491 108.555 34.9169 111.013C29.3543 111.951 21.4659 114.896 15.8944 112.782C9.14682 110.262 7.24542 100.834 5.41481 94.7147C1.41753 81.2725 -3.6852 50.0726 9.43861 39.0712C13.2325 35.8964 19.5733 35.5868 24.2339 34.7555C36.6679 32.5447 49.1815 31.3861 61.7393 30.2452C65.7189 29.8915 78.374 30.9351 80.1251 26.4337C84.8917 14.2562 63.6142 -5.62413 51.587 3.18404C48.7836 5.22689 49.2522 14.6187 52.3298 16.5643C54.6114 18.0058 59.0774 17.2276 61.6509 16.9799C65.7366 16.5731 69.8046 15.4323 73.8992 15.2112"
              stroke="#003458"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M97.3791 56.3242C93.0546 62.5147 88.5355 68.7052 84.4498 75.0549C83.9369 75.8508 81.275 80.8563 80.3994 80.8297C77.6403 80.7502 74.5097 78.7161 72.1484 77.3453"
              stroke="#003458"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M166.72 68.5726C161.202 71.0753 155.701 72.11 151.439 76.5848C150.705 77.363 149.245 79.5386 150.864 80.8298C152.632 82.2624 154.79 80.1576 155.409 78.7691C157.054 75.1433 149.918 68.1569 145.08 62.7358C140.693 57.7913 136.614 52.5815 132.867 47.1359C130.417 43.6957 127.641 39.5039 127.641 39.5039C127.641 39.5039 144.143 43.5718 151.518 45.8181C159.566 48.2589 168.268 48.8249 176.51 50.5759C178.358 50.9739 190.368 53.6358 191.005 54.4937C192.322 56.2624 191.084 61.9134 190.12 63.6733"
              stroke="#003458"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M127.641 44.1641C125.306 56.3681 123.599 63.505 122.22 68.5723C120.451 75.1873 117.329 84.4465 118.09 86.2594C118.638 87.5417 124.457 89.2573 125.616 89.7083C131.382 91.9457 137.555 93.3784 143.533 94.9349C151.89 97.1104 160.185 99.4097 168.578 101.426L178.447 103.849C178.447 103.849 184.31 86.1621 186.141 79.839"
              stroke="#003458"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M202.946 87.2326C200.346 86.4544 197.48 86.3483 194.986 85.2606C193.504 84.5051 192.122 83.5662 190.874 82.466C188.625 80.8947 186.499 79.1533 184.516 77.2571C184.109 76.8415 183.729 76.3728 183.339 75.966C182.95 75.5592 182.729 75.2674 182.455 74.8871C181.659 73.817 179.581 69.4129 182.605 69.3863C185.02 69.3863 184.454 73.2333 183.773 74.5156C183.243 75.4432 182.579 76.2866 181.801 77.0183C179.307 79.4945 173.072 83.9516 169.791 79.9809C168.19 78.053 168.597 75.1965 169.473 73.0476C171.042 69.4744 173.625 66.4397 176.901 64.319C177.973 63.436 179.208 62.772 180.536 62.3646C182.809 61.949 184.958 63.4877 186.85 64.4605C191.184 66.636 195.694 69.0238 199.311 72.3136"
              stroke="#003458"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M192.352 59.7656C195.597 61.3663 199.25 63.4003 201.796 65.9561C203.657 68.0212 205.255 70.3085 206.554 72.7657C207.892 74.7854 208.882 77.0155 209.481 79.3629C209.853 81.2731 210.667 85.2616 209.711 87.2249C209.596 87.4548 208.429 86.6677 208.332 86.5882C207.598 85.9779 205.626 83.2364 206.775 82.2459C207.412 81.6976 208.429 82.0249 209.119 82.2459C211.16 82.9249 213.125 83.8141 214.982 84.899C223.773 89.6568 232.174 94.9188 241.23 99.1902C244.272 100.623 247.668 103.011 251.002 103.612"
              stroke="#003458"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M180.039 99.4115C186.008 99.4115 192.42 101.454 198.381 100.367C199.698 100.119 203.359 99.2434 203.333 97.3509C203.333 96.272 202.059 95.8298 201.175 95.7414C200.357 95.6374 199.526 95.7705 198.782 96.1248C198.037 96.479 197.41 97.0397 196.974 97.7401C194.481 102.622 200.874 106.752 203.696 109.511C205.951 111.713 207.967 114.145 210.24 116.329C212.742 118.743 215.493 120.892 218.031 123.28C219.853 125.049 221.498 126.977 223.47 128.533C226.008 130.523 228.979 131.823 231.606 133.68"
              stroke="#003458"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div className="flex items-center justify-center w-full">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none "
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              {(hoverRating || rating) >= star ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.7289 2.1886L14.4889 5.7086C14.7289 6.1986 15.3689 6.6686 15.9089 6.7586L19.0989 7.2886C21.1389 7.6286 21.6189 9.1086 20.1489 10.5686L17.6689 13.0486C17.2489 13.4686 17.0189 14.2786 17.1489 14.8586L17.8589 17.9286C18.4189 20.3586 17.1289 21.2986 14.9789 20.0286L11.9889 18.2586C11.4489 17.9386 10.5589 17.9386 10.0089 18.2586L7.01893 20.0286C4.87893 21.2986 3.57893 20.3486 4.13893 17.9286L4.84893 14.8586C4.97893 14.2786 4.74893 13.4686 4.32893 13.0486L1.84893 10.5686C0.388932 9.1086 0.858933 7.6286 2.89893 7.2886L6.08893 6.7586C6.61893 6.6686 7.25893 6.1986 7.49893 5.7086L9.25893 2.1886C10.2189 0.278604 11.7789 0.278604 12.7289 2.1886Z"
                    fill="#0D72B9"
                    stroke="#0074C3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.7289 4.1886L15.4889 7.7086C15.7289 8.1986 16.3689 8.6686 16.9089 8.7586L20.0989 9.2886C22.1389 9.6286 22.6189 11.1086 21.1489 12.5686L18.6689 15.0486C18.2489 15.4686 18.0189 16.2786 18.1489 16.8586L18.8589 19.9286C19.4189 22.3586 18.1289 23.2986 15.9789 22.0286L12.9889 20.2586C12.4489 19.9386 11.5589 19.9386 11.0089 20.2586L8.01893 22.0286C5.87893 23.2986 4.57893 22.3486 5.13893 19.9286L5.84893 16.8586C5.97893 16.2786 5.74893 15.4686 5.32893 15.0486L2.84893 12.5686C1.38893 11.1086 1.85893 9.6286 3.89893 9.2886L7.08893 8.7586C7.61893 8.6686 8.25893 8.1986 8.49893 7.7086L10.2589 4.1886C11.2189 2.2786 12.7789 2.2786 13.7289 4.1886Z"
                    stroke="#003458"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
          <span className="ml-2 text-gray-600">
            {rating > 0 ? `${rating}/5` : ""}
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="flex flex-col">
        <label className="self-stretch text-center justify-start text-[#1e1e1e] text-2xl font-normal font-['HelveticaNeue'] leading-[28.80px] mx-auto w-full ">
          {t("order.comment")}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="self-stretch h-[120px] pb-2 relative bg-white rounded-2xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-[#dde2eb] inline-flex justify-start items-start overflow-hidden w-full px-2 py-2"
          placeholder={t("order.commentPlaceholder")}
        />
      </div>

     
    </div>
  );
};

export default ReviewModal;
