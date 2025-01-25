'use client';
import React, { useState } from 'react';
import {
  Home,
  Building2,
  MapPin,
  FileText,
  Phone,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    // {
    //   name: 'Projects',
    //   icon: Building2,
    //   href: '#',
    //   dropdown: true,
    //   subItems: [
    //     { name: 'Residential', href: '#' },
    //     { name: 'Commercial', href: '#' },
    //     { name: 'Upcoming', href: '#' },
    //   ],
    // },
    { name: 'Properties', icon: MapPin, href: '/properties' },
    { name: 'About', icon: FileText, href: '/about' },
    { name: 'Contact', icon: Phone, href: '#' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo with smooth animation */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-800 tracking-wide font-sans"
        >
          Amrapali
        </motion.h1>

        {/* Navigation with hover effects and dropdown */}
        <nav className="flex items-center space-x-8 font-medium text-sm md:text-base">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={() => item.dropdown && setIsDropdownOpen(true)}
              onMouseLeave={() => item.dropdown && setIsDropdownOpen(false)}
            >
              <motion.a
                href={item.href}
                className="flex items-center text-gray-600 hover:text-orange-500 
                  transition-colors duration-300 space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="font-semibold">{item.name}</span>
                {item.dropdown && (
                  <ChevronDown
                    className="w-4 h-4 opacity-60 group-hover:rotate-180 transition-transform"
                  />
                )}
              </motion.a>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {item.dropdown && isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-48 bg-white 
                      rounded-md shadow-lg border border-gray-200 overflow-hidden"
                  >
                    {item.subItems?.map((subItem) => (
                      <motion.a
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-3 text-gray-600 hover:bg-orange-50 
                          hover:text-orange-500 transition-colors duration-200 font-medium"
                        whileHover={{ x: 8 }}
                      >
                        {subItem.name}
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;