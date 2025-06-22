import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Address } from '../../types/privateTypes';
import { usePrivateTripDataContext } from '../../context/PrivateTripDataContext';
import { useToast } from '../../context/ToastContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Fab,
} from '@mui/material';
import { GpsFixed, AddLocation, Place, Cancel, Save } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NotesIcon from '@mui/icons-material/Notes';
import { useGoogleMaps } from '../../context/GoogleMapsProvider';

// Styles for EgyptMapSelector component
const styles = {
  errorContainer: "flex flex-col items-center justify-center h-full bg-red-50 p-4 rounded-lg text-center",
  errorIcon: "text-red-600 mb-3",
  errorHeading: "text-xl font-bold text-red-700 mb-2",
  errorText: "text-gray-600 mb-4",
  errorDetail: "text-sm text-gray-500",
  retryButton: "mt-4",

  loadingContainer: "flex items-center justify-center h-[40rem] bg-gray-50 rounded-lg",
  loadingSpinner: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto",
  loadingText: "mt-4 text-gray-600",

  mapContainer: "relative w-full h-[40rem] md:h-[30rem] max-sm:h-[48rem] mx-auto rounded-lg overflow-hidden",
  locateButton: "absolute md:top-[25rem] ltr:left-4 rtl:right-4 z-10 bg-white shadow-lg hover:bg-gray-100 max-sm:top-[35rem]",

  searchContainer: "absolute md:top-12 max-sm:top-[5rem] right-4 z-50 w-full max-w-xs sm:max-w-sm",
  searchInput: "bg-white shadow-md rounded-lg pr-9",
  searchClearButton: "absolute right-2 rtl:left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
  suggestionsContainer: "bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-auto border border-gray-200",
  suggestionItem: "px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors",
  suggestionContent: "mr-2",

  currentLocationButton: "mt-2 bg-blue-600 hover:bg-blue-700",

  addressInfoContainer: "max-w-xs",
  addressBadge: (color: string) => `px-2 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800 rounded-full whitespace-nowrap`,
  addressDetails: "mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200",
  addressNotes: "mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-gray-700",
  coordinatesContainer: "mt-3 flex justify-between items-center pt-2 border-t border-gray-200",
  copyButton: "text-xs flex items-center text-blue-600 hover:text-blue-800",

  candidateButton: "bg-purple-600 hover:bg-purple-700",

  dialogTitle: "bg-blue-50 text-blue-700 text-lg font-semibold",
  dialogContent: "pt-4",
  locationPreview: "mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200",
  cancelButton: "text-gray-600 hover:text-gray-800",
  saveButton: "bg-blue-600 hover:bg-blue-700"
};

// Custom map styles for EgyptMapSelector
const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#717171' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#d1d1d1' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#e0e0e0' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8a8a' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#b3e0ff' }],
  },
];

const defaultZoom = 7;
const centerEgypt = { lat: 28.8, lng: 30.8 };

interface Props {
  locations?: Address[];
  onSelect?: (id: string) => void;
  mapDialogType?: 'boarding' | 'return';
  selectedId?: string;
}

const MemoizedMarker = React.memo(Marker);
const MemoizedInfoWindow = React.memo(InfoWindow);

