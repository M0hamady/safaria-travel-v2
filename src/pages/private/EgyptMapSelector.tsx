import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import IconButton from "@mui/material/IconButton";
import { Address } from "../../types/privateTypes";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { usePrivateTripData } from "../../hooks/usePrivateTripData";
import { GpsFixed, AddLocation, Place, Cancel, Save } from "@mui/icons-material";

// Custom marker icons using MUI's Place icon
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    html: `
      <div style="position: relative;">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="${color}">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid ${color};
        "></div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [24, 40],
    iconAnchor: [12, 40],
    popupAnchor: [0, -40]
  });
};

const defaultIcon = createCustomIcon("#1976d2");
const currentLocationIcon = createCustomIcon("#4caf50");
const propLocationIcon = createCustomIcon("#9c27b0");

function FlyToLocation({ coords, zoom = 14 }: { coords: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, zoom, { duration: 1.5 });
  }, [coords, zoom, map]);
  return null;
}

function MapClickHandler({ onDoubleClick }: { onDoubleClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    dblclick: (e) => onDoubleClick(e.latlng),
  });
  return null;
}

export default function EgyptMapSelector({
  locations = [],
}: {
  locations?: Address[];
}) {
  const { addNewAddress } = usePrivateTripData(undefined);
  const [currentLocation, setCurrentLocation] = useState<{ name: string; coords: [number, number] } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [clickedLocation, setClickedLocation] = useState<{ coords: [number, number]; displayName: string } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAddressName, setNewAddressName] = useState("");

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&accept-language=ar&limit=5&countrycodes=eg&viewbox=24.7,31.6,36.9,21.9&bounded=1`
        );
        const data = await resp.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      }
    };
    const deb = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(deb);
  }, [searchQuery]);

  const handleSuggestionClick = (item: { display_name: string; lat: string; lon: string }) => {
    setCurrentLocation({
      name: item.display_name,
      coords: [parseFloat(item.lat), parseFloat(item.lon)],
    });
    setSearchQuery(item.display_name);
    setSuggestions([]);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم جلب الموقع.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation({
          name: "موقعك الحالي",
          coords: [coords.latitude, coords.longitude],
        });
        setSearchQuery("");
        setSuggestions([]);
      },
      () => alert("تعذر جلب الموقع. تحقق من الأذونات."),
      { enableHighAccuracy: true }
    );
  };

  const handleMapDoubleClick = (latlng: L.LatLng) => {
    setClickedLocation({
      coords: [latlng.lat, latlng.lng],
      displayName: `@ ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
    });
    setIsAddDialogOpen(true);
  };

  const handleAddAddress = async () => {
    if (!clickedLocation || !newAddressName.trim()) return;
    await addNewAddress({
      name: newAddressName,
      map_location: {
        lat: clickedLocation.coords[0].toString(),
        lng: clickedLocation.coords[1].toString(),
        address_name: clickedLocation.displayName,
      },
      notes: "",
    });
    setIsAddDialogOpen(false);
    setNewAddressName("");
    setClickedLocation(null);
  };

  return (
    <div className="relative w-full h-full py-2 flex flex-col gap-4">
      {/* Locate-me button */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-full shadow-lg">
        <IconButton onClick={handleLocateMe} aria-label="locate me">
          <GpsFixed className="text-blue-600" />
        </IconButton>
      </div>

      {/* Map */}
      <MapContainer
        center={[26.8206, 30.8025]}
        zoom={6}
        className="flex-1 rounded-lg shadow-lg"
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onDoubleClick={handleMapDoubleClick} />

        {/* Current location marker */}
        {currentLocation && (
          <>
            <FlyToLocation coords={currentLocation.coords} />
            <Marker position={currentLocation.coords} icon={currentLocationIcon}>
              <Popup>{currentLocation.name}</Popup>
            </Marker>
          </>
        )}

        {/* Prop locations */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[Number(loc.map_location.lat), Number(loc.map_location.lng)]}
            icon={propLocationIcon}
          >
            <Popup>
              <div className="flex items-center gap-2">
                <Place className="text-purple-500" />
                <div>
                  <strong>{loc.name}</strong>
                  <br />
                  {loc.map_location.address_name}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Search box */}
      <div className=" w-full max-w-md z-50">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن مكان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-right pr-12 shadow-sm"
            dir="rtl"
          />
          <AddLocation className="absolute right-4 top-3.5 text-gray-400" />
        </div>
        {suggestions.length > 0 && (
          <ul className="bg-white border rounded-xl mt-2 max-h-60 overflow-auto shadow-lg">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="p-3 hover:bg-gray-50 cursor-pointer text-right flex items-center gap-2 border-b last:border-b-0"
              >
                <Place fontSize="small" className="text-gray-400" />
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add address dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle className="flex items-center gap-2">
          <AddLocation className="text-blue-500" />
          إضافة عنوان جديد
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 min-w-[400px]">
            <div className="flex items-center gap-2 text-gray-600">
              <Place fontSize="small" />
              <span>{clickedLocation?.displayName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="material-icons">pin_drop</span>
              <span>
                {clickedLocation?.coords[0].toFixed(4)}, {clickedLocation?.coords[1].toFixed(4)}
              </span>
            </div>
            <TextField
              autoFocus
              margin="dense"
              label="اسم العنوان"
              fullWidth
              variant="outlined"
              value={newAddressName}
              onChange={(e) => setNewAddressName(e.target.value)}
              dir="rtl"
              InputProps={{
                startAdornment: <Place className="mr-2 text-gray-400" />,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsAddDialogOpen(false)}
            startIcon={<Cancel />}
            color="error"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleAddAddress}
            disabled={!newAddressName.trim()}
            startIcon={<Save />}
            color="primary"
            variant="contained"
          >
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}