'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import Homepage from '../components/Homepage';
import Footer from '../components/Footer';

const BuilderWebsite = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Homepage />
      <Footer />
    </div>
  );
};

export default BuilderWebsite;