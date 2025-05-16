import { FC, useRef } from 'react';
import { Trip } from '../../types/types';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TripCard } from './TripCard';

interface PreviewSliderProps {
  trips: Trip[];
  loading: boolean;
}

const PreviewSlider: FC<PreviewSliderProps> = ({ trips, loading }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <h3 className="sr-only">{t('previewSlider.title')}</h3>
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <span className="text-gray-500">{t('loading')}</span>
        </div>
      ) : (
        <div className="flex items-center">
          <button
            onClick={() => scroll(-300)}
            aria-label={t('previewSlider.prev')}
            className="p-2 m-1 bg-white rounded-full shadow hover:bg-gray-100"
          >
            <ChevronLeftIcon />
          </button>
          <div
            ref={containerRef}
            className="flex space-x-4 overflow-x-auto no-scrollbar px-2 py-4"
          >
            {trips.map((trip) => (
              <div key={trip.id} className="flex-shrink-0 w-60">
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll(300)}
            aria-label={t('previewSlider.next')}
            className="p-2 m-1 bg-white rounded-full shadow hover:bg-gray-100"
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default PreviewSlider;
