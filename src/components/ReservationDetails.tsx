import React from 'react';

interface ReservationDetailsProps {
  reservationData: any;
  isLoadingPayment: boolean;
  paymentUrl: string | null;
  fetchPaymentLink: (id: string) => void;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservationData, isLoadingPayment, paymentUrl, fetchPaymentLink }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold">Reservation Details</h2>
      <p><strong>Order Number:</strong> {reservationData.number}</p>
      <p><strong>Company Name:</strong> {reservationData.company_data.name}</p>
      <p><strong>From:</strong> {reservationData.station_from.name}</p>
      <p><strong>To:</strong> {reservationData.station_to.name}</p>
      <p><strong>Date:</strong> {reservationData.date}</p>
      <p><strong>Total Price:</strong> {reservationData.total}</p>

      <div>
        <h3 className="text-lg font-semibold">Payment</h3>
        {isLoadingPayment ? (
          <button className="mt-4 px-6 py-2 rounded-lg bg-gray-600 text-white">
            Loading Payment Link...
          </button>
        ) : paymentUrl ? (
          <a href={paymentUrl} className="mt-4 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" target="_blank" rel="noopener noreferrer">
            Pay Now
          </a>
        ) : (
          <button onClick={() => fetchPaymentLink(reservationData.id)} className="mt-4 px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            Retry Payment Link
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationDetails;
