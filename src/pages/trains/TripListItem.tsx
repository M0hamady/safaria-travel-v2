import React from 'react';
import { Trip } from '../../types/trainTypes';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import translation hook
import images from '../../assets';

interface Props {
  trip: Trip;
  onSelect: (id: string) => void;
  getMinPrice: (trip: Trip) => number;
}

const TripListItem: React.FC<Props> = ({ trip, onSelect, getMinPrice }) => {
  const { t } = useTranslation(); // Use translations

  return (
    <li className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-2 md:gap-6 items-center">
        
        {/* Train Image */}
        <img src={images.trainSafaria} alt={trip.train.name} className="w-16 md:w-20 h-16 md:h-20 object-cover rounded-md mx-auto md:mx-0" />

        {/* Train & Trip Details */}
        <div className="grid grid-cols-1 gap-4 text-center md:text-left w-full">
          <h3 className="font-semibold text-lg md:col-span-3">{t("train_number")}: {trip.train.name}</h3>

          <div className="flex gap-4 items-center text-center w-full">
            {/* Departure Details */}
            <div>
              <p className="text-gray-500 text-sm">{t("departure")}</p>
              <p className="font-medium">{new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-sm">{trip.station_from.name}</p>
            </div>

            {/* Railway Track & Duration */}
            <div className="text-center">
              <img src={images.railWay} alt={t("railway_track")} className="w-full h-4 object-cover rounded-md" />
              <p className="mt-1">{trip.duration} {t("duration")}</p>
            </div>

            {/* Arrival Details */}
            <div>
              <p className="text-gray-500 text-sm">{t("arrival")}</p>
              <p className="font-medium">{new Date(trip.finish_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-sm">{trip.station_to.name}</p>
            </div>
          </div>
        </div>

        {/* Pricing & Navigation Button */}
        <div className="flex justify-between items-center mt-4 w-full col-span-3">
          <div className="text-left">
            <p className="text-gray-500 text-sm">{t("starting_price")}</p>
            <p className="text-2xl font-bold text-blue-600">{getMinPrice(trip)} {t("price_unit")}</p>
            <p className="text-sm text-gray-500 mt-1">{trip.train.classes.length} {t("class_options")}</p>
          </div>

          {/* Navigation Button */}
          <Link 
            to={`/train-search/trip/${trip.id}`} 
            className="bg-primary text-white px-4 py-2 rounded shadow-md font-bold hover:bg-dark transition duration-300"
          >
            {t("view_trip")}
          </Link>
        </div>
      </div>
    </li>
  );
};

export default TripListItem;
