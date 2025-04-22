// SearchTypeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { SearchType } from '../types/types';


interface SearchTypeContextProps {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
}

const SearchTypeContext = createContext<SearchTypeContextProps | undefined>(undefined);

export const SearchTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchType, setSearchType] = useState<SearchType>('bus'); // default to bus

  return (
    <SearchTypeContext.Provider value={{ searchType, setSearchType }}>
      {children}
    </SearchTypeContext.Provider>
  );
};

export const useSearchType = () => {
  const context = useContext(SearchTypeContext);
  if (!context) {
    throw new Error('useSearchType must be used within a SearchTypeProvider');
  }
  return context;
};
