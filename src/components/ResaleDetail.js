"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Coins,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "./ContactSection";

const ResaleDetail = ({ resale, loading, router, backLink }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (resale?.images && resale.images.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % resale.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (resale?.images && resale.images.length > 0) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + resale.images.length) % resale.images.length
      );
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
      </div>
    );
  }

  if (!resale) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Resale property not found</h1>
        <button
          onClick={() => router.push(backLink)}
          className="flex items-center text-orange-500 hover:text-orange-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to {backLink === "/resale" ? "Resale Properties" : "Properties"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          {/* Image Carousel */}
          <div className="relative mb-6">
            {resale.images && resale.images.length > 0 ? (
              <>
                <motion.img
                  key={currentImageIndex}
                  src={resale.images[currentImageIndex]}
                  alt={resale.title}
                  className="w-full h-[60vh] object-contain rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-200 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-200 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="w-full h-[60vh] bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-600">No images available</p>
              </div>
            )}
          </div>

          {/* Resale Property Details */}
          <div className="space-y-6">
            <div className="mt-10">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {resale.title}
              </h1>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-5 h-5 text-btn-800 mr-2" />
                {resale.location}
              </p>
              <p className="text-gray-800 text-xl flex items-center font-bold text-btn-800">
                <Coins className="w-5 h-5 text-btn-800 mr-2" />
                {formatPrice(resale.price)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              {[
                { icon: Bed, value: resale.beds, label: "BHK" },
                { icon: Bath, value: resale.baths, label: "Baths" },
                { icon: Car, value: resale.cars, label: "Car Parking" },
              ].map((item, index) => (
                <div key={index} className="bg-orange-50 p-2 rounded-lg">
                  <item.icon className="w-7 h-7 text-btn-800 mx-auto" />
                  <p className="text text-gray-700 mt-1">
                    {item.value} {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <p className="text-xl font-bold text-gray-800">
                Resale ID:{" "}
                <span className="text-gray-600">{resale.resale_id}</span>
              </p>
              <p className="text-xl font-semibold">
                Project Name:{" "}
                <span className="text-gray-600">{resale.project_name}</span>
              </p>
              <p className="text-xl font-semibold">
                Property on Floor:{" "}
                <span className="text-gray-600">{resale.floor}</span>
              </p>
              <p className="text-xl font-semibold">
                Project Status:{" "}
                <span className="text-gray-600">{resale.type}</span>
              </p>
              <p className="text-xl font-semibold">
                Property Type: <span className="text-gray-600">Resale</span>
              </p>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">Property Description</h2>
              <p
                className="text-gray-600 mb-6"
                dangerouslySetInnerHTML={{ __html: resale.description }}
              ></p>
            </div>
          </div>

          <ContactSection />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ResaleDetail;
