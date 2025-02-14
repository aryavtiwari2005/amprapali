"use client"; // Ensure this is a client component

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const NotFoundPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures animation only runs on client
  }, []);

  return (
    <div
      className="
        min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 
        flex flex-col items-center justify-center text-center p-6
      "
    >
      {isClient ? (
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            text-5xl md:text-6xl lg:text-7xl font-bold 
            bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text
            drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] 
          "
        >
          404 - Page Not Found
        </motion.h1>
      ) : (
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800">
          404 - Page Not Found
        </h1>
      )}
      <p className="text-lg md:text-xl text-gray-700 mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="
            px-8 py-3 md:px-12 md:py-4 bg-gray-900 text-white 
            rounded-full text-lg font-semibold shadow-lg 
            hover:bg-gray-800 hover:scale-105 transition-all duration-300
          "
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
