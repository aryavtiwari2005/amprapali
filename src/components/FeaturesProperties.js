import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Ruler } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";

const FeaturedProperties = ({
  tableName = "projects",
  heading = "Ready to Move In Projects",
  buttonText = "View All Projects",
  buttonLink = "/projects",
}) => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      let data, error;

      if (tableName === "projects") {
        ({ data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("type", "Ready to Move in"));
      } else if (tableName === "properties") {
        ({ data, error } = await supabase.from(tableName).select("*"));
      } else {
        ({ data, error } = await supabase.from(tableName).select("*"));
      }

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setFeaturedProperties(data);
      }
    };

    fetchProperties();
  }, [tableName]);

  useEffect(() => {
    let scrollInterval;
    if (carouselRef.current && featuredProperties.length > 0) {
      scrollInterval = setInterval(() => {
        const carouselItems = carouselRef.current.children;
        const itemWidth = carouselItems[0].getBoundingClientRect().width;
        const gap = 16;

        const scrollAmount = isMobile ? itemWidth + gap : itemWidth + gap;

        const maxScrollLeft =
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        const currentScrollLeft = carouselRef.current.scrollLeft;

        if (currentScrollLeft >= maxScrollLeft) {
          carouselRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      }, 5000);
    }

    return () => clearInterval(scrollInterval);
  }, [isMobile, featuredProperties]);

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
    <motion.section variants={itemVariants} className="max-w-7xl mx-auto py-12">
      <div className="text-center mb-10">
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-roboto font-bold mb-4 text-gray-800 tracking-tight"
        >
          {heading}
        </motion.h2>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 no-scrollbar px-6"
      >
        {featuredProperties.map((property, index) => (
          <motion.div
            key={`${property.id}-${index}`}
            className="min-w-full md:min-w-[500px] w-full md:w-[500px] overflow-hidden border-2 border-black-100 transform transition-all duration-300 flex-shrink-0"
          >
            <div className="relative">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-6 right-6 bg-btn-800 text-white px-4 py-2 rounded-full text-sm font-bold">
                {property.type}
              </div>
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-montserrat font-bold text-gray-800 mb-2">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="mr-2 w-5 h-5 text-btn-800" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 mx-auto block px-12 py-3 md:px-12 md:py-4 bg-btn-800 
          text-white text-lg font-montserrat font-semibold shadow-2xl 
          hover:shadow-btn-800/50 transition-all duration-300"
        onClick={() => (window.location.href = buttonLink)}
      >
        {buttonText}
      </motion.button>
    </motion.section>
  );
};

export default FeaturedProperties;