export default function EgyptMapSelector({
  locations = [],
  onSelect,
  mapDialogType = 'boarding',
  selectedId,
}: Props) {
  const {
    addNewAddress,
    addresses,
    boardingAddressId,
    returnAddressId,
    addressesReturn,
    fetchAddresses
  } = usePrivateTripDataContext();

  const { addToast } = useToast();
  const { isLoaded, loadError } = useGoogleMaps();

  const [query, setQuery] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [current, setCurrent] = useState<{ name: string; coords: google.maps.LatLngLiteral } | null>(null);
  const [candidate, setCandidate] = useState<{ coords: google.maps.LatLngLiteral; label: string } | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
  const [effectiveLocations, setEffectiveLocations] = useState<any[]>([]);

  const mapRef = useRef<google.maps.Map | null>(null);
  
  useEffect(() => {
    setEffectiveLocations(locations.length ? locations : addresses);
  }, [locations, addresses]);

  const handleSuggestion = useCallback((item: any) => {
    const lat = parseFloat(item.lat),
      lng = parseFloat(item.lon);
    setCurrent({ name: item.display_name, coords: { lat, lng } });
    setQuery(item.display_name);
    setSuggestions([]);
    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(16);
    setActiveInfoWindow('current');
  }, []);

  const handleDoubleClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat(),
        lng = event.latLng.lng();
      setCandidate({
        coords: { lat, lng },
        label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
      setOpenAdd(true);
      setActiveInfoWindow('current');
    }
  }, []);

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      addToast({ message: 'تم نسخ الإحداثيات', type: 'success' });
    },
    [addToast]
  );

  const handleSaveCurrentLocation = useCallback(async () => {
    if (!current) return;
    const alreadySaved = addresses.some(
      (addr) =>
        +addr.map_location.lat === current.coords.lat &&
        +addr.map_location.lng === current.coords.lng
    );

    if (alreadySaved) {
      addToast({ message: 'تم حفظ هذا الموقع مسبقًا', type: 'info' });
      return;
    }

    try {
      await addNewAddress({
        name: 'موقعي الحالي',
        map_location: {
          lat: String(current.coords.lat),
          lng: String(current.coords.lng),
          address_name: current.name,
        },
        notes: '',
      });
      addToast({
        message: 'تم حفظ موقعك الحالي بنجاح',
        type: 'success',
      });
      setActiveInfoWindow(null);
      fetchAddresses()
    } catch {
      addToast({ message: 'فشل حفظ الموقع', type: 'error' });
    }
  }, [addNewAddress, addToast, addresses, current]);

  const handleAddressSelect = useCallback(
    (id: string) => {
      setActiveInfoWindow(null);
      if (onSelect) {
        onSelect(id);
        addToast({
          message:
            mapDialogType === 'boarding'
              ? 'تم تحديد نقطة الركوب'
              : 'تم تحديد نقطة العودة',
          type: 'success',
        });
      }
    },
    [addToast, mapDialogType, onSelect]
  );

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
        notes: '',
      });
      addToast({
        message: `تم إضافة العنوان "${newLabel}" بنجاح`,
        type: 'success',
      });
      setOpenAdd(false);
      setNewLabel('');
      setCandidate(null);
      setActiveInfoWindow(null);
    } catch {
      addToast({ message: 'فشل إضافة العنوان', type: 'error' });
    }
  }, [addNewAddress, addToast, candidate, newLabel]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&countrycodes=eg&bounded=1`,
          { signal: ctrl.signal }
        );

        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        const data = await res.json();
        setSuggestions(data);
        if (data.length > 0) {
          setCurrent({
            name: data[0].display_name,
            coords: {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            },
          });
        }
      } catch (error) {
        console.error('Search error:', error);
        addToast({
          message: 'فشل في البحث عن المواقع',
          type: 'error',
        });
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query, addToast]);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      addToast({
        message: 'متصفحك لا يدعم خدمة الموقع الجغرافي',
        type: 'error',
      });
      return;
    }

    addToast({
      message: 'جاري تحديد موقعك الحالي...',
      type: 'info',
    });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrent({
          name: 'موقعي الحالي',
          coords: { lat: coords.latitude, lng: coords.longitude },
        });
        setActiveInfoWindow('current');
        mapRef.current?.panTo({ lat: coords.latitude, lng: coords.longitude });
        mapRef.current?.setZoom(16);
        addToast({
          message: 'تم تحديد موقعك بنجاح',
          type: 'success',
        });
      },
      (error) => {
        let message = 'فشل جلب الموقع';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'تم رفض إذن الوصول للموقع';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'معلومات الموقع غير متوفرة';
            break;
          case error.TIMEOUT:
            message = 'انتهى الوقت المحدد لطلب الموقع';
            break;
        }
        addToast({
          message,
          type: 'error',
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [addToast]);

  if (loadError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className={styles.errorHeading}>خطأ في تحميل الخريطة</h3>
        <p className={styles.errorText}>
          تعذر تحميل خدمة خرائط جوجل. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
        </p>
        <p className={styles.errorDetail}>التفاصيل الفنية: {loadError.message}</p>
        <Button
          variant="contained"
          color="error"
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className="text-center">
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <Fab
        onClick={locateMe}
        size="medium"
        className={styles.locateButton}
        aria-label="تحديد الموقع الحالي"
      >
        <GpsFixed className="text-blue-600" />
      </Fab>

      <div className={styles.searchContainer}>
        <div className="relative">
          <TextField
            fullWidth
            size="small"
            className={styles.searchInput}
            placeholder="ابحث عن موقع..."
            value={query || ''}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && suggestions.length > 0) {
                handleSuggestion(suggestions[0]);
                e.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: <AddLocation className="text-gray-400" />,
              className: 'pr-9',
            }}
          />
          {query && (
            <button
              className={styles.searchClearButton}
              onClick={() => setQuery('')}
            >
              <Cancel fontSize="small" />
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <div className={styles.suggestionsContainer}>
            {suggestions.map((s, i) => (
              <div
                key={i}
                className={styles.suggestionItem}
                onClick={() => handleSuggestion(s)}
              >
                <div className="flex items-start">
                  <Place className="mt-0.5 text-blue-500" fontSize="small" />
                  <div className={styles.suggestionContent}>
                    <div className="font-medium text-gray-800">{s.display_name.split(',')[0]}</div>
                    <div className="text-xs text-gray-500 truncate">{s.display_name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={current?.coords || centerEgypt}
        zoom={current ? 16 : defaultZoom}
        onLoad={(map) => {
          mapRef.current = map;
          try {
            const bounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(22.0, 24.7),
              new google.maps.LatLng(31.7, 36.9)
            );
            map.fitBounds(bounds);
          } catch (error) {
            console.error('Map bounds error:', error);
            addToast({
              message: 'حدث خطأ في ضبط حدود الخريطة',
              type: 'error',
            });
          }
        }}
        onDblClick={handleDoubleClick}
        options={{
          disableDefaultUI: true,
          disableDoubleClickZoom: true,
          gestureHandling: 'greedy',
          styles: mapStyles,
        }}
      >
        {current && (
          <MemoizedMarker
            position={current.coords}
            icon={{
              url: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
              scaledSize: new google.maps.Size(48, 48),
            }}
            onClick={() => setActiveInfoWindow('current')}
            zIndex={1000}
          >
            {activeInfoWindow === 'current' && (
              <MemoizedInfoWindow
                onCloseClick={() => setActiveInfoWindow(null)}
                options={{ maxWidth: 320 }}
              >
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 text-lg">{current.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-1">الإحداثيات:</span>
                    {current.coords.lat.toFixed(6)}, {current.coords.lng.toFixed(6)}
                    <button
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `${current.coords.lat.toFixed(6)}, ${current.coords.lng.toFixed(6)}`
                        );
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </button>
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={handleSaveCurrentLocation}
                    startIcon={<Save />}
                    className={styles.currentLocationButton}
                  >
                    حفظ هذا الموقع
                  </Button>
                </div>
              </MemoizedInfoWindow>
            )}
          </MemoizedMarker>
        )}

        {effectiveLocations.map((loc) => {
          const pos = {
            lat: +loc.map_location.lat,
            lng: +loc.map_location.lng,
          };

          const isBoarding = String(loc.id) === boardingAddressId;
          const isSelected = String(loc.id) === selectedId;
          const isReturn = String(loc.id) === addressesReturn?.id;

          const getMarkerIcon = () => {
            if (isReturn) {
              return {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#10B981"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
                )}`,
                scaledSize: new google.maps.Size(48, 48),
                anchor: new google.maps.Point(24, 48),
              };
            }
            if (isBoarding) {
              return {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#3B82F6"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
                )}`,
                scaledSize: new google.maps.Size(48, 48),
                anchor: new google.maps.Point(24, 48),
              };
            }
            if (isSelected) {
              return {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#F59E0B"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
                )}`,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40),
              };
            }
            return {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#EF4444"><path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/></svg>'
              )}`,
              scaledSize: new google.maps.Size(36, 36),
              anchor: new google.maps.Point(18, 36),
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
              zIndex={10000}
            >
              {activeInfoWindow === `address-${loc.id}` && (
                <MemoizedInfoWindow
                  onCloseClick={() => setActiveInfoWindow(null)}
                  options={{ maxWidth: 320, minWidth: 280 }}
                >
                  <div className={styles.addressInfoContainer}>
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full mt-1 ${
                          isBoarding
                            ? 'bg-green-500'
                            : isReturn
                            ? 'bg-blue-500'
                            : isSelected
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-800">{loc.name}</h3>
                          {isBoarding && (
                            <span className={styles.addressBadge('green')}>
                              نقطة الركوب
                            </span>
                          )}
                          {isReturn && (
                            <span className={styles.addressBadge('blue')}>
                              نقطة العودة
                            </span>
                          )}
                          {isSelected && !isBoarding && !isReturn && (
                            <span className={styles.addressBadge('yellow')}>
                              محددة
                            </span>
                          )}
                        </div>

                        <div className={styles.addressDetails}>
                          <div className="flex items-start">
                            <Place className="flex-shrink-0 mt-0.5 text-gray-400" fontSize="small" />
                            <div className="mr-2">
                              <p className="text-sm font-medium text-gray-700 break-words">
                                {loc.map_location.address_name}
                              </p>
                              {loc.map_location.address_name && (
                                <p className="text-xs text-gray-500 mt-1">
                                  <span className="font-medium">معلم:</span>{' '}
                                  {loc.map_location.address_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {loc.notes && (
                          <div className={styles.addressNotes}>
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

                    <div className={styles.coordinatesContainer}>
                      <span className="text-xs text-gray-500">
                        {pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}
                      </span>
                      <button
                        className={styles.copyButton}
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
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40),
            }}
          >
            {activeInfoWindow === 'candidate' && (
              <MemoizedInfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
                <div className="space-y-3">
                  <h3 className="font-bold text-purple-700 text-lg">إضافة موقع جديد</h3>
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
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setOpenAdd(true)}
                    startIcon={<AddLocation />}
                    className={styles.candidateButton}
                  >
                    إضافة هذا الموقع
                  </Button>
                </div>
              </MemoizedInfoWindow>
            )}
          </MemoizedMarker>
        )}
      </GoogleMap>

      <Dialog
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setCandidate(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={styles.dialogTitle}>
          {mapDialogType === 'boarding' ? '➕ إضافة عنوان الركوب' : '➕ إضافة عنوان العودة'}
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <div className={styles.locationPreview}>
            <div className="flex items-center text-sm text-gray-600">
              <Place fontSize="small" className="text-blue-500 mr-2" />
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
            className="rounded-lg"
          />
        </DialogContent>
        <DialogActions className="px-4 pb-4">
          <Button
            onClick={() => {
              setOpenAdd(false);
              setCandidate(null);
            }}
            startIcon={<Cancel />}
            variant="outlined"
            className={styles.cancelButton}
          >
            إلغاء
          </Button>
          <Button
            onClick={saveAddress}
            startIcon={<Save />}
            variant="contained"
            color="primary"
            disabled={!newLabel.trim()}
            className={styles.saveButton}
          >
            حفظ العنوان
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}