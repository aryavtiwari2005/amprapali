"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Ruler } from 'lucide-react';
import { Inter, Montserrat, Playfair_Display, Roboto } from 'next/font/google';
import { supabase } from '@/utils/supabaseClient';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto', weight: ['400', '500', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(3);

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setFeaturedProperties(data);
      }
    };

    fetchProperties();
  }, []);

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.section 
      variants={itemVariants}
      className={`max-w-7xl mx-auto py-12 ${inter.variable} ${montserrat.variable} ${playfair.variable} ${roboto.variable}`}
    >
      <div className="text-center mb-16">
        <motion.h2 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-roboto font-bold mb-4 text-gray-800 tracking-tight"
        >
          Featured Properties
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-merriweather"
        >
          Meticulously curated properties that redefine modern living
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 font-montserrat">
        {featuredProperties.map((property) => (
          <motion.div 
            key={property.id}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            className="bg-white overflow-hidden shadow-xl border border-gray-100 transform transition-all duration-300"
          >
            <div className="relative">
              <img 
                src={property.images[0]} 
                alt={property.title} 
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-6 right-6 bg-btn-800 text-white px-4 py-2 rounded-full text-sm font-bold">
                {property.type}
              </div>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-montserrat font-bold text-gray-800 mb-4">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="mr-2 w-6 h-6 text-btn-800" />
                <span className="text-lg">{property.location}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                {property.beds && (
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <Bed className="mx-auto mb-2 w-6 h-6 text-btn-800" />
                    <span className="text-sm font-medium">{property.beds} BHK</span>
                  </div>
                )}
                {property.baths && (
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <Bath className="mx-auto mb-2 w-6 h-6 text-btn-800" />
                    <span className="text-sm font-medium">{property.baths} Baths</span>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-xl">
                  <Ruler className="mx-auto mb-2 w-6 h-6 text-btn-800" />
                  <span className="text-sm font-medium">{property.area}</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-btn-800 text-white py-3 rounded-full font-semibold transition-all duration-300"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 mx-auto block px-12 py-3 md:px-12 md:py-4 bg-btn-800 
          text-white text-lg font-montserrat font-semibold shadow-2xl 
          hover:shadow-btn-800/50 transition-all duration-300"
        onClick={() => window.location.href = '/properties'}
      >
        View All Properties
      </motion.button>
    </motion.section>
  );
};

export default FeaturedProperties;