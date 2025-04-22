import { useEffect, useState } from 'react';

const useFilteredSeats = (seatsSelected: any[], allSeats: any[]) => {
  const [filteredSeats, setFilteredSeats] = useState<any[]>([]);

  useEffect(() => {
    const updatedSeats = seatsSelected.filter((s) => {
      const seat = allSeats?.find((seat) => `${seat.seat_no}` === s.seat_no);
      return seat?.class !== 'booked';
    });

    setFilteredSeats(updatedSeats);
  }, [seatsSelected, allSeats]);

  return filteredSeats;
};

export default useFilteredSeats;
