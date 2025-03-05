import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { X } from "lucide-react";
import CustomCaptcha from "./CustomCaptcha";
import { motion, AnimatePresence } from "framer-motion";

const ImagePopup = ({ tableName = "popup_amrapali", autoOpen = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    mobile: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile must be 10 digits";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
      isValid = false;
    }

    if (!isCaptchaVerified) {
      errors.captcha = "Please verify the captcha";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact-amrapali").insert([
        {
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          url: "popup",
          message: "",
        },
      ]);

      if (error) throw error;

      alert("Thank you for contacting us! We will get back to you soon.");
      setFormData({ name: "", mobile: "", email: "" });
      setIsCaptchaVerified(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 0.7,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            className="relative bg-white rounded-2xl shadow-2xl w-[90%] md:w-[80%] h-[80%] md:h-[70%] my-8 flex flex-col md:flex-row"
          >
            {loading ? (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin">🔄</div>
              </div>
            ) : popupData ? (
              <>
                {/* Image Section - Fixed height on mobile */}
                <div
                  className="w-full h-64 md:h-auto bg-cover bg-center bg-no-repeat hover:scale-105 transition-transform"
                  style={{ backgroundImage: `url(${popupData.image})` }}
                ></div>

                {/* Form Section - Scrollable */}
                <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleFormChange}
                        required
                        pattern="\d{10}"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      {formErrors.mobile && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.mobile}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <CustomCaptcha onVerify={setIsCaptchaVerified} />
                      {formErrors.captcha && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.captcha}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !isCaptchaVerified}
                      className="bg-btn-800 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      {isSubmitting ? "Sending..." : "Send"}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="w-full p-6 text-center text-gray-500">
                No popup data available
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-600 transition-colors bg-btn-800 rounded-full p-2 text-white"
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
