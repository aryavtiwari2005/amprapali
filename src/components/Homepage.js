'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Ruler, 
  Construction,
  Star
} from 'lucide-react';
import { Inter, Merriweather, Montserrat, Playfair_Display, Roboto } from 'next/font/google';

// Font configurations
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  weight: ['300', '400', '600', '700']
});

const merriweather = Merriweather({ 
  subsets: ['latin'], 
  variable: '--font-merriweather',
  weight: ['400', '700']
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  weight: ['400', '600', '700']
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  weight: ['400', '700']
});

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto', weight: ['400', '500', '700'] });

const Homepage = () => {
  const [properties, setProperties] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties') // Replace with your actual table name
        .select('*');

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data);
      }
    };

    fetchProperties();
  }, []);

  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Apartment",
      location: "Sector 76, Noida",
      beds: 3,
      baths: 2,
      area: "1800 sq.ft",
      price: "₹1.2 Cr",
      image: "amp-3.webp"
    },
    {
      id: 2,
      title: "Premium Villa",
      location: "Sector 45, Gurgaon",
      beds: 4,
      baths: 3,
      area: "3200 sq.ft",
      price: "₹2.8 Cr",
      image: "amp-5.png"
    },
    {
      id: 3,
      title: "Office Space",
      location: "Connaught Place, Delhi",
      floor: 12,
      area: "5000 sq.ft",
      price: "₹4.5 Cr",
      image: "amp-4.jpg"
    },
    {
      id: 4,
      title: "Penthouse Suite",
      location: "Sector 128, Noida",
      beds: 4,
      baths: 4,
      area: "4200 sq.ft",
      price: "₹3.5 Cr",
      image: "amp-6.jpg"
    }
  ];

  // Auto-slide effect for carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => 
        prev >= Math.ceil(featuredProperties.length / 2) - 1 ? 0 : prev + 1
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const projects = [
    {
      id: 1,
      name: "Amrapali Eden Park",
      location: "Sector 40, Noida",
      image: "amp-eden.jpeg"
    },
    {
      id: 2,
      name: "Amrapali Tech Park",
      location: "Sector 52, Noida",
      image: "amp-tech.jpg"
    }
  ];

  const underDevelopmentProjects = [
    {
      id: 1,
      title: "Amrapali Silicon City",
      description: "Luxury apartments with modern amenities in the heart of Noida. Completion expected by 2026...",
      image: "amp-silicon.webp"
    },
    {
      id: 2,
      title: "Amrapali Leisure Valley",
      description: "Premium villas with world-class facilities in Greater Noida. Ready for possession by 2025...",
      image: "amp-leisure.jpg"
    },
    {
      id: 3,
      title: "Amrapali Dream Valley",
      description: "Contemporary apartments with smart home features. Phase 1 completion by late 2025...",
      image: "amp-dream.webp"
    }
  ];

  // Variants for consistent animations
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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`
        min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
        ${inter.variable} ${merriweather.variable} 
        ${montserrat.variable} ${playfair.variable}
        font-sans
      `}
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut" 
            }}
            src="amp-landing-2.webp" 
            alt="Modern building exterior" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl text-center text-white px-6">
          <motion.h1 
            variants={itemVariants}
            className="
              text-5xl md:text-7xl font-playfair font-bold mb-6 
              leading-tight text-transparent bg-clip-text 
              bg-gradient-to-r from-white to-gray-300
            "
          >
            Elevate Your Living Experience
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="
              text-2xl md:text-2xl mb-12 font-robot font-bold 
              font-light text-gray-200 max-w-2xl mx-auto
            "
          >
            Discover extraordinary spaces where luxury meets innovation, crafted with unparalleled precision
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              px-12 py-4 bg-gradient-to-r from-orange-500 to-red-600 
              text-white rounded-full text-lg font-montserrat 
              font-semibold shadow-2xl hover:shadow-orange-500/50 
              transition-all duration-300
            "
            onClick={() => window.location.href = '/properties'}
          >
            Explore Properties
          </motion.button>
        </div>
      </motion.section>

      {/* Featured Properties Section */}
      <motion.section 
        variants={itemVariants}
        className="max-w-7xl mx-auto py-20 px-6"
      >
        <div className="text-center mb-16">
          <motion.h2 
            variants={itemVariants}
            className="
              text-5xl font-roboto font-bold mb-4 
              text-gray-800 tracking-tight
            "
          >
            Featured Properties
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="
              text-xl text-gray-600 max-w-2xl mx-auto 
              font-merriweather
            "
          >
            Meticulously curated properties that redefine modern living
          </motion.p>
        </div>

    <div className="relative group">
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ 
            duration: 0.5,
            type: "tween"
          }}
          className="grid md:grid-cols-2 gap-10"
        >
          {properties.slice(activeSlide * 2, activeSlide * 2 + 2).map(property => (
            <motion.div 
              key={property.id}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 transform transition-all duration-300"
            >
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-6 right-6 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  {property.price}
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-roboto font-bold text-gray-800">{property.title}</h3>
                  <div className="flex items-center text-yellow-500">
                    <span className="font-bold">4.8</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="mr-3 w-6 h-6 text-orange-500" />
                  <span className="text-lg">{property.location}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                  {property.beds && (
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <Bed className="mx-auto mb-2 w-6 h-6 text-orange-500" />
                      <span className="text-sm font-medium">{property.beds} Beds</span>
                    </div>
                  )}
                  {property.baths && (
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <Bath className="mx-auto mb-2 w-6 h-6 text-orange-500" />
                      <span className="text-sm font-medium">{property.baths} Baths</span>
                    </div>
                  )}
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <Ruler className="mx-auto mb-2 w-6 h-6 text-orange-500" />
                    <span className="text-sm font-medium">{property.area}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-full font-semibold transition-all duration-300"
                  onClick={() => window.location.href = '/properties'} // Redirect to properties page
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence> 

            <motion.button 
              whileHover={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" }} // Change shadow on hover
              onClick={() => setActiveSlide(prev => prev === 0 ? Math.ceil(properties.length / 2) - 1 : prev - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full p-3"
              style={{ width: '50px', height: '50px', transformOrigin: 'center' }} // Fixed size and center origin
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </motion.button>
            <motion.button 
              whileHover={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" }} // Change shadow on hover
              onClick={() => setActiveSlide(prev => prev >= Math.ceil(properties.length / 2) - 1 ? 0 : prev + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-lg rounded-full p-3"
              style={{ width: '50px', height: '50px', transformOrigin: 'center' }} // Fixed size and center origin
            >
              <ArrowRight className="h-6 w-6 text-gray-700" />
            </motion.button>
        </div>
      </motion.section>

      {/* Under Development Projects */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }} className="max-w-7xl mx-auto py-20 px-6"
      >
        <div className="text-center mb-16">
          <motion.h2 
            variants={itemVariants}
            className="text-5xl font-roboto font-bold mb-4 text-gray-800 tracking-tight"
          >
            Under Development Projects
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Get a sneak peek at our upcoming projects
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {underDevelopmentProjects.map(project => (
            <motion.div 
              key={project.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300"
            >
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-8">
                <h3 className="text-3xl font-roboto font-bold mb-2 text-gray-800">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-orange-500 font-medium"
                >
                  Read More →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Homepage;