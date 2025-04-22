import React from "react";
import Header from "./Header";

interface ReservationLayoutProps {
  children: React.ReactNode;
}

const ReservationLayout: React.FC<ReservationLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen gap-7">
      <Header />
      <main className="flex-1 p-4">{children}</main>
      
    </div>
  );
};

export default ReservationLayout;
