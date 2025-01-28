"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Ruler } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check initial screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkMobile();

    // Add event listener to check on resize
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(6);

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setFeaturedProperties(data);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current && featuredProperties.length > 0) {
        const carouselItems = carouselRef.current.children;
        const itemWidth = carouselItems[0].getBoundingClientRect().width;
        const gap = 16; // Space between items (space-x-4 in Tailwind is typically 1rem or 16px)

        // Determine scroll amount based on screen size
        const scrollAmount = isMobile 
          ? itemWidth + gap 
          : (itemWidth + gap);

        carouselRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }, 5000); // Move every 5 seconds

    return () => clearInterval(interval);
  }, [isMobile, featuredProperties]);

  // Create an infinite carousel by duplicating properties
  const infiniteProperties = [
    ...featuredProperties,
    ...featuredProperties,
    ...featuredProperties
  ];

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
      className={`max-w-7xl mx-auto py-12`}
    >
      <div className="text-center mb-16">
        <motion.h2 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-roboto font-bold mb-4 text-gray-800 tracking-tight"
        >
          Ready to Move In Properties
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-merriweather"
        >
          Meticulously curated properties that redefine modern living
        </motion.p>
      </div>

      <div 
        ref={carouselRef} 
        className="flex overflow-x-auto space-x-4 no-scrollbar px-6"
      >
        {infiniteProperties.map((property, index) => (
          <motion.div 
            key={`${property.id}-${index}`}
            className="min-w-full md:min-w-[500px] w-full md:w-[500px] overflow-hidden border-2 border-black-100 transform transition-all duration-300 flex-shrink-0"
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
            <div className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-montserrat font-bold text-gray-800 mb-2">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="mr-2 w-5 h-5 text-btn-800" />
                <span className="text-sm">{property.location}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                {property.beds && (
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <Bed className="mx-auto mb-1 w-5 h-5 text-btn-800" />
                    <span className="text-xs font-medium">{property.beds} BHK</span>
                  </div>
                )}
                {property.baths && (
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <Bath className="mx-auto mb-1 w-5 h-5 text-btn-800" />
                    <span className="text-xs font-medium">{property.baths} Baths</span>
                  </div>
                )}
                <div className="bg-gray-50 p-2 rounded-xl">
                  <Ruler className="mx-auto mb-1 w-5 h-5 text-btn-800" />
                  <span className="text-xs font-medium">{property.area}</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-btn-800 text-white py-2 rounded-full font-semibold transition-all duration-300"
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