// components/PropertyModal.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Ruler, Star, ChevronLeft, ChevronRight, Phone } from 'lucide-react'; // Import necessary icons

const PropertyModal = ({ property, onClose }) => {
  const handleBackdropClick = (e) => {
    // Close the modal only if the backdrop is clicked
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // State to manage the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  // Function to handle image navigation
  const handleNextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % property.images.length);
    }
  };

  const handlePrevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + property.images.length) % property.images.length);
    }
  };

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick} // Handle backdrop click
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-11/12 md:w-10/12 lg:w-9/12 max-w-4xl relative overflow-hidden max-h-[80vh] overflow-y-auto" // Adjusted width for responsiveness
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200 ease-in-out z-10" // Circular button with background and shadow
          aria-label="Close"
        >
          <span className="text-2xl text-gray-600">✖</span> {/* Cross icon */}
        </button>
        
        {/* Image Carousel */}
        <div className="relative mb-4">
          {property.images && property.images.length > 0 ? (
            <>
              <motion.img 
                key={currentImageIndex} // Key to trigger animation on image change
                src={property.images[currentImageIndex]} 
                alt={property.title} 
                className="w-full h-[40vh] sm:h-[60vh] object-contain rounded-lg transition-opacity duration-300 cursor-pointer" // Increased height for larger image
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => openImageViewer(currentImageIndex)} // Open image viewer on click
              />
              <button 
                onClick={handlePrevImage} 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-200 transition"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={handleNextImage} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-200 transition"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          ) : (
            <p className="text-gray-600">No images available.</p>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{property.title}</h2>
        <p className="text-gray-600 mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-orange-500 mr-2" />
          {property.location}
        </p>
        <p className="text-gray-600 mb-4">{property.description}</p> {/* Added description here */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          {[
            { icon: Bed, value: property.beds, label: 'BHK' },
            { icon: Ruler, value: property.area, label: 'Area (sq ft)' } // Assuming area is in square feet
          ].map((item, index) => (
            <div key={index} className="bg-orange-50 p-3 rounded-lg">
              <item.icon className="w-6 h-6 text-orange-500 mx-auto" />
              <p className="text-sm text-gray-700 mt-1">
                {item.value} {item.label}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl sm:text-2xl font-bold text-gray-800">
            {property.price.toLocaleString()}
          </span>
          <div className="flex items-center text-yellow-500">
            <Star className="w-5 h-5" />
            <span className="ml-1 font-semibold">{property.rating}</span>
          </div>
        </div>
        {/* Contact Information Section */}
        {property.contact ? (
          <motion.div
            className="mt-6 bg-gray-100 p-4 rounded-lg transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <Phone className="w-5 h-5 text-orange-500 mr-2" />
              Contact Information
            </h3>
            <p className="text-gray-700"><strong>Name:</strong> {property.contact[0]}</p>
            <p className="text-gray-700"><strong>Phone:</strong> {property.contact[1]}</p>
            <p className="text-gray-700"><strong>Email:</strong> {property.contact[2]}</p>
          </motion.div>
        ) : (
          <p className="text-gray-600 mt-4">Contact information not available.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PropertyModal;