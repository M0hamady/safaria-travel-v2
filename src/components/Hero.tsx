import React from 'react';
import images from '../assets';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[65vh] xl:h-[65vh] lg:h-[75vh]    w-full overflow-hidden">
      {/* Background Image for Desktop */}
      <div className="hidden md:block absolute inset-0">
        <img
          src={images.safariabus}
          alt="Bus Horizontal"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Background Image for Mobile */}
      <div className="md:hidden absolute inset-0">
        <img
          src={images.bus_horizontal}
          alt="Safariabus"
          className="w-full h-full object-cover object-center"
        />
      </div>

     
    </section>
  );
};

export default Hero;