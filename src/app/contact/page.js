"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/utils/supabaseClient";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
    url: typeof window !== "undefined" ? window.location.href : "",
  });

  const [formStatus, setFormStatus] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const { name, email, mobile, message } = formData;
    if (!name.trim()) return "Name is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Valid email is required.";
    if (!/^\d{10}$/.test(mobile))
      return "Valid 10-digit mobile number is required.";
    if (!message.trim()) return "Message is required.";
    return "";
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFormError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setIsLoading(true);
    setFormStatus("Sending message...");

    try {
      const { data, error } = await supabase
        .from("contact-amrapali")
        .insert([formData]);
      if (error) throw error;
      setFormStatus("Success! Your message has been sent.");
      setFormData({
        name: "",
        mobile: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setFormStatus("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 
        pt-24 font-sans`}
    >
      <Navbar />
      <motion.section
        variants={itemVariants}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 
          bg-white shadow-2xl overflow-hidden 
          mb-20 flex-col-reverse md:flex-row"
      >
        {/* Contact Form Section */}
        <div className="p-6 sm:p-8 md:p-12 font-montserrat order-2 md:order-1">
          <motion.form
            onSubmit={handleFormSubmit}
            variants={itemVariants}
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-btn-800 
                  transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-btn-800 
                  transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
              >
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-btn-800 
                  transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="additionalInfo"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message here"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-btn-800 
                  transition-all text-sm sm:text-base"
              />
            </div>

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              name="submitBtn"
              className="w-full bg-btn-800 
                text-white py-2 sm:py-3 rounded-lg font-semibold 
                shadow-lg hover:shadow-xl transition-all 
                flex items-center justify-center space-x-2 
                text-sm sm:text-base"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{isLoading ? "Sending..." : "Send Message"}</span>
            </motion.button>
            <p className="text-sm sm:text-base mt-2 text-gray-500">
              {formStatus}
            </p>
          </motion.form>
        </div>

        {/* Contact Information Section */}
        <div
          className="bg-btn-800 
          p-6 sm:p-8 md:p-12 text-white flex flex-col justify-center 
          order-1 md:order-2"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-montserrat"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-80 font-montserrat"
          >
            We'd love to hear from you. Fill out the form and we'll get back to
            you as soon as possible.
          </motion.p>

          <div className="space-y-4 sm:space-y-6 font-montserrat">
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-3 sm:space-x-4"
            >
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
              <span className="text-sm sm:text-base">
                123 Luxury Lane, Sector 45, Gurgaon
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-3 sm:space-x-4"
            >
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
              <span className="text-sm sm:text-base">+91 98765 43210</span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-3 sm:space-x-4"
            >
              <Mail className="w-6 h-6 sm:w-8 sm:h-8  text-white/80" />
              <span className="text-sm sm:text-base">
                contact@luxuryhomes.com
              </span>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Footer />
    </motion.div>
  );
};

export default ContactPage;
