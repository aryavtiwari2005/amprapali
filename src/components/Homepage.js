"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedProperties from "./FeaturesProperties";
import LatestInsights from "./LatestInsights";

const Homepage = () => {
  const [properties, setProperties] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties") // Replace with your actual table name
        .select("*");

      if (error) {
        console.error("Error fetching properties:", error);
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
      image: "amp-3.webp",
      type: "Residential",
    },
    {
      id: 2,
      title: "Premium Villa",
      location: "Sector 45, Gurgaon",
      beds: 4,
      baths: 3,
      area: "3200 sq.ft",
      price: "₹2.8 Cr",
      image: "amp-5.png",
      type: "Commercial",
    },
    {
      id: 3,
      title: "Office Space",
      location: "Connaught Place, Delhi",
      floor: 12,
      area: "5000 sq.ft",
      price: "₹4.5 Cr",
      image: "amp-4.jpg",
      type: "Ready to Move In",
    },
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

  const underDevelopmentProjects = [
    {
      id: 1,
      title: "Amrapali Silicon City",
      description:
        "Luxury apartments with modern amenities in the heart of Noida. Completion expected by 2026...",
      image: "amp-silicon.webp",
    },
    {
      id: 2,
      title: "Amrapali Leisure Valley",
      description:
        "Premium villas with world-class facilities in Greater Noida. Ready for possession by 2025...",
      image: "amp-leisure.jpg",
    },
    {
      id: 3,
      title: "Amrapali Dream Valley",
      description:
        "Contemporary apartments with smart home features. Phase 1 completion by late 2025...",
      image: "amp-dream.webp",
    },
  ];

  // Variants for consistent animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`
        min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
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
              ease: "easeOut",
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
              text-4xl md:text-5xl lg:text-7xl font-montserrat font-bold mb-6 
              leading-tight text-transparent bg-clip-text 
              bg-gradient-to-r from-white to-gray-300
            "
          >
            Elevate Your Living Experience
          </motion.h1>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              px-8 py-3 md:px-12 md:py-4 bg-btn-800 
              text-white rounded-full text-lg font-montserrat 
              font-semibold shadow-2xl hover:shadow-orange-500/50 
              transition-all duration-300
            "
            onClick={() => (window.location.href = "/properties")}
          >
            Explore Properties
          </motion.button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto py-12 px-6"
      >
        <div className="text-center mb-10 font-roboto">
          <motion.h2
            className="text-4xl font-roboto font-bold mb-4 
              text-gray-800 tracking-tight"
          >
            Our Projects
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div className="relative overflow-hidden rounded-lg">
            <img
              src="/amp-landing.jpg"
              alt="Amrapali Eden Park"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-white text-2xl font-bold mb-2">
                Amrapali Eden Park
              </h3>
              <p className="text-white mb-4">Sector 50, Noida</p>
              <button
                className="bg-white text-black px-6 py-2 rounded-full"
                onClick={() => {
                  window.location.href = "/projects";
                }}
              >
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div className="relative overflow-hidden rounded-lg">
            <img
              src="/amp-tech.jpg"
              alt="Amrapali Tech Park"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-white text-2xl font-bold mb-2">
                Amrapali Tech Park
              </h3>
              <p className="text-white mb-4">Sector 62, Noida</p>
              <button
                className="bg-white text-black px-6 py-2 rounded-full"
                onClick={() => {
                  window.location.href = "/projects";
                }}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <FeaturedProperties properties={properties} />
      <LatestInsights />
    </motion.div>
  );
};

export default Homepage;
