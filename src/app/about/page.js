'use client'

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  MessageSquare, 
  Instagram, 
  ChevronLeft, 
  ChevronRight,
  Building2,
  Clock,
  Globe,
  Linkedin,
  Youtube,
  ExternalLink
} from 'lucide-react';

// Keep existing stats and projects data
const stats = [
  { value: "25+", label: "Years of Excellence" },
  { value: "50K+", label: "Happy Families" },
  { value: "100+", label: "Projects Delivered" },
  { value: "20M+", label: "Sq Ft Developed" }
];

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

// Properties data for carousel
const properties = [
  {
    id: 1,
    name: "Amrapali Landmark",
    location: "Noida Sector 76",
    type: "Residential",
    price: "₹45L - ₹85L",
    image: "amp-5.png",
  },
  {
    id: 2,
    name: "Amrapali Silicon City",
    location: "Noida Sector 82",
    type: "Mixed Use",
    price: "₹55L - ₹1.2Cr",
    image: "amp-4.jpg",
  },
  {
    id: 3,
    name: "Amrapali Platinum",
    location: "Noida Sector 119",
    type: "Commercial",
    price: "₹75L - ₹1.5Cr",
    image: "amp-3.webp",
  },
  {
    id: 4,
    name: "Amrapali Eden Park",
    location: "Greater Noida West",
    type: "Residential",
    price: "₹35L - ₹65L",
    image: "amp-2.jpeg",
  }
];

