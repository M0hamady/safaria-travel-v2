import React from 'react';
import { TrainsContext } from '../../context/TrainsContext';
import { Trip } from '../../types/trainTypes';
import TripList from './TripList';

interface Props {
  navigate: (path: string) => void;
  locationKey: string;
}

class TrainSearchResults extends React.Component<Props> {
  static contextType = TrainsContext;
  context!: React.ContextType<typeof TrainsContext>;

  componentDidMount() {
    this.fetchIfReady();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.locationKey !== this.props.locationKey) {
      this.fetchIfReady();
    }
  }

  fetchIfReady() {
    const { filters, searchTrips } = this.context;
    if (filters.from_station_id && filters.to_station_id && filters.date) {
      searchTrips();
    }
  }

  getMinPrice(trip: Trip): number {
    return Math.min(...trip.train.classes.map(cls => cls.cost));
  }

  filterTrips(trips: Trip[]): Trip[] {
    const { filters } = this.context;

    return trips.filter((trip) => {
      const minPrice = this.getMinPrice(trip);

      const matchesStart =
        filters.start_time ? trip.start_time >= filters.start_time : true;

      const matchesFinish =
        filters.finish_time ? trip.finish_time <= filters.finish_time : true;

      const matchesPrice = filters.priceRange
        ? minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]
        : true;

      return matchesStart && matchesFinish && matchesPrice;
    });
  }

  render() {
    const { trips, loading, error } = this.context;
    const { navigate } = this.props;

    if (loading) {
      return <div className="p-4 text-center">Loading available trips...</div>;
    }

    if (error) {
      return <div className="p-4 text-red-500">{error}</div>;
    }

    const filteredTrips = this.filterTrips(trips);

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available Trips</h2>
          <div className="text-sm text-gray-600">
            {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} found
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">No trips found for your search criteria.</p>
            <p className="text-gray-600">Try adjusting your search filters.</p>
          </div>
        ) : (
          <TripList
            trips={filteredTrips}
            onSelect={(id) => navigate(`/train-search/trip/${id}`)}
            getMinPrice={(trip) => this.getMinPrice(trip)}
          />
        )}
      </div>
    );
  }
}

export default TrainSearchResults;
