import React, { useContext } from 'react';
import { Trip } from '../../types/trainTypes';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import images from '../../assets';
import { TrainsContext } from '../../context/TrainsContext';
import DateTimeDisplay from '../../components/utilies/DateTimeDisplay';
import i18next from 'i18next';
import { AltRoute, PinDrop } from '@mui/icons-material';

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
          <div className='flex w-full justify-between  max-sm:flex-col'>

          <h3 className="font-semibold text-lg max-sm:ltr:text-left  flex md:gap-3 max-sm:justify-between max-sm:w-full"><span className='w-full text-[0.85rem] flex ' > {t("train_number")}: </span> <span className='w-fit text-[1.0rem]' > {trip.train.name}</span> </h3>
          {/* we will add container has routes of trip each route has id and name while hover preview list in drobdown miu=nue  */}
          <div className="relative group">
            <h3 className="font-semibold text-lg max-sm:ltr:text-left  px-2  ltr:max-sm:pl-0 ltr:max-sm:pr-5 rtl:max-sm:pr-0 rtl:max-sm:pl-5  py-2 rounded text-primary underline flex">
              <span className='min-w-full'>{t("train_route")}  </span><span> <AltRoute/> </span>
            </h3>

            {/* Dropdown on hover */}
            <div className="absolute ltr:max-sm:-left-[4.5rem] rtl:max-sm:-right-[4.5rem]  top-6 z-10 hidden group-hover:block bg-white  shadow-md border rounded-md mt-2 w-64 text-sm text-left rtl:text-right">
              <ul className="p-2 max-h-60 overflow-y-auto">
                {trip.route && trip.route.length > 0 ? (
                  trip.route.map((route) => (
                    <li
                      key={route.id}
                      className="py-1 px-2 hover:bg-gray-100  transition flex border-b-2 "
                    >
                       <span> <PinDrop /> </span> {route.name}
                    </li>
                  ))
                ) : (
                  <li className="py-1 px-2 text-gray-500">{t("no_routes")}</li>
                )}
              </ul>
            </div>
          </div>
          </div>

          <div className="flex justify-between flex-wrap gap-4 items-center">
            {/* Departure Info */}
            <div className="text-left rtl:text-right">
              <p className="text-gray-500 text-sm">{t("departure")}</p>
              <p className="text-lg font-bold">{selectedDepartureLocation?.name}</p>
              <p className="text-sm">{trip.station_from.name}</p>
              <p className="font-medium"><DateTimeDisplay value={trip.start_time} /></p>
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
            <div key={trainClass.id} className="flex justify-between p-3 px-8 border rounded-md mt-2 w-full">
              <div>
                <h4 className="text-md font-bold">{isRTL ? trainClass.arDesc : trainClass.enDesc}</h4>
                <p className="text-primary text-lg font-extrabold">{t("price_unit")}: {trainClass.cost} </p>
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
