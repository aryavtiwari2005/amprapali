'use client'

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Inter, Merriweather, Montserrat, Playfair_Display, Roboto } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  weight: ['300', '400', '600', '700']
});

const merriweather = Merriweather({ 
  subsets: ['latin'], 
  variable: '--font-merriweather',
  weight: ['400', '700']
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  weight: ['400', '600', '700']
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  weight: ['400', '700']
});

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto', weight: ['400', '500', '700'] });

// Keep existing stats and projects data
const stats = [
  { value: "25+", label: "Years of Excellence" },
  { value: "50K+", label: "Happy Families" },
  { value: "100+", label: "Projects Delivered" },
  { value: "20M+", label: "Sq Ft Developed" }
];

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
    image: "amp-silicon.webp",
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
    image: "amp-eden.jpeg",
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
      <Navbar />
      <div className="absolute inset-0 bg-yellow-200 rounded-xl transform translate-x-4 translate-y-4 opacity-90 transition-all duration-500" />
      
      <div className="relative rounded-xl shadow-xl overflow-hidden">
        <img 
          src={properties[currentIndex].image}
          alt={properties[currentIndex].name}
          className="w-full h-[400px] object-cover transition-transform duration-500 transform hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className={`text-2xl font-semibold mb-2 ${playfair.variable}`}>{properties[currentIndex].name}</h3>
          <div className="flex justify-between items-center">
            <p className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              {properties[currentIndex].location}
            </p>
            <span className="bg-yellow-300 px-3 py-1 rounded-full text-sm">
              {properties[currentIndex].type}
            </span>
          </div>
          <p className="text-sm mt-2">{properties[currentIndex].price}</p>
        </div>

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
      <div className={`relative h-screen overflow-hidden ${inter.variable} ${merriweather.variable} 
        ${montserrat.variable} ${playfair.variable}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 to-transparent opacity-85" />
        <img src="landing.jpg" alt="Amrapali Landmark Project" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl bg-white bg-opacity-30 backdrop-blur-md p-6 rounded-lg border border-gray-200 shadow-lg">
          <h1 className={`text-5xl md:text-7xl font-bold text-brown-800 mb-8 leading-tight tracking-tight transition-transform duration-500 transform hover:scale-105 font-playfair`}>
            Building <span className="font-bold block">Dreams & Legacies</span>
          </h1>
          <p className={`text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed font-light tracking-wide font-playfair`}>
            Pioneers in Real Estate Development Since 1998,<br />
            <span className="font-medium">Redefining Luxurious Living Across India</span>
          </p>
        </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-8 border-r last:border-r-0 border-gray-100 transition-transform duration-300 hover:scale-105">
                <h3 className={`text-4xl md:text-5xl font-bold text-brown-800 mb-3 ${playfair.variable}`}>{stat.value}</h3>
                <p className={`text-gray-600 uppercase tracking-wider text-sm font-medium ${inter.variable}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-10">
            <h2 className={`text-5xl font-bold leading-tight ${playfair.variable}`}>
              <span className="text-brown-800">AMRAPALI GROUP</span>
              <br />
              <span className="tracking-widest">AN INTRODUCTION</span>
            </h2>
            <div className="space-y-6">
              <p className={`text-xl text-gray-700 leading-relaxed font-light ${inter.variable}`}>
                Amrapali Group stands as one of India's outstanding real estate companies, particularly recognized in Delhi and the National Capital Region (NCR). Under the leadership of Mr. Anil Sharma, the group has established itself as a premier developer of luxurious homes in strategic locations, all equipped with modern amenities.
              </p>
              <p className={`text-xl text-gray-700 leading-relaxed font-light ${inter.variable}`}>
                Our portfolio encompasses a diverse range of developments including commercial complexes, townships, offices, residential complexes, and family entertainment centers. We've partnered with renowned architect Hafeez Contractor to ensure exceptional design quality across all our projects.
              </p>
              <p className={`text-xl text-gray-700 leading-relaxed font-light ${inter.variable}`}>
                The group has concentrated its construction business in Indirapuram, Greater Noida, and parts of East Delhi, successfully completing projects across more than 100 acres. Our developments span residential, commercial, IT parks, hospitality, and township sectors.
              </p>
            </div>
            <div className="bg-yellow-100 p-10 rounded-xl shadow-sm transition-transform duration-300 hover:scale-105">
              <blockquote className={`text-2xl text-gray-800 italic leading-relaxed font-light ${merriweather.variable}`}>
                "We are committed to delivering luxurious, modern homes with impeccable quality and within promised timelines."
                <footer className={`text-base text-gray-600 mt-6 font-medium tracking-wide ${inter.variable}`}>- Mr. Anil Sharma, Chairman</footer>
              </blockquote>
            </div>
          </div>
          <div className="space-y-10">
            <PropertyCarousel />
            <div className="bg-gray-50 p-8 rounded-xl transition-transform duration-300 hover:scale-105">
              <h3 className={`text-2xl font-medium mb-6 text-brown-800 ${montserrat.variable}`}>Our Success Principles</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-brown-800 mt-1 flex-shrink-0" />
                  <p className={`text-gray-700 leading-relaxed ${inter.variable}`}>Timely project delivery within stipulated timeframes</p>
                </li>
                <li className="flex items-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-brown-800 mt-1 flex-shrink-0" />
                  <p className={`text-gray-700 leading-relaxed ${inter.variable}`}>Expert team of qualified engineers and architects</p>
                </li>
                <li className="flex items-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-brown-800 mt-1 flex-shrink-0" />
                  <p className={`text-gray-700 leading-relaxed ${inter.variable}`}>Strong focus on customer satisfaction and trust-building</p>
                </li>
                <li className="flex items-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-brown-800 mt-1 flex-shrink-0" />
                  <p className={`text-gray-700 leading-relaxed ${inter.variable}`}>Commitment to quality construction and modern amenities</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white">
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;