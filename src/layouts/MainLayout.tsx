import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <>
    <Navbar />
    <main className="container mx-auto p-4">{children}</main>
    <Footer />
  </>
);

export default MainLayout;
