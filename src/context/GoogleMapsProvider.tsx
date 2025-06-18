import React, { createContext, useContext } from 'react';
import { useJsApiLoader, LoadScriptProps } from '@react-google-maps/api';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | null;
  loaderConfig: LoadScriptProps;
}

const loaderConfig: LoadScriptProps = {
  id: 'script-loader',
  googleMapsApiKey: 'AIzaSyCDPdRtF8MT2mJBMA_YyYiDPpTeaoYpzUI',
  libraries: ['maps', 'geometry', 'places'],
  version: 'weekly',
  language: 'en',
  region: 'US',
  authReferrerPolicy: 'origin',
};

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
  loaderConfig,
});

export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader(loaderConfig);

  return (
    <GoogleMapsContext.Provider
      value={{
        isLoaded,
        loadError: loadError ?? null,
        loaderConfig,
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
