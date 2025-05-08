// File: src/pages/TrainSearchResultsContainer.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TrainSearchResults from './TrainSearchResults';
import TrainFilterComponent from './TrainFilterComponent';

const TrainSearchResultsContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="space-y-6">
          <TrainFilterComponent />
          <TrainSearchResults navigate={navigate} locationKey={location.key} />
    </div>
  );
};

export default TrainSearchResultsContainer;
