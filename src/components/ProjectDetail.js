"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "./ContactSection";

const ProjectDetail = ({ project, loading, router, backLink }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedBHK, setSelectedBHK] = useState("All");

  // Extract unique BHK types from floor map image names
  const getBHKTypes = (floorMaps) => {
    if (!floorMaps) return [];
    const types = floorMaps
      .map((src) => {
        const match = src.toLowerCase().match(/(\d)\s*bhk/);
        return match ? `${match[1]} BHK` : null;
      })
      .filter(Boolean);
    return ["All", ...new Set(types)];
  };

  // Filter floor maps based on selected BHK type
  const getFilteredFloorMaps = () => {
    if (!project?.floor_map) return [];
    if (selectedBHK === "All") return project.floor_map;
    return project.floor_map.filter((src) =>
      src.toLowerCase().includes(selectedBHK.toLowerCase().replace(" ", ""))
    );
  };

  // Extract floor plan details from image name
  const getFloorPlanDetails = (src) => {
    const filename = src.split("/").pop();
    const details = {
      type: "",
      area: "",
    };

    // Extract square footage
    const areaMatch = filename.toLowerCase().match(/(\d+)\s*sqft/i);
    if (areaMatch) {
      details.area = `${areaMatch[1]} Sq.Ft`;
    }

    const typeMatch = filename.toLowerCase().match(/(\d+bhk[^-]+)/i);

    if (typeMatch) {
      details.type = `${typeMatch[1]
        .replace(/_/g, " + ")
        .replace(/(\d+)bhk/i, "$1 BHK")
        .toUpperCase()}`;
    }

    return details;
  };

  const handleNextImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % project.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + project.images.length) % project.images.length
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

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <button
          onClick={() => router.push(backLink)}
          className="flex items-center text-orange-500 hover:text-orange-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to {backLink === "/projects" ? "Projects" : "Properties"}
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
            {project.images && project.images.length > 0 ? (
              <>
                <motion.img
                  key={currentImageIndex}
                  src={project.images[currentImageIndex]}
                  alt={project.title}
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

          {/* Project Details */}
          <div className="space-y-6">
            <div className="mt-10 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {project.title}
                </h1>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-5 h-5 text-btn-800 mr-2" />
                  {project.location}
                </p>
              </div>

              <div className="text-right">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Pricing:{" "}
                  <span className="text-btn-800">
                    {formatPrice(project.price)}
                  </span>
                </h2>
                <h2 className="text-lg relative">
                  RERA REG:{" "}
                  <span
                    className="hover:underline cursor-pointer"
                    onMouseMove={(e) => {
                      const tooltip =
                        document.getElementById("rera-qr-tooltip");
                      if (tooltip) {
                        tooltip.style.left = `${e.clientX + 10}px`; // Offset for better visibility
                        tooltip.style.top = `${e.clientY + 10}px`;
                      }
                    }}
                    onMouseEnter={() => {
                      const tooltip =
                        document.getElementById("rera-qr-tooltip");
                      if (tooltip) {
                        tooltip.style.display = "block";
                      }
                    }}
                    onMouseLeave={() => {
                      const tooltip =
                        document.getElementById("rera-qr-tooltip");
                      if (tooltip) {
                        tooltip.style.display = "none";
                      }
                    }}
                  >
                    {project.rera}
                  </span>
                  <div
                    id="rera-qr-tooltip"
                    style={{
                      display: "none",
                      position: "fixed",
                      pointerEvents: "none",
                      zIndex: 1000,
                    }}
                  >
                    <img
                      src={project.rera_qr}
                      alt="RERA QR Code"
                      className="w-36 h-36 border border-gray-200 rounded-lg shadow-lg"
                    />
                  </div>
                </h2>
              </div>
            </div>

            <div className="border-t pt-6">
              <p
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: project.description }}
              ></p>
            </div>

            {/* Floor Plans Section */}
            {project.floor_map && project.floor_map.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-2xl font-semibold mb-6">Floor Plan</h2>

                {/* BHK Type Filters */}
                <div className="flex gap-4 mb-8">
                  {getBHKTypes(project.floor_map).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedBHK(type)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedBHK === type
                          ? "bg-black text-white"
                          : "bg-transparent text-black border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Floor Plan Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getFilteredFloorMaps().map((src, index) => {
                    const details = getFloorPlanDetails(src);
                    return (
                      <div
                        key={index}
                        className="bg-btn-800 text-white rounded-lg overflow-hidden max-w-[250px]"
                      >
                        <img
                          src={src}
                          alt={`Floor plan ${index + 1}`}
                          className="w-full h-40 object-contain bg-white" // Reduced height
                        />
                        <div className="p-1">
                          {" "}
                          {/* Reduced padding */}
                          <h3 className="text-base font-semibold">
                            {" "}
                            {/* Smaller font size */}
                            {details.type}
                          </h3>
                          <p className="text-sm">{details.area}</p>{" "}
                          {/* Optional: Smaller paragraph text */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">Master Plan</h2>
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={project.master_plan}
                  alt="Master Plan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">
                {project.title} Frequently Asked Questions (FAQ)
              </h2>
              <div className="text-gray-600">
                {project.faq_questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-bold mr-5">
                        Q{index + 1}. {question}
                      </h3>
                      <button
                        onClick={() => {
                          const answer = document.getElementById(
                            `answer-${index}`
                          );
                          if (
                            answer.style.display === "none" ||
                            !answer.style.display
                          ) {
                            answer.style.display = "block";
                          } else {
                            answer.style.display = "none";
                          }
                        }}
                        className="text-btn-800 hover:text-orange-500"
                      >
                        View Answer
                      </button>
                    </div>
                    <div
                      id={`answer-${index}`}
                      style={{ display: "none" }}
                      className="mt-2"
                    >
                      <p>{project.faq_answers[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">Location Map</h2>
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={project.location_map}
                  alt="Master Plan"
                  className="w-full h-[500px] object-contain"
                />
              </div>
            </div>

            {project.contact && (
              <div className="border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2">
                    <span className="font-semibold">Name:</span>{" "}
                    {project.contact[0]}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Phone:</span>{" "}
                    {project.contact[1]}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {project.contact[2]}
                  </p>
                </div>
              </div>
            )}
          </div>

          <ContactSection />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
