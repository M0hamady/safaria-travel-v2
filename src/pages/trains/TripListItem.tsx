import React, { useContext } from 'react';
import { Trip } from '../../types/trainTypes';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import images from '../../assets';
import { TrainsContext } from '../../context/TrainsContext';
import DateTimeDisplay from '../../components/utilies/DateTimeDisplay';
import i18next from 'i18next';

interface Props {
  trip: Trip;
  onSelect: (id: string) => void;
  getMinPrice: (trip: Trip) => number;
}

const TripListItem: React.FC<Props> = ({ trip, onSelect, getMinPrice }) => {
  const { t } = useTranslation();

  const {
    selectedDepartureLocation,
    selectedArrivalLocation,
    setSelectedClass,
    setSelectedTrip,
  } = useContext(TrainsContext);

  const handleClassSelect = (trainClass: any) => {
    setSelectedClass(trainClass);
    setSelectedTrip(trip);
    onSelect(`${trip.id}`);
  };
  const currentLanguage = i18next.language;
  const isRTL = currentLanguage === "ar";
  return (
    <li className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="grid grid-cols-2 md:grid-cols-[auto,1fr] gap-4 items-center w-full">
        
        {/* Train Image */}
        <img
          src={images.trainSafaria}
          alt={trip.train.name}
          className="w-16 md:w-20 h-16 md:h-20 object-cover rounded-md mx-auto md:mx-0"
        />

        {/* Train & Trip Details */}
        <div className="grid grid-cols-1 gap-4 text-center md:text-left w-full rtl:text-right">
          <h3 className="font-semibold text-lg max-sm:ltr:text-left">{t("train_number")}: {trip.train.name}</h3>

          <div className="flex justify-between flex-wrap gap-4 items-center">
            {/* Departure Info */}
            <div className="text-left rtl:text-right">
            <p className="text-gray-500 text-sm">{t("departure")}</p>
              <p className="text-lg font-bold">{selectedDepartureLocation?.name}</p>
              <p className="text-sm">{trip.station_from.name}</p>
              <p className="font-medium"><DateTimeDisplay value={trip.start_time}  /></p>
            </div>

            {/* Railway Visual */}
            <div className="flex flex-col items-center justify-center">
              <img src={images.railWay} alt={t("railway_track")} className="w-28 h-4 object-cover" />
              <p className="mt-1 text-sm">{trip.distance} {t("km")}</p>
            </div>

            {/* Arrival Info */}
            <div className="text-left rtl:text-right">
              <p className="text-gray-500 text-sm">{t("arrival")}</p>
              <p className="text-lg font-bold">{selectedArrivalLocation?.name}</p>
              <p className="text-sm">{trip.station_to.name}</p>
              <p className="font-medium"><DateTimeDisplay value={trip.finish_time} type="date" /></p>
            </div>
          </div>
        </div>

        {/* Pricing & Class Selection */}
        <div className="mt-6 w-full grid grid-cols-1   col-span-4  ">

          {trip.train.classes.map((trainClass) => (
            <div key={trainClass.id} className="flex justify-between p-3 border rounded-md mt-2 w-full">
              <div>
                <p className="text-primary text-md font-bold">{t("price_unit")}: {trainClass.cost} EGP</p>
                <h4 className="text-lg font-bold">{isRTL ? trainClass.arDesc : trainClass.enDesc}</h4>
                <p className="text-sm">{t("available_seats")}: {trainClass.availableSeatsCount}</p>
              </div>

              <Link
                to={`/train-search/trip/${trip.id}`}
                className="bg-primary h-fit my-auto text-white px-4 py-2 rounded shadow-md font-bold hover:bg-dark transition duration-300"
                onClick={() => {
                  handleClassSelect(trainClass)
                }}
              >
                {t("busSearchTrips.select")}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
};

export default TripListItem;
