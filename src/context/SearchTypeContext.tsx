// SearchTypeContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';

// Define the search types as a union type directly in this file
export type SearchType = 'bus' | 'private' | 'train';

// Define the context shape with TypeScript
interface SearchTypeContextProps {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  isTrainSearch: boolean;
  isBusSearch: boolean;
  isPrivateSearch: boolean;
}

// Create context with explicit type and undefined for default value
const SearchTypeContext = createContext<SearchTypeContextProps | undefined>(undefined);

// Create provider component
export const SearchTypeProvider: React.FC<{ 
  children: React.ReactNode;
  defaultType?: SearchType; // Optional default type
}> = ({ children, defaultType = 'bus' }) => {
  const [searchType, setSearchType] = useState<SearchType>(defaultType);

  // Derived state for convenience
  const isTrainSearch = searchType === 'train';
  const isBusSearch = searchType === 'bus';
  const isPrivateSearch = searchType === 'private';

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    searchType,
    setSearchType,
    isTrainSearch,
    isBusSearch,
    isPrivateSearch,
  }), [searchType]);

  return (
    <SearchTypeContext.Provider value={contextValue}>
      {children}
    </SearchTypeContext.Provider>
  );
};

// Custom hook for consuming the context
export const useSearchType = (): SearchTypeContextProps => {
  const context = useContext(SearchTypeContext);
  if (!context) {
    throw new Error('useSearchType must be used within a SearchTypeProvider');
  }
  return context;
};

// Optional: Helper hook for train-specific logic
export const useTrainSearch = () => {
  const { isTrainSearch } = useSearchType();
  return { isTrainSearch };
};