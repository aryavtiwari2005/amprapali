"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bed, Bath, Ruler, Star, Car } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    project_name: "",
    beds: "",
    price: "",
  });
  const router = useRouter();

  const formatPrice = (price) => {
    const priceNum = parseFloat(price);

    if (priceNum >= 10000000) {
      return `₹${(priceNum / 10000000).toFixed(2)} Cr`;
    } else if (priceNum >= 100000) {
      return `₹${(priceNum / 100000).toFixed(2)} Lakhs`;
    } else {
      return `₹${priceNum.toLocaleString()}`;
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("resale_amrapali")
          .select("*");

        if (error) {
          throw error;
        }

        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on user input
  const filteredProperties = properties.filter((property) => {
    const meetsMinPrice =
      !filters.minPrice || property.price >= parseFloat(filters.minPrice);
    const meetsBHK = !filters.bhk || property.beds === parseInt(filters.bhk);
    const meetsProject =
      !filters.projectName || property.project_name === filters.projectName;

    return meetsMinPrice && meetsBHK && meetsProject;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePropertyClick = (property) => {
    if (property.link) {
      window.open(`/properties${property.link}`, "_blank");
    }
  };

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
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-20 pt-24 font-montserrat">
        <div className="flex flex-wrap gap-6 mb-6">
          <select
            name="projectName"
            value={filters.projectName}
            onChange={handleFilterChange}
            className="p-2 pr-24 border rounded w-full sm:w-auto"
          >
            <option value="">All Projects</option>
            {[...new Set(properties.map((p) => p.project_name))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            name="bhk"
            value={filters.bhk}
            onChange={handleFilterChange}
            className="p-2 pr-24 border rounded w-full sm:w-auto"
          >
            <option value="">All BHKs</option>
            {[...new Set(properties.map((p) => p.beds))].map((beds) => (
              <option key={beds} value={beds}>
                {beds} BHK
              </option>
            ))}
          </select>
          <select
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="p-2 pr-24 border rounded w-full sm:w-auto"
          >
            <option value="">Any Price</option>
            {[
              { label: "Above 40 Lakh", value: 4000000 },
              { label: "Above 50 Lakh", value: 5000000 },
              { label: "Above 60 Lakh", value: 6000000 },
              { label: "Above 70 Lakh", value: 7000000 },
              { label: "Above 80 Lakh", value: 8000000 },
              { label: "Above 90 Lakh", value: 9000000 },
              { label: "Above 1 Cr", value: 10000000 },
            ].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
          </motion.div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  onClick={() => handlePropertyClick(property)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)",
                  }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden relative cursor-pointer"
                >
                  <div className="relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 md:h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 md:h-64 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-600">No image available</p>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-btn-800 text-white text-xs font-semibold px-2 py-1 rounded">
                      {property.type}
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      {property.title}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-500 mr-2" />
                      {property.location}
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      {[
                        { icon: Bed, value: property.beds, label: "BHK" },
                        { icon: Bath, value: property.baths, label: "Baths" },
                        { icon: Car, value: property.cars, label: "Parking" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-orange-50 p-2 rounded-lg"
                        >
                          <item.icon className="w-5 h-5 text-orange-500 mx-auto" />
                          <p className="text-sm text-gray-700 mt-1">
                            {item.value} {item.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg md:text-2xl font-bold text-gray-800 font-montserrat">
                        {property.price && formatPrice(property.price)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">
              No properties found matching your criteria.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
};

export default PropertiesPage;
