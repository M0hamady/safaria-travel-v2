import { FC, useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { usePrivateSearchContext } from '../../context/PrivateSearchContext';
import { Trip } from '../../types/types';

interface PrivateTripDetailsPageDataProps {}

export const PrivateTripDetailsPageData: FC<PrivateTripDetailsPageDataProps> = () => {
  const { t } = useTranslation();
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    searchValues,
    setSearchValues,
    handleSearch,
    loading,
    trips: results,
  } = usePrivateSearchContext();

  // Shared-trip fallback state
  const [sharedTrip, setSharedTrip] = useState<Trip | null>(null);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    // Check if shared link params present
    if (params.has('company') && params.has('category')) {
      // build minimal Trip object
      const shared: Partial<Trip> = {
        id: Number(tripId),
        company: params.get('company')!,
        category: params.get('category')!,
        date: params.get('date') || '',
        time: params.get('time') || '',
        date_time: `${params.get('date') || ''}T${params.get('time') || ''}`,
        available_seats: Number(params.get('availableSeats') || 0),
        price_start_with: Number(params.get('price') || 0),
        bus: { id: 0, code: '', category: params.get('busCategory') || '', salon: '', type: "" },
        company_logo: undefined,
        company_data: {
          name: params.get('company')!,
          avatar: '',
          bus_image: '',
          pin: '',
        },
        gateway_id: '',
        storyType: undefined,
        cities_from: [],
        cities_to: [],
        stations_from: [],
        stations_to: [],
        pricing: [],
        prices_start_with: { original_price: 0, final_price: 0, offer: '' },
      };
      setSharedTrip(shared as Trip);
    } else {
      // normal search context
      const from = params.get('from') || '';
      const to = params.get('to') || '';
      const departure = params.get('departure') || '';
      const ret = params.get('return') || '';
      setSearchValues({ from, to, departure, return: ret });
      handleSearch();
    }
  }, [location.search]);

  // Determine which trip to show
  const currentTrip: Trip | undefined = useMemo(() => 
    sharedTrip || results.find((t) => t.id === Number(tripId)),
    [sharedTrip, results, tripId]
  );

  useEffect(() => {
    const from = params.get('from') || '';
    const to = params.get('to') || '';
    const departure = params.get('departure') || '';
    const ret = params.get('return') || '';
    setSearchValues({ from, to, departure, return: ret });
    handleSearch();
  }, [currentTrip, loading]);

  if (!currentTrip) {
    return null;
  }

  const renderTripCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {currentTrip.company_logo && (
              <img 
                src={currentTrip.company_logo} 
                alt={currentTrip.company_data.name}
                className="h-12 w-12 object-contain mr-3"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {currentTrip.company_data.name}
              </h2>
              <p className="text-gray-600">{currentTrip.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500">{currentTrip.date}</p>
            <p className="text-gray-500">{currentTrip.time}</p>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-4 my-4">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="font-semibold text-gray-700">
                {currentTrip.cities_from[0]?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {currentTrip.stations_from[0]?.name || ''}
              </p>
            </div>
            <div className="flex-1 px-4">
              <div className="relative">
                <div className="border-t-2 border-dashed border-gray-300 absolute top-1/2 w-full"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-700">
                {currentTrip.cities_to[0]?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {currentTrip.stations_to[0]?.name || ''}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-gray-600">
              {t('availableSeats')}: {currentTrip.available_seats}
            </p>
            <p className="text-gray-600">
              {t('busType')}: {currentTrip.bus.type}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {currentTrip.price_start_with} {t('currency')}
            </p>
            {currentTrip.prices_start_with?.offer && (
              <p className="text-sm text-green-600">
                {currentTrip.prices_start_with.offer}
              </p>
            )}
          </div>
        </div>

        <button
          className="w-full mt-6 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-medium transition duration-200"
          onClick={() => {
            // Handle booking logic
          }}
        >
          {t('bookNow')}
        </button>
      </div>
    </div>
  );

  const renderPreviewSlider = () => {
    if (sharedTrip || !results.length) return null;

    return (
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3 px-2">{t('moreTrips')}</h3>
        <div className="flex overflow-x-auto pb-2 space-x-4">
          {loading ? (
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-64 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            results.map((trip) => (
              <div 
                key={trip.id}
                className={`flex-shrink-0 w-64 p-3 border rounded-lg cursor-pointer transition duration-200 ${trip.id === currentTrip.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800">{trip.company_data.name}</h4>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {trip.price_start_with} {t('currency')}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{trip.date} • {trip.time}</p>
                  <p className="truncate">
                    {trip.cities_from[0]?.name} → {trip.cities_to[0]?.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-gray-50 min-h-screen pt-6 pb-20">
      {/* SEO meta */}
      <Helmet>
        <title>{`${currentTrip.company} - ${currentTrip.category}`} | Safaria</title>
        <meta name="description" content={currentTrip.company_data.name} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Trip',
            name: currentTrip.company,
            offers: {
              '@type': 'Offer',
              price: currentTrip.price_start_with,
              priceCurrency: 'EGP',
              availability:
                currentTrip.available_seats > 0 ? 'InStock' : 'SoldOut',
            },
            provider: { '@type': 'Organization', name: currentTrip.company },
          })}
        </script>
      </Helmet>

      <main className="max-w-4xl mx-auto px-4">
        {loading && <div className="text-center py-10">{t('loading')}</div>}
        {renderTripCard()}
      </main>

      {renderPreviewSlider()}
    </div>
  );
};

export default PrivateTripDetailsPageData;