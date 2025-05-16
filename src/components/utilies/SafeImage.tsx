import React, { useEffect, useRef, useState } from "react";

interface SafeImageProps {
  url: string;
  alt?: string;
  className?: string;
  whiteThreshold?: number;
  filterIntensity?: number;
  crossOrigin?: "anonymous" | "use-credentials" | "";
}

const SafeImage: React.FC<SafeImageProps> = ({
  url,
  alt = "",
  className = "",
  whiteThreshold = 0.8,
  filterIntensity = 0.9,
  crossOrigin = "anonymous"
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isWhitePng, setIsWhitePng] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCrossOrigin, setIsCrossOrigin] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleError = () => setHasError(true);
    img.addEventListener('error', handleError);

    img.onload = () => {
      // Check if image is PNG
      const isPng = url.toLowerCase().endsWith('.png') || 
                   img.src.toLowerCase().endsWith('.png') || 
                   img.currentSrc?.toLowerCase().endsWith('.png');

      if (!isPng) {
        img.removeEventListener('error', handleError);
        return;
      }

      // Create canvas and context
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      
      if (!ctx) {
        img.removeEventListener('error', handleError);
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      try {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        let whitePixelCount = 0;
        let totalPixels = imageData.length / 4;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];
          
          if (r > 240 && g > 240 && b > 240 && a > 240) {
            whitePixelCount++;
          }
        }

        const whiteRatio = whitePixelCount / totalPixels;
        if (whiteRatio > whiteThreshold) {
          setIsWhitePng(true);
        }
      } catch (error) {
        // Handle CORS error
        console.warn("Cannot analyze image due to CORS restrictions:", error);
        setIsCrossOrigin(true);
        
        // Fallback check using color detection from the rendered image
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = 1;
          tempCanvas.height = 1;
          const tempCtx = tempCanvas.getContext("2d");
          
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, 1, 1);
            const pixel = tempCtx.getImageData(0, 0, 1, 1).data;
            if (pixel[0] > 240 && pixel[1] > 240 && pixel[2] > 240) {
              setIsWhitePng(true);
            }
          }
        }
      }

      img.removeEventListener('error', handleError);
    };
  }, [url, whiteThreshold]);

  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={url}
      alt={alt}
      crossOrigin={crossOrigin}
      className={`${className} object-contain ${isWhitePng ? `
        bg-gray-200 
        shadow-md 
        rounded 
      ` : ""}`}
      style={isWhitePng ? {
        filter: `brightness(${1 - filterIntensity}) contrast(${1 + filterIntensity})`
      } : {}}
    />
  );
};

export default SafeImage;