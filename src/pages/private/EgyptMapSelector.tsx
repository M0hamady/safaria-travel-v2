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

import { Address } from "../../types/privateTypes";
import { usePrivateTripData } from "../../hooks/usePrivateTripData";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Fab,
} from "@mui/material";
import {
  GpsFixed,
  AddLocation,
  Place,
  Cancel,
  Save,
} from "@mui/icons-material";
import { useToast } from "../../context/ToastContext";

// ======== Custom Marker Icons ========
const createCustomIcon = (color: string) =>
  new L.DivIcon({
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32" fill="${color}">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const defaultIcon = createCustomIcon("#1976d2");
const currentIcon = createCustomIcon("#4caf50");
const propIcon = createCustomIcon("#9c27b0");

// ======== Fly to Location Helper ========
function FlyTo({ coords, zoom = 14 }: { coords: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, zoom, { duration: 1.2 });
  }, [coords, zoom, map]);
  return null;
}

// ======== Map Double-Click Handler ========
function DoubleClickHandler({ onDouble }: { onDouble: (latlng: L.LatLng) => void }) {
  useMapEvents({
    dblclick: (e) => onDouble(e.latlng),
  });
  return null;
}

interface Props {
  locations?: Address[];
  tripId?: string;
  onSelect?: (id: string) => void;
}

export default function EgyptMapSelector({ locations = [], tripId, onSelect }: Props) {
  const {
    boardingAddressId,
    setBoardingAddressId,
    returnAddressId,
    setReturnAddressId,
    addNewAddress,
  } = usePrivateTripData(tripId);
  const { addToast } = useToast();

  // Search & Suggestions state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] =
    useState<{ display_name: string; lat: string; lon: string }[]>([]);

  // Current marker from search or geolocation
  const [current, setCurrent] = useState<{ name: string; coords: [number, number] } | null>(null);

  // Add-dialog state
  const [candidate, setCandidate] = useState<{ coords: [number, number]; label: string } | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  // Debounced suggestions
  useEffect(() => {
    if (query.length < 2) return setSuggestions([]);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&countrycodes=eg&bounded=1`,
          { signal: ctrl.signal }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {}
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  // Handlers
  const handleSuggestion = (item: { display_name: string; lat: string; lon: string }) => {
    setCurrent({ name: item.display_name, coords: [parseFloat(item.lat), parseFloat(item.lon)] });
    setQuery(item.display_name);
    setSuggestions([]);
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setCurrent({ name: 'موقعك', coords: [coords.latitude, coords.longitude] }),
      () => addToast({ message: 'فشل جلب الموقع', type: "error",id:"" }),
      { enableHighAccuracy: true }
    );
  };

  const handleDouble = (latlng: L.LatLng) => {
    setCandidate({ coords: [latlng.lat, latlng.lng], label: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}` });
    setOpenAdd(true);
  };

  const saveAddress = async () => {
    if (!candidate || !newLabel.trim()) return;
    await addNewAddress({
      name: newLabel,
      map_location: { lat: String(candidate.coords[0]), lng: String(candidate.coords[1]), address_name: candidate.label },
      notes: '',
    });
    setOpenAdd(false);
    setNewLabel('');
    setCandidate(null);
  };

  // Select handlers
  const selectBoarding = (id: string) => {
    onSelect?.(id) || setBoardingAddressId(id);
    addToast({ message: 'نقطة الركوب محددة', type: "success",id:""});
  };
  const selectReturn = (id: string) => {
    onSelect?.(id) || setReturnAddressId(id);
    addToast({ message: 'نقطة العودة محددة', type: "success",id:""});
  };

  return (
    <div className="relative w-full h-[60vh]">
      {/* Locate button */}
      <Fab
        onClick={locateMe}
        size="small"
        className="absolute top-4 left-4 z-10 bg-white"
        aria-label="locate me"
      >
        <GpsFixed />
      </Fab>

      {/* Search input */}
      <div className="absolute top-4 right-4 z-10 w-80">
        <div className="relative">
          <TextField
            fullWidth
            size="small"
            placeholder="ابحث..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              endAdornment: <AddLocation className="text-gray-400" />,
            }}
          />
        </div>
        {suggestions.length > 0 && (
          <div className="bg-white shadow rounded mt-1 max-h-60 overflow-auto">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSuggestion(s)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <Place className="inline mr-2 text-gray-500" /> {s.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <MapContainer center={[26.8, 30.8]} zoom={6} className="h-full w-full" doubleClickZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DoubleClickHandler onDouble={handleDouble} />

        {current && <FlyTo coords={current.coords} />}

        {current && (
          <Marker position={current.coords} icon={currentIcon}>
            <Popup>{current.name}</Popup>
          </Marker>
        )}

        {locations.map((loc) => {
          const bid = String(loc.id);
          const isB = bid === boardingAddressId;
          const isR = bid === returnAddressId;
          return (
            <Marker key={bid} position={[+loc.map_location.lat, +loc.map_location.lng]} icon={propIcon}>
              <Popup>
                <div className="flex flex-col space-y-2">
                  <div className="font-semibold">📍 {loc.name}</div>
                  <div className="text-sm">{loc.map_location.address_name}</div>
                  {!boardingAddressId && (
                    <Button size="small" onClick={() => selectBoarding(bid)}>نقطة الركوب</Button>
                  )}
                  {boardingAddressId && !isB && !returnAddressId && (
                    <Button size="small" onClick={() => selectReturn(bid)}>نقطة العودة</Button>
                  )}
                  {isB && <div className="text-green-600">✔️ ركوب مختار</div>}
                  {isR && <div className="text-purple-600">✔️ عودة مختار</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Add address dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="xs" fullWidth>
        <DialogTitle>إضافة عنوان جديد</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="اسم العنوان"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            margin="dense"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} startIcon={<Cancel />}>إلغاء</Button>
          <Button onClick={saveAddress} startIcon={<Save />} variant="contained" disabled={!newLabel.trim()}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}