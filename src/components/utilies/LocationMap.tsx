import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsProvider';

type Props = {
  latitude: number | string;
  longitude: number | string;
  zoom?: number;
  markerColor?: string;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const LocationMap: React.FC<Props> = ({
  latitude,
  longitude,
  zoom = 13,
  markerColor,
}) => {
  const { isLoaded, loadError } = useGoogleMaps();

  const center = {
    lat: typeof latitude === 'string' ? parseFloat(latitude) : latitude,
    lng: typeof longitude === 'string' ? parseFloat(longitude) : longitude,
  };

  const getColoredMarker = (color?: string) => {
    if (!color) return undefined;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="${color}" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 4.97 7 13 7 13s7-8.03 7-13c0-3.87-3.13-7-7-7z"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(36, 36),
      anchor: new google.maps.Point(18, 36),
    };
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <p className="text-red-600 text-sm">Error loading map: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] mx-auto h-64 rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{ disableDefaultUI: true }}
      >
        <Marker position={center} icon={getColoredMarker(markerColor)} />
      </GoogleMap>
    </div>
  );
};

export default LocationMap;