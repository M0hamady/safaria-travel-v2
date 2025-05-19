// SearchTypeContext.tsx
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export type SearchType = 'bus' | 'private' | 'train';

const SEARCH_TYPE_KEY = 'searchType';

interface SearchTypeContextProps {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  isTrainSearch: boolean;
  isBusSearch: boolean;
  isPrivateSearch: boolean;
}

const SearchTypeContext = createContext<SearchTypeContextProps | undefined>(undefined);

// Helper function to safely get from localStorage
const getSavedSearchType = (): SearchType | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(SEARCH_TYPE_KEY);
    return saved as SearchType;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const SearchTypeProvider: React.FC<{ 
  children: React.ReactNode;
  defaultType?: SearchType;
}> = ({ children, defaultType = 'bus' }) => {
  // Initialize state with function to read from localStorage only once
  const [searchType, setSearchType] = useState<SearchType>(() => {
    const savedType = getSavedSearchType();
    return savedType || defaultType;
  });

  // Save to localStorage whenever searchType changes
  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_TYPE_KEY, searchType);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [searchType]);

  // Derived state
  const isTrainSearch = searchType === 'train';
  const isBusSearch = searchType === 'bus';
  const isPrivateSearch = searchType === 'private';

  // Memoize context value
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

export const useSearchType = (): SearchTypeContextProps => {
  const context = useContext(SearchTypeContext);
  if (!context) {
    throw new Error('useSearchType must be used within a SearchTypeProvider');
  }
  return context;
};

export const useTrainSearch = () => {
  const { isTrainSearch } = useSearchType();
  return { isTrainSearch };
};