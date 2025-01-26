'use client';

import React from 'react';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube 
} from 'lucide-react';

const contactInfo = {
  corporate: {
    title: "Corporate Office",
    address: "T-12, Sector 4, Gautam Buddha Nagar, Noida - 201301",
    phone: "+91-120-4972222",
    email: "info@amrapaligroup.co.in",
    workingHours: "Mon - Sat: 10:00 AM - 6:00 PM"
  },
  registered: {
    title: "Registered Office",
    address: "307, 3rd Floor, Nipun Tower, Community Centre, Karkardooma, Delhi - 110092",
    phone: "+91-11-43119900",
    email: "delhi@amrapaligroup.co.in"
  },
  social: {
    facebook: "https://facebook.com/AmrapaliGroup",
    twitter: "https://twitter.com/AmrapaliGroup",
    instagram: "https://instagram.com/AmrapaliGroup",
    linkedin: "https://linkedin.com/company/amrapali-group",
    youtube: "https://youtube.com/AmrapaliGroup"
  }
};

const Footer = () => {
  return (
    <footer className="bg-brown-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
          {/* Corporate Office */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold text-yellow-400">{contactInfo.corporate.title}</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-start space-x-2">
                <Building2 className="w-6 h-6 text-yellow-400" />
                <span>{contactInfo.corporate.address}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-yellow-400" />
                <a href={`tel:${contactInfo.corporate.phone}`} className="hover:text-yellow-400 transition-colors duration-200">
                  {contactInfo.corporate.phone}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                <a href={`mailto:${contactInfo.corporate.email}`} className="hover:text-yellow-400 transition-colors duration-200">
                  {contactInfo.corporate.email}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>{contactInfo.corporate.workingHours}</span>
              </p>
            </div>
          </div>

          {/* Registered Office */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold text-yellow-400">{contactInfo.registered.title}</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-start space-x-2">
                <Building2 className="w-6 h-6 text-yellow-400" />
                <span>{contactInfo.registered.address}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-yellow-400" />
                <a href={`tel:${contactInfo.registered.phone}`} className="hover:text-yellow-400 transition-colors duration-200">
                  {contactInfo.registered.phone}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                <a href={`mailto:${contactInfo.registered.email}`} className="hover:text-yellow-400 transition-colors duration-200">
                  {contactInfo.registered.email}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold text-yellow-400">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              {['Our Projects', 'About Us', 'Careers', 'Contact'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="flex items-center space-x-2 hover:text-yellow-400 transition-colors duration-200">
                    <ArrowRight className="w-5 h-5 text-yellow-400" />
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold text-yellow-400">Connect With Us</h3>
            <div className="flex flex-wrap gap-4 text-gray-300">
              {Object.entries(contactInfo.social).map(([platform, link]) => (
                <a
                  key={platform}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-yellow-400 transition-colors duration-200"
                >
                  {platform === "facebook" && <Facebook className="w-5 h-5" />}
                  {platform === "twitter" && <Twitter className="w-5 h-5" />}
                  {platform === "instagram" && <Instagram className="w-5 h-5" />}
                  {platform === "linkedin" && <Linkedin className="w-5 h-5" />}
                  {platform === "youtube" && <Youtube className="w-5 h-5" />}
                  <span className="capitalize">{platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-yellow-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              ©️ 2025 Amrapali Group. All rights reserved.
            </p>
            <div className="flex flex-wrap space-x-4">
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;