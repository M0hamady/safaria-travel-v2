import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

type Props = {
  latitude: number;
  longitude: number;
  zoom?: number;
  markerColor?: string; // نستخدم لون الماركر إذا متاح
};

// لإنشاء أيقونة مخصصة باللون المطلوب
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="${color}" viewBox="0 0 24 24"><path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

// كمبوننت لتحديث الزوم والإحداثيات عند التغيير
const MapUpdater = ({ latitude, longitude, zoom }: { latitude: number; longitude: number; zoom: number }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView([latitude, longitude], zoom);
  }, [latitude, longitude, zoom, map]);
  return null;
};

const LocationMap: React.FC<Props> = ({
  latitude,
  longitude,
  zoom = 13,
  markerColor = "#2b6cb0", // لون أزرق إفتراضي
}) => {
  const icon = createCustomIcon(markerColor);

  return (
    <div className="w-full max-w-[400px] mx-auto bg-black h-64 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg"
      >
        <MapUpdater latitude={latitude} longitude={longitude} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={icon}>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;