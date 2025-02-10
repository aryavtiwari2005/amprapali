"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedProperties from "./FeaturesProperties";
import LatestInsights from "./LatestInsights";
import ProjectsComponent from "./OurProjects";

const Homepage = () => {
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
            onClick={() => (window.location.href = "/projects")}
          >
            Explore Projects
          </motion.button>
        </div>
      </motion.section>
      <ProjectsComponent />
      <FeaturedProperties />
      <FeaturedProperties
        tableName="resale_amrapali"
        heading="Resale Properties"
        buttonText="View All Resale Properties"
        buttonLink="/properties"
      />
      <LatestInsights />
    </motion.div>
  );
};

export default Homepage;
