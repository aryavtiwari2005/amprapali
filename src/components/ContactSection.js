import React, { useState } from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import CustomCaptcha from "./CustomCaptcha";
import { supabase } from "@/utils/supabaseClient";

const ContactSection = ({
  companyName = "Amrapali Group",
  address = "Shop No. FF - 10, Gaur City Galleria, Gaur City - 2, Greater Noida (W), U.P. India - 201309.",
  email = "Info@amrapali.In",
  phone = "+91 8882-127-127",
  locationMap = "",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
    url: typeof window !== "undefined" ? window.location.href : "",
  });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim().match(/^\d{10}$/))
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!formData.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Enter a valid email address";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCaptchaVerify = (isVerified) => {
    setIsCaptchaVerified(isVerified);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!isCaptchaVerified) {
      alert("Please solve the captcha");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact-amrapali")
        .insert([formData]);
      if (error) throw error;
      setFormData({ name: "", mobile: "", email: "", message: "" });
      setIsCaptchaVerified(false);
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="border-t pt-6">
      <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-btn-800"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-btn-800"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-btn-800"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-btn-800"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}

            <CustomCaptcha onVerify={handleCaptchaVerify} />

            <button
              type="submit"
              disabled={!isCaptchaVerified || isLoading}
              className={`w-full py-3 rounded-lg transition-colors ${
                isCaptchaVerified && !isLoading
                  ? "bg-btn-800 text-white hover:bg-opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
        {/* Contact Information and Map */}
        <div>
          <div className="bg-btn-800 p-6 rounded-lg mb-6 text-white">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold">{companyName}</h3>
            </div>
            <div className="space-y-2 text-white">
              <p className="font-semibold">Booking Office</p>
              <p>{address}</p>
              <div className="pt-4">
                <p>Email Us At: {email}</p>
                <p>Call Us On: {phone}</p>
              </div>
            </div>
          </div>

          {/* Embedded Map */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={locationMap}
              alt="Location Map"
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Social Media Links */}
          <div className="mt-6 flex justify-center space-x-4">
            {[
              { Icon: Facebook, href: "#facebook" },
              { Icon: Twitter, href: "#twitter" },
              { Icon: Linkedin, href: "#linkedin" },
              { Icon: Instagram, href: "#instagram" },
            ].map(({ Icon, href }) => (
              <a
                key={href}
                href={href}
                className="text-gray-600 hover:text-btn-800"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
