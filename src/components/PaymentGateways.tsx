import React from 'react';
import images from '../assets';

const paymentGateways = [
  { name: 'Fawry', logo: images.fawry },
  { name: 'Vodafone Cash', logo: images.vodafonecash },
  { name: 'EtisalatCash', logo: images.etisalat },
  { name: 'Aman', logo: images.aman },
  { name: 'mastercard', logo: images.mastercard },
  { name: 'InstaPay', logo: images.instapay },
  { name: 'visa', logo: images.visa },
  { name: 'halan', logo: images.halan },
];

const PaymentGateways: React.FC = () => {
  return (
    <div className="w-full bg-white py-8 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
        {paymentGateways.map((gateway, index) => (
          <React.Fragment key={gateway.name}>
            <div className="flex-shrink-0 h-12 max-sm:h-10 s w-auto">
              <img
                src={gateway.logo}
                alt={gateway.name}
                className="h-full w-auto object-contain"
              />
            </div>
            {index !== paymentGateways.length - 1 && (
              <div className="hidden sm:block h-8 sm:h-10 md:h-12 border-r-2 border-black/30" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PaymentGateways;