// Property Carousel Component
const PropertyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + properties.length) % properties.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative">
      {/* Keep the emerald background effect from original design */}
      <div className="absolute inset-0 bg-emerald-600 rounded-xl transform translate-x-4 translate-y-4 opacity-90" />
      
      {/* Carousel container */}
      <div className="relative rounded-xl shadow-xl overflow-hidden">
        <img 
          src={properties[currentIndex].image}
          alt={properties[currentIndex].name}
          className="w-full h-[400px] object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Property info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-light mb-2">{properties[currentIndex].name}</h3>
          <div className="flex justify-between items-center">
            <p className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              {properties[currentIndex].location}
            </p>
            <span className="bg-emerald-600 px-3 py-1 rounded-full text-sm">
              {properties[currentIndex].type}
            </span>
          </div>
          <p className="text-sm mt-2">{properties[currentIndex].price}</p>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-20 right-6 flex space-x-2">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section - Kept exactly the same */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-transparent opacity-85" />
        <img src="landing.jpg" alt="Amrapali Landmark Project" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-light text-white mb-8 leading-tight tracking-tight">
              Building <span className="font-bold block">Dreams & Legacies</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed font-light tracking-wide">
              Pioneers in Real Estate Development Since 1998,<br />
              <span className="font-medium">Redefining Luxurious Living Across India</span>
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-lg flex items-center text-lg transition-all duration-300 transform hover:translate-x-2 font-medium tracking-wide">
              Explore Our Projects <ArrowRight className="ml-3 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section - Kept exactly the same */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-8 border-r last:border-r-0 border-gray-100">
                <h3 className="text-4xl md:text-5xl font-light text-emerald-600 mb-3">{stat.value}</h3>
                <p className="text-gray-600 uppercase tracking-wider text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section - Same structure, just replaced static image with carousel */}
      <div className="container mx-auto px-4 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-10">
            <h2 className="text-5xl font-light leading-tight">
              <span className="text-emerald-600 font-medium">AMRAPALI GROUP</span>
              <br />
              <span className="tracking-widest">AN INTRODUCTION</span>
            </h2>
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                Amrapali Group stands as one of India's outstanding real estate companies, particularly recognized in Delhi and the National Capital Region (NCR). Under the leadership of Mr. Anil Sharma, the group has established itself as a premier developer of luxurious homes in strategic locations, all equipped with modern amenities.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                Our portfolio encompasses a diverse range of developments including commercial complexes, townships, offices, residential complexes, and family entertainment centers. We've partnered with renowned architect Hafeez Contractor to ensure exceptional design quality across all our projects.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                The group has concentrated its construction business in Indirapuram, Greater Noida, and parts of East Delhi, successfully completing projects across more than 100 acres. Our developments span residential, commercial, IT parks, hospitality, and township sectors.
              </p>
            </div>
            <div className="bg-emerald-50 p-10 rounded-xl shadow-sm">
              <blockquote className="text-2xl text-gray-800 italic leading-relaxed font-light">
                "We are committed to delivering luxurious, modern homes with impeccable quality and within promised timelines."
                <footer className="text-base text-gray-600 mt-6 font-medium tracking-wide">- Mr. Anil Sharma, Chairman</footer>
              </blockquote>
            </div>
          </div>
          <div className="space-y-10">
            <PropertyCarousel />
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-medium mb-6 text-emerald-600">Our Success Principles</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">Timely project delivery within stipulated timeframes</p>
                </li>
                <li className="flex items-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">Expert team of qualified engineers and architects</p>
                </li>
                <li className="flex items-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">Strong focus on customer satisfaction and trust-building</p>
                </li>
                <li className="flex items-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">Commitment to quality construction and modern amenities</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white">

      {/* Enhanced Footer */} 
      <footer className="bg-emerald-900 text-white">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {/* Corporate Office */}
            <div className="space-y-6">
              <h3 className="text-2xl font-light mb-8">Corporate Office</h3>
              <div className="space-y-4">
                <p className="flex items-start space-x-4">
                  <Building2 className="w-5 h-5 mt-1 text-emerald-400 flex-shrink-0" />
                  <span className="font-light">{contactInfo.corporate.address}</span>
                </p>
                <p className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a href={`tel:${contactInfo.corporate.phone}`} className="hover:text-emerald-400 transition-colors duration-200 font-light">
                    {contactInfo.corporate.phone}
                  </a>
                </p>
                <p className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a href={`mailto:${contactInfo.corporate.email}`} className="hover:text-emerald-400 transition-colors duration-200 font-light">
                    {contactInfo.corporate.email}
                  </a>
                </p>
                <p className="flex items-center space-x-4">
                  <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="font-light">{contactInfo.corporate.workingHours}</span>
                </p>
              </div>
            </div>

            {/* Registered Office */}
            <div className="space-y-6">
              <h3 className="text-2xl font-light mb-8">Registered Office</h3>
              <div className="space-y-4">
                <p className="flex items-start space-x-4">
                  <Building2 className="w-5 h-5 mt-1 text-emerald-400 flex-shrink-0" />
                  <span className="font-light">{contactInfo.registered.address}</span>
                </p>
                <p className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a href={`tel:${contactInfo.registered.phone}`} className="hover:text-emerald-400 transition-colors duration-200 font-light">
                    {contactInfo.registered.phone}
                  </a>
                </p>
                <p className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a href={`mailto:${contactInfo.registered.email}`} className="hover:text-emerald-400 transition-colors duration-200 font-light">
                    {contactInfo.registered.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-2xl font-light mb-8">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center space-x-4 hover:text-emerald-400 transition-colors duration-200">
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                    <span className="font-light">Our Projects</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 hover:text-emerald-400 transition-colors duration-200">
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                    <span className="font-light">About Us</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 hover:text-emerald-400 transition-colors duration-200">
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                    <span className="font-light">Careers</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 hover:text-emerald-400 transition-colors duration-200">
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                    <span className="font-light">Contact</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div className="space-y-6">
              <h3 className="text-2xl font-light mb-8">Connect With Us</h3>
              {/* Social Media Grid */}
              <div className="grid grid-cols-2 gap-4">
                <a href={contactInfo.social.facebook} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center space-x-3 hover:text-emerald-400 transition-colors duration-200">
                  <Facebook className="w-5 h-5" />
                  <span className="font-light">Facebook</span>
                </a>
                <a href={contactInfo.social.twitter} target="_blank" rel="noopener noreferrer"
                   className="flex items-center space-x-3 hover:text-emerald-400 transition-colors duration-200">
                  <Twitter className="w-5 h-5" />
                  <span className="font-light">Twitter</span>
                </a>
                <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer"
                   className="flex items-center space-x-3 hover:text-emerald-400 transition-colors duration-200">
                  <Instagram className="w-5 h-5" />
                  <span className="font-light">Instagram</span>
                </a>
                <a href={contactInfo.social.linkedin} target="_blank" rel="noopener noreferrer"
                   className="flex items-center space-x-3 hover:text-emerald-400 transition-colors duration-200">
                  <Linkedin className="w-5 h-5" />
                  <span className="font-light">LinkedIn</span>
                </a>
                <a href={contactInfo.social.youtube} target="_blank" rel="noopener noreferrer"
                   className="flex items-center space-x-3 hover:text-emerald-400 transition-colors duration-200">
                  <Youtube className="w-5 h-5" />
                  <span className="font-light">YouTube</span>
                </a>
                <a href="#" className="flex items-center space-x-3 hover:text-emerald-400 transition-colors duration-200">
                  <Globe className="w-5 h-5" />
                  <span className="font-light">Website</span>
                </a>
              </div>

              {/* Newsletter Subscription */}
              <div className="pt-8 space-y-4">
                <h4 className="text-lg font-medium">Newsletter</h4>
                <p className="text-gray-300 font-light">Stay updated with our latest developments</p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-800 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-emerald-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-300 font-light text-center md:text-left">
                ©️ 2025 Amrapali Group. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-light">Privacy Policy</a>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-light">Terms of Service</a>
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-light">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default AboutPage;