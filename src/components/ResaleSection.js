import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bed, Bath, Car } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";

const ResaleSection = ({ project }) => {
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchRelatedProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("resale_amrapali")
          .select("*")
          .eq("project_name", project.title);

        if (error) {
          throw error;
        }

        setRelatedProperties(data || []);
      } catch (error) {
        console.error("Error fetching related properties:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProperties();
  }, [project.title]);

  const handlePropertyClick = (property) => {
    window.location.href = `/properties${property.link}`;
  };

  if (loading) {
    return (
      <div className="border-t pt-6">
        <h2 className="text-2xl font-semibold mb-6">
          Related Resale Properties
        </h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btn-800"></div>
        </div>
      </div>
    );
  }

  if (relatedProperties.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-6">
      <h2 className="text-2xl font-semibold mb-6">Related Resale Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {relatedProperties.map((property) => (
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
                    <div key={index} className="bg-orange-50 p-2 rounded-lg">
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
    </div>
  );
};

export default ResaleSection;
