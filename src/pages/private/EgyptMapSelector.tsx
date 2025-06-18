import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  useJsApiLoader
} from "@react-google-maps/api";
import { Address } from "../../types/privateTypes";
import { usePrivateTripDataContext } from "../../context/PrivateTripDataContext";
import { useToast } from "../../context/ToastContext";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Fab
} from "@mui/material";
import {
  GpsFixed, AddLocation, Place, Cancel, Save
} from "@mui/icons-material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NotesIcon from '@mui/icons-material/Notes';

const containerStyle = {
  width: "100%",
  height: "22rem",
};

const defaultZoom = 7;
const centerEgypt = { lat: 28.8, lng: 30.8 };

interface Props {
  locations?: Address[];
  onSelect?: (id: string) => void;
  mapDialogType?: "boarding" | "return";
  selectedId?: string;
}

const MemoizedMarker = React.memo(Marker);
const MemoizedInfoWindow = React.memo(InfoWindow);

export default function EgyptMapSelector({
  locations = [],
  onSelect,
  mapDialogType = "boarding",
  selectedId,
}: Props) {
  const { 
    addNewAddress, 
    addresses, 
    boardingAddressId, 
    returnAddressId,
    addressesReturn 
  } = usePrivateTripDataContext();
  
  const { addToast } = useToast();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [current, setCurrent] = useState<{ name: string; coords: google.maps.LatLngLiteral } | null>(null);
  const [candidate, setCandidate] = useState<{ coords: google.maps.LatLngLiteral; label: string } | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const effectiveLocations = locations.length ? locations : addresses;

  // Fixed: Added 'directions' library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCDPdRtF8MT2mJBMA_YyYiDPpTeaoYpzUI",
    libraries: [ 'geometry',"places"]
  });

  useEffect(() => {
    if (query.length < 2) return setSuggestions([]);
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=eg&bounded=1`,
          { signal: ctrl.signal }
        );
        const data = await res.json();
        setSuggestions(data);
        if (data.length > 0) {
          setCurrent({
            name: data[0].display_name,
            coords: { 
              lat: parseFloat(data[0].lat), 
              lng: parseFloat(data[0].lon) 
            }
          });
        }
      } catch { }
    }, 300);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  // Calculate route between boarding and return points
  useEffect(() => {
    if (!boardingAddressId || !returnAddressId || !addressesReturn) {
      setDirections(null);
      setDistance(null);
      return;
    }

    const boardingAddress = addresses.find(addr => addr.id === boardingAddressId);
    
    // Fixed: Use addressesReturn directly
    const returnAddress = addressesReturn;

    if (!boardingAddress || !returnAddress) return;

    const origin = {
      lat: boardingAddress.map_location.lat,
      lng: boardingAddress.map_location.lng
    };

    const destination = {
      lat: returnAddress.map_location.lat,
      lng: returnAddress.map_location.lng
    };

    // if (window.google && window.google.maps) {
    //   const directionsService = new google.maps.DirectionsService();
      
    //   directionsService.route(
    //     {
    //       origin,
    //       destination,
    //       travelMode: google.maps.TravelMode.DRIVING,
    //       region: 'eg'
    //     },
    //     (result, status) => {
    //       if (status === google.maps.DirectionsStatus.OK && result) {
    //         setDirections(result);
            
    //         // Calculate distance
    //         let totalDistance = 0;
    //         result.routes[0].legs.forEach(leg => {
    //           if (leg.distance) {
    //             totalDistance += leg.distance.value;
    //           }
    //         });
            
    //         // Convert to kilometers and format
    //         setDistance((totalDistance / 1000).toFixed(1) + ' كم');
    //       } else {
    //         console.error(`Directions request failed: ${status}`);
    //       }
    //     }
    //   );
    // }
  }, [boardingAddressId, returnAddressId, addresses, addressesReturn]);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      addToast({ message: "Geolocation is not supported by your browser", type: "error" });
      return;
    }
    
    addToast({ message: "جاري تحديد موقعك الحالي...", type: "info" });
    
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrent({
          name: "موقعي الحالي",
          coords: { lat: coords.latitude, lng: coords.longitude },
        });
        setActiveInfoWindow('current');
        mapRef.current?.panTo({ lat: coords.latitude, lng: coords.longitude });
        mapRef.current?.setZoom(16);
        addToast({ message: "تم تحديد موقعك بنجاح", type: "success" });
      },
      (error) => {
        let message = "فشل جلب الموقع";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "تم رفض إذن الوصول للموقع";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "معلومات الموقع غير متوفرة";
            break;
          case error.TIMEOUT:
            message = "انتهى الوقت المحدد لطلب الموقع";
            break;
        }
        addToast({ message, type: "error" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [addToast]);

  const handleDoubleClick = useCallback((event: google.maps.MapMouseEvent) => {
    console.log();
    if (event.latLng) {
      const lat = event.latLng.lat(), lng = event.latLng.lng();
      setCandidate({
        coords: { lat, lng },
        label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
      setOpenAdd(true);
      setActiveInfoWindow('current');
    }
  }, []);

  const handleSuggestion = useCallback((item: any) => {
    const lat = parseFloat(item.lat), lng = parseFloat(item.lon);
    setCurrent({ name: item.display_name, coords: { lat, lng } });
    setQuery(item.display_name);
    setSuggestions([]);
    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(16);
    setActiveInfoWindow('current');
  }, []);

  const saveAddress = useCallback(async () => {
    if (!candidate || !newLabel.trim()) return;
    try {
      await addNewAddress({
        name: newLabel,
        map_location: {
          lat: String(candidate.coords.lat),
          lng: String(candidate.coords.lng),
          address_name: candidate.label,
        },
        notes: "",
      });
      addToast({ 
        message: `تم إضافة العنوان "${newLabel}" بنجاح`, 
        type: "success",
      });
      setOpenAdd(false);
      setNewLabel("");
      setCandidate(null);
      setActiveInfoWindow(null);
    } catch {
      addToast({ message: "فشل إضافة العنوان", type: "error" });
    }
  }, [addNewAddress, addToast, candidate, newLabel]);

  const handleSaveCurrentLocation = useCallback(async () => {
    if (!current) return;
    const alreadySaved = addresses.some(
      (addr) =>
        +addr.map_location.lat === current.coords.lat &&
        +addr.map_location.lng === current.coords.lng
    );
    
    if (alreadySaved) {
      addToast({ message: "تم حفظ هذا الموقع مسبقًا", type: "info" });
      return;
    }

    try {
      await addNewAddress({
        name: "موقعي الحالي",
        map_location: {
          lat: String(current.coords.lat),
          lng: String(current.coords.lng),
          address_name: current.name,
        },
        notes: "",
      });
      addToast({ 
        message: "تم حفظ موقعك الحالي بنجاح", 
        type: "success",
      });
      setActiveInfoWindow(null);
    } catch {
      addToast({ message: "فشل حفظ الموقع", type: "error" });
    }
  }, [addNewAddress, addToast, addresses, current]);

  const handleAddressSelect = useCallback((id: string) => {
    setActiveInfoWindow(null);
    if (onSelect) {
      onSelect(id);
      addToast({
        message: mapDialogType === "boarding"
          ? "تم تحديد نقطة الركوب"
          : "تم تحديد نقطة العودة",
        type: "success",
      });
    }
  }, [addToast, mapDialogType, onSelect]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    addToast({ message: 'تم نسخ الإحداثيات', type: 'success', });
  }, [addToast]);

  // Calculate distance between two points
  const calculateDistance = (point1: google.maps.LatLngLiteral, point2: google.maps.LatLngLiteral) => {
    if (!window.google || !window.google.maps || !window.google.maps.geometry) 
      return "...";
    
    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point1),
      new google.maps.LatLng(point2)
    );
    
    return (distance / 1000).toFixed(1) + " كم";
  };

  // Get boarding and return points for distance calculation
  const getBoardingPoint = () => {
    if (!boardingAddressId) return null;
    const boardingAddress = addresses.find(addr => addr.id === boardingAddressId);
    if (!boardingAddress) return null;
    
    return {
      lat: boardingAddress.map_location.lat,
      lng: boardingAddress.map_location.lng
    };
  };

  if (!isLoaded || typeof google === "undefined") {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Fab
        onClick={locateMe}
        size="small"
        className="absolute top-12 left-4 z-10 bg-white shadow-lg"
        aria-label="تحديد الموقع الحالي"
      >
        <GpsFixed />
      </Fab>

      <div className="absolute top-12 right-4 z-50 w-80">
        <div className="relative">
          <TextField
            fullWidth
            size="small"
            className="bg-white shadow-md rounded-lg"
            placeholder="ابحث عن موقع..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions.length > 0) {
                handleSuggestion(suggestions[0]);
                e.preventDefault();
              }
            }}
            InputProps={{ 
              endAdornment: <AddLocation className="text-gray-400" />,
              className: "pr-9"
            }}
          />
          {query && (
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setQuery("")}
            >
              <Cancel fontSize="small" />
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-auto border border-gray-200">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                onClick={() => handleSuggestion(s)}
              >
                <div className="flex items-start">
                  <Place className="mt-0.5 text-blue-500" fontSize="small" />
                  <div className="mr-2">
                    <div className="font-medium text-gray-800">{s.display_name.split(",")[0]}</div>
                    <div className="text-xs text-gray-500 truncate">{s.display_name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={current?.coords || centerEgypt}
        zoom={current ? 14 : defaultZoom}
        onLoad={(map) => {
          mapRef.current = map;
          const bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(22.0, 24.7),
            new google.maps.LatLng(31.7, 36.9)
          );
          map.fitBounds(bounds);
        }} 
        onDblClick={handleDoubleClick}
        options={{
          disableDefaultUI: true,
          disableDoubleClickZoom: true,
          gestureHandling: "greedy",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {/* Display route between boarding and return points */}
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              polylineOptions: {
                strokeColor: "#3B82F6",
                strokeOpacity: 0.8,
                strokeWeight: 5
              },
              suppressMarkers: true
            }}
          />
        )}

        {current && (
          <MemoizedMarker
            position={current.coords}
            icon={{
              url: "https://maps.google.com/mapfiles/kml/shapes/man.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
            onClick={() => setActiveInfoWindow('current')}
            zIndex={1000}
          >
            {activeInfoWindow === 'current' && (
              <MemoizedInfoWindow 
                onCloseClick={() => setActiveInfoWindow(null)}
                options={{ maxWidth: 300 }}
              >
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800">{current.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-1">الإحداثيات:</span>
                    {current.coords.lat.toFixed(6)}, {current.coords.lng.toFixed(6)}
                    <button 
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(`${current.coords.lat.toFixed(6)}, ${current.coords.lng.toFixed(6)}`);
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </button>
                  </div>
                  
                  {/* Show distance to boarding point if available */}
                  {mapDialogType === "return" && boardingAddressId && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">المسافة من نقطة الركوب: </span>
                      {getBoardingPoint() 
                        ? calculateDistance(getBoardingPoint()!, current.coords)
                        : "..."}
                    </div>
                  )}
                  
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={handleSaveCurrentLocation}
                    startIcon={<Save />}
                    className="mt-2"
                  >
                    حفظ هذا الموقع
                  </Button>
                </div>
              </MemoizedInfoWindow>
            )}
          </MemoizedMarker>
        )}

        {effectiveLocations.map((loc) => {
          const pos = { lat: +loc.map_location.lat, lng: +loc.map_location.lng };
          
          const isBoarding = String(loc.id) === boardingAddressId;
          const isSelected = String(loc.id) === selectedId;
          const isReturn = String(loc.id) === addressesReturn?.id;
          
          const getMarkerIcon = () => {
            if (isBoarding) {
              return {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#10B981"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
                )}`,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
              };
            }
            if (isReturn) {
              return {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#3B82F6"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
                )}`,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
              };
            }
            if (isSelected) {
              return {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#F59E0B"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
                )}`,
                scaledSize: new google.maps.Size(36, 36),
                anchor: new google.maps.Point(18, 36)
              };
            }
            return {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#EF4444"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
              )}`,
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 32)
            };
          };

          return (
            <MemoizedMarker
              key={loc.id}
              position={pos}
              icon={getMarkerIcon()}
              onClick={() => {
                handleAddressSelect(String(loc.id));
                setActiveInfoWindow(`address-${loc.id}`);
              }}
              zIndex={isBoarding || isReturn || isSelected ? 100 : 10}
            >
              {activeInfoWindow === `address-${loc.id}` && (
                <MemoizedInfoWindow 
                  onCloseClick={() => setActiveInfoWindow(null)}
                  options={{ maxWidth: 300, minWidth: 250 }}
                >
                  <div className="max-w-xs">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full mt-1 ${
                        isBoarding ? 'bg-green-500' : 
                        isReturn ? 'bg-blue-500' : 
                        isSelected ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-800">{loc.name}</h3>
                          {isBoarding && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                              نقطة الركوب
                            </span>
                          )}
                          {isReturn && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                              نقطة العودة
                            </span>
                          )}
                          {isSelected && !isBoarding && !isReturn && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                              محددة
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start">
                            <Place className="flex-shrink-0 mt-0.5 text-gray-400" fontSize="small" />
                            <div className="mr-2">
                              <p className="text-sm font-medium text-gray-700 break-words">
                                {loc.map_location.address_name}
                              </p>
                              {loc.map_location.address_name && (
                                <p className="text-xs text-gray-500 mt-1">
                                  <span className="font-medium">معلم:</span> {loc.map_location.address_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Show distance to boarding point */}
                        {mapDialogType === "return" && boardingAddressId && !isBoarding && (
                          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
                            <div className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <div>
                                <span className="font-medium">المسافة من نقطة الركوب: </span>
                                {getBoardingPoint() 
                                  ? calculateDistance(getBoardingPoint()!, pos)
                                  : "..."}
                              </div>
                            </div>
                          </div>
                        )}

                        {loc.notes && (
                          <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-gray-700">
                            <div className="flex items-start">
                              <NotesIcon className="text-yellow-500 mr-1" fontSize="small" />
                              <div>
                                <span className="font-medium">ملاحظات:</span> {loc.notes}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}
                      </span>
                      <button 
                        className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
                        }}
                      >
                        <ContentCopyIcon fontSize="small" className="ml-1" />
                        نسخ الإحداثيات
                      </button>
                    </div>
                  </div>
                </MemoizedInfoWindow>
              )}
            </MemoizedMarker>
          );
        })}

        {candidate && candidate.coords && (
          <MemoizedMarker
            position={candidate.coords}
            onClick={() => setActiveInfoWindow('candidate')}
            zIndex={500}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#8B5CF6"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
              )}`,
              scaledSize: new google.maps.Size(36, 36),
              anchor: new google.maps.Point(18, 36)
            }}
          >
            {activeInfoWindow === 'candidate' && (
              <MemoizedInfoWindow
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="space-y-3">
                  <h3 className="font-bold text-purple-700">إضافة موقع جديد</h3>
                  <p className="text-sm text-gray-600">
                    {candidate.label}
                    <button 
                      className="ml-2 text-purple-500 hover:text-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(candidate.label);
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </button>
                  </p>
                  
                  {/* Show distance to boarding point */}
                  {mapDialogType === "return" && boardingAddressId && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>
                          <span className="font-medium">المسافة من نقطة الركوب: </span>
                          {getBoardingPoint() 
                            ? calculateDistance(getBoardingPoint()!, candidate.coords)
                            : "..."}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setOpenAdd(true)}
                    startIcon={<AddLocation />}
                  >
                    إضافة هذا الموقع
                  </Button>
                </div>
              </MemoizedInfoWindow>
            )}
          </MemoizedMarker>
        )}
      </GoogleMap>

      {/* Display total distance when both points are selected */}
      {distance && boardingAddressId && addressesReturn?.id && (
        <div className="absolute bottom-4 left-4 z-50 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="font-medium">المسافة الإجمالية: {distance}</span>
        </div>
      )}

      <Dialog 
        open={openAdd} 
        onClose={() => {
          setOpenAdd(false);
          setCandidate(null);
        }}
        maxWidth="xs" 
        fullWidth
      >
        <DialogTitle className="bg-blue-50 text-blue-700">
          {mapDialogType === "boarding" 
            ? "➕ إضافة عنوان الركوب" 
            : "➕ إضافة عنوان العودة"}
        </DialogTitle>
        <DialogContent className="pt-4">
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Place fontSize="small" className="text-blue-500 mr-1" />
              <span>{candidate?.label}</span>
            </div>
          </div>
          <TextField
            fullWidth
            label="اسم العنوان"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            margin="dense"
            autoFocus
            variant="outlined"
            helperText="مثال: منزل العائلة، مكان العمل، إلخ"
          />
        </DialogContent>
        <DialogActions className="px-4 pb-3">
          <Button 
            onClick={() => {
              setOpenAdd(false);
              setCandidate(null);
            }} 
            startIcon={<Cancel />}
            variant="outlined"
          >
            إلغاء
          </Button>
          <Button
            onClick={saveAddress}
            startIcon={<Save />}
            variant="contained"
            color="primary"
            disabled={!newLabel.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            حفظ العنوان
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}