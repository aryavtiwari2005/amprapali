'use client';
import React, { useState, useEffect } from 'react';
import {
  Home,
  MapPin,
  FileText,
  Phone,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Inter, Montserrat } from '@next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300', '400', '600', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', weight: ['400', '600', '700'] });

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Properties', icon: MapPin, href: '/properties' },
    { name: 'About', icon: FileText, href: '/about' },
    { name: 'Contact', icon: Phone, href: '/contact' },
  ];

  // Check screen size and hide mobile menu on larger screens
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial screen size
    checkMobileView();

    // Add event listener for screen resize
    window.addEventListener('resize', checkMobileView);

    // Close mobile menu when screen size changes
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href) => pathname === href;

  // Hide hamburger on About page
  const showMobileMenu = isMobile;

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50 ${inter.variable} ${montserrat.variable}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center font-montserrat">
        {/* Logo with smooth animation */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-800 tracking-wide font-montserrat"
        >
          Amrapali
        </motion.h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 font-medium text-sm md:text-base">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={() => item.dropdown && setIsDropdownOpen(true)}
              onMouseLeave={() => item.dropdown && setIsDropdownOpen(false)}
            >
              <motion.a
                href={item.href}
                className={`flex items-center space-x-2 transition-colors duration-300 font-semibold 
                  ${isActive(item.href) ? 'text-btn-800' : 'text-gray-600 hover:text-orange-500'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.name}</span>
                {item.dropdown && (
                  <ChevronDown
                    className="w-4 h-4 opacity-60 group-hover:rotate-180 transition-transform"
                  />
                )}
              </motion.a>
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button - Conditionally Rendered */}
        {showMobileMenu && (
          <button
            className="md:hidden flex items-center justify-center text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Mobile Navigation - Conditionally Rendered */}
      {showMobileMenu && (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white shadow-md overflow-hidden"
            >
              <ul className="flex flex-col space-y-4 px-4 py-4">
                {navItems.map((item) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <a
                      href={item.href}
                      className={`flex items-center space-x-2 transition-colors duration-300 font-semibold 
                        ${isActive(item.href) ? 'text-btn-800' : 'text-gray-600 hover:text-orange-500'}`}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.name}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      )}
    </header>
  );
};

export default Navbar;