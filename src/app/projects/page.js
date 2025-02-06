"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPin, Bed, Bath, Ruler } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabaseClient";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Residential");
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Update the query to include the link field
        const { data, error } = await supabase.from("projects").select("*");

        if (error) {
          throw error;
        }

        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    if (project.link) {
      // If it's an external link, navigate to it in a new tab
      if (project.link.startsWith("http")) {
        window.open(project.link, "_blank");
      } else {
        // If it's an internal link, use the router
        router.push(`/projects/${project.link}`);
      }
    }
  };

  const filteredProjects = projects.filter(
    (project) => project.type === activeFilter
  );

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
      className={`w-full`}
    >
      {/* Hero Section */}
      <Navbar />
      <div className="relative min-h-screen mb-16">
        <div className="absolute inset-0">
          <img
            src="/amp-6.jpg"
            alt="Residential Living"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative min-h-screen flex flex-col justify-center px-8">
          <h1 className="text-5xl font-bold text-white mb-4 font-poppins">
            Residential
          </h1>
          <p className="text-xl text-white mb-6 font-light font-inter">
            We provide best services for your family living.
          </p>
          <button className="bg-orange-400 text-white px-6 py-2 rounded-md w-32 hover:bg-orange-500 transition-colors font-medium">
            Read More
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-8 font-poppins">
          Our Projects
        </h2>

        {/* Filter Buttons */}
        <div className="flex justify-center">
          <div className="flex w-full mb-12 max-w-2xl border border-gray-200 rounded-full overflow-hidden">
            {[
              "Residential",
              "Commercial",
              "Under Construction",
              "Ready to Move in",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 py-3 text-base font-medium font-montserrat transition-colors
                  ${
                    activeFilter === filter
                      ? "bg-orange-400 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <motion.div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
          </motion.div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)",
                  }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden relative cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  {/* Project card content remains the same */}
                  <div className="relative">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-48 md:h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 md:h-64 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-600">No image available</p>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-btn-800 text-white text-xs font-semibold px-2 py-1 rounded">
                      {project.type}
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      {project.title}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-500 mr-2" />
                      {project.location}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg md:text-2xl font-bold text-gray-800 font-montserrat">
                        {project.price && formatPrice(project.price)}
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
              No projects found matching your criteria.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
};

export default ProjectsPage;
