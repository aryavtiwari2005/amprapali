// PropertiesPage.js
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Star
} from 'lucide-react';
import { Inter, Playfair, Roboto } from 'next/font/google';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import PropertyModal from '@/components/PropertyModal'; // Import the modal component

// Font configurations
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300', '400', '600', '700'] });
const playfair = Playfair({ subsets: ['latin'], variable: '--font-playfair', weight: ['400', '700'] });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto', weight: ['400', '500', '700'] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null); // State for the selected property

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*');

        if (error) {
          throw error;
        }

        setProperties(data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (property) => {
    setSelectedProperty(property); // Set the selected property
  };

  const handleCloseModal = () => {
    setSelectedProperty(null); // Close the modal
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`
        min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
        ${inter.variable} ${roboto.variable}
        ${playfair.variable}
        font-sans
      `}
    >
      <Navbar />
      <div className="max-w-7xl mx-auto py-24">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <AnimatePresence>
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  onClick={() => handlePropertyClick(property)} // Handle property click
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)" 
                  }}
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden relative cursor-pointer"
                >
                  <div className="relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]} // Safely access the first image
                        alt={property.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h- 64 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-600">No image available</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 font-roboto">
                      {property.title}
                    </h2>
                    <p className="text-gray-600 mb-4 flex items-center font-roboto">
                      <MapPin className="w-5 h-5 text-orange-500 mr-2" />
                      {property.location}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                      {[
                        { icon: Bed, value: property.beds, label: 'BHK' },
                        { icon: Ruler, value: property.area, label: 'Area' }
                      ].map((item, index) => (
                        <div key={index} className="bg-orange-50 p-3 rounded-lg">
                          <item.icon className="w-6 h-6 text-orange-500 mx-auto" />
                          <p className="text-sm text-gray-700 mt-1">
                            {item.value} {item.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-800 font-roboto">
                        {property.price.toLocaleString()}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-5 h-5" />
                        <span className="ml-1 font-semibold">{property.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal 
            property={selectedProperty} 
            onClose={handleCloseModal} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PropertiesPage;