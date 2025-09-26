import React from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import HeroSection from './HeroSection';
import './BusownerHome.css';

const BusownerHome = ({ onLogout }) => {
  return (
    <div className="busowner-home">
      <Navbar onLogout={onLogout} />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default BusownerHome;
