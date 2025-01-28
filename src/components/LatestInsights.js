"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LatestInsights = () => {
  const insights = [
    {
      id: 1,
      title: "Amrapali Zodiac",
      description: "Discover the latest amenities and features in our upcoming project...",
      image: "/amp-leisure.jpg",
    },
    {
      id: 2,
      title: "Amrapali Silicon City",
      description: "Explore the latest construction updates and project details...",
      image: "/amp-silicon.webp",
    },
    {
      id: 3,
      title: "Amrapali Dream Valley",
      description: "Get the latest insights on the upcoming project in Noida Extension...",
      image: "/amp-dream.webp",
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`
        max-w-7xl mx-auto py-20 px-6
      `}
    >
      <div className="text-center mb-16">
        <motion.h2 
          className="text-5xl font-bold mb-2 font-roboto tracking-tight text-gray-900"
        >
          Under Construction Projects
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 font-playfair"
        >
          Stay updated with real estate trends and news
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg"
          >
            <div className="relative h-60">
              <img
                src={insight.image}
                alt={insight.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 font-montserrat text-gray-900">
                {insight.title}
              </h3>
              <p className="text-gray-600 mb-4 font-inter">
                {insight.description}
              </p>
              <button className="text-orange-500 font-medium flex items-center group font-roboto" onClick={() => {window.location.href="/projects"}}>
                Read More 
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default LatestInsights;