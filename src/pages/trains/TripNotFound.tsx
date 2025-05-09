import React from "react";

type TripNotFoundProps = {
  onBack?: () => void;
};

const TripNotFound: React.FC<TripNotFoundProps> = ({ onBack }) => {
  return (
    <div className="text-center p-6 max-w-md mx-auto mt-16 bg-white rounded-xl shadow-md">
      <div className="text-red-600 text-5xl mb-4">🚫</div>
      <h2 className="text-xl font-semibold mb-2">Trip Not Found</h2>
      <p className="text-gray-600 text-sm mb-4">
        We couldn't find the trip you're looking for. Please check again or try a different search.
      </p>
      {onBack && (
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      )}
    </div>
  );
};

export default TripNotFound;
