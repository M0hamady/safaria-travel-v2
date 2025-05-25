import React, { useState } from 'react';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = images.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  if (total === 0) return null;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main Slider Image */}
      <div className="relative">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-[139.82px] h-32 object-cover mx-auto"
        />
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full shadow"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full shadow"
          aria-label="Next"
        >
          ›
        </button>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToIndex(idx)}
            className={`w-3 h-3 rounded-full transition-colors duration-200
              ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default ImageSlider;
