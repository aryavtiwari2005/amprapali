import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImagePopup = ({ tableName = "popup_amrapali", autoOpen = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopupData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setPopupData(data);

        if (data && autoOpen) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching popup data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopupData();
  }, [tableName, autoOpen]);

  const handleRedirect = () => {
    if (popupData?.link) {
      window.open(popupData.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3 },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 0.7,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeInOut",
              },
            }}
            className={`
              relative bg-white rounded-2xl shadow-2xl
              overflow-hidden 
              ${
                popupData?.text
                  ? "flex flex-col md:flex-row w-[90%] md:w-[80%] h-[70vh] max-h-[80vh]"
                  : "w-[80%] h-[70vh] max-h-[80vh]"
              }
            `}
          >
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin">🔄</div>
              </div>
            ) : popupData ? (
              <>
                {/* Image Section */}
                <div
                  className={`
                    cursor-pointer relative
                    ${
                      popupData.text
                        ? "md:w-1/2 h-1/2 md:h-full bg-cover bg-center hover:scale-105 bg-no-repeat"
                        : "w-full h-full bg-contain bg-center bg-no-repeat"
                    }
                    transition-transform
                  `}
                  style={{
                    backgroundImage: `url(${popupData.image})`,
                    backgroundSize: popupData.text ? "contain" : "contain",
                  }}
                  onClick={handleRedirect}
                >
                  <div
                    className="
                      absolute top-5 right-5 p-2
                      text-white hover:text-orange-300
                      transition-colors
                    "
                  >
                    <ExternalLink className="w-6 h-6 opacity-70 hover:opacity-100" />
                  </div>
                </div>

                {/* Text Section (Conditional Rendering) */}
                {popupData.text && (
                  <div
                    className="
                      md:w-1/2 p-6 overflow-y-auto
                      flex flex-col justify-center space-y-4
                    "
                  >
                    <h2
                      className="
                        text-2xl font-bold text-gray-800
                        mb-2 border-b pb-2
                      "
                    >
                      {popupData.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{popupData.text}</p>
                    <button
                      onClick={handleRedirect}
                      className="
                        bg-btn-800 text-white px-6 py-2
                        rounded-full hover:bg-orange-500
                        transition-colors
                      "
                    >
                      Learn More
                    </button>
                  </div>
                )}

                {/* Learn More Button for Image-Only Popup */}
                {!popupData.text && popupData.link && (
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={handleRedirect}
                      className="
                        bg-btn-800 text-white px-6 py-2
                        rounded-full hover:bg-orange-500
                        transition-colors
                      "
                    >
                      Learn More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full p-6 text-center text-gray-500">
                No popup data available
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="
                absolute top-4 right-4
                text-gray-600 hover:text-gray-600
                transition-colors bg-btn-800 rounded-full p-2 text-white
              "
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePopup;
