"use client"; // Ensure this is a client component if using hooks or interactivity

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const NotFoundPage = () => {
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
      className="
        min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
        font-sans flex items-center justify-center
      "
    >
      <motion.div variants={itemVariants} className="text-center">
        <motion.h1
          variants={itemVariants}
          className="
            text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6 
            leading-tight text-transparent bg-clip-text 
            bg-gradient-to-r from-gray-800 to-gray-600
          "
        >
          404 - Page Not Found
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 mb-8"
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="
              px-8 py-3 md:px-12 md:py-4 bg-btn-800 
              text-white rounded-full text-lg font-montserrat 
              font-semibold shadow-2xl hover:shadow-orange-500/50 
              transition-all duration-300
            "
          >
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;
