"use client"
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const ProjectsPage = () => {
    const projects = [
        {
          id: 1,
          title: 'Skyline Tower',
          category: 'Luxury Apartments',
          duration: '18 months',
          image: '/amp-dream.webp'
        },
        {
          id: 2,
          title: 'Green Valley',
          category: 'Family Homes',
          duration: '12 months',
          image: '/amp-eden.jpeg'
        },
        {
          id: 3,
          title: 'Riverfront Condos',
          category: 'Condominiums',
          duration: '24 months',
          image: '/amp-landing.jpg'
        },
        {
          id: 4,
          title: 'Countryside Villa',
          category: 'Villas',
          duration: '24 months',
          image: '/amp-silicon.webp'
        },
        {
          id: 5,
          title: 'City Center Heights',
          category: 'Urban Apartments',
          duration: '22 months',
          image: '/amp-tech.jpg'
        },
        {
          id: 6,
          title: 'Mountain Retreat',
          category: 'Cabins',
          duration: '12 months',
          image: '/amp-leisure.jpg'
        },
        {
          id: 7,
          title: 'Modern Townhouse',
          category: 'Townhouses',
          duration: '15 months',
          image: '/amp-5.png'
        },
        {
          id: 8,
          title: 'Lakeside Cottage',
          category: 'Cottages',
          duration: '14 months',
          image: '/amp-4.jpg'
        },
        {
          id: 9,
          title: 'Suburban Duplex',
          category: 'Duplexes',
          duration: '18 months',
          image: '/amp-landing.jpg'
        }
      ];

  const [activeFilter, setActiveFilter] = React.useState('Residential');

  return (
    <div className={`w-full`}>
      {/* Hero Section */}
      <Navbar />
      <div className="relative min-h-screen mb-16">
        <div className="absolute inset-0">
          <img 
            src="/amp-6.jpg" 
            alt="Residential Living" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative min-h-screen flex flex-col justify-center px-8">
          <h1 className="text-5xl font-bold text-white mb-4 font-poppins">Residential</h1>
          <p className="text-xl text-white mb-6 font-light font-inter">We provide best services for your family living.</p>
          <button className="bg-orange-400 text-white px-6 py-2 rounded-md w-32 hover:bg-orange-500 transition-colors font-medium">
            Read More
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 font-poppins">Our Projects</h2>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['Residential', 'Commercial', 'Under-Construction'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-md transition-colors font-medium ${
                activeFilter === filter
                  ? 'bg-orange-400 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 font-poppins">{project.title}</h3>
                <p className="text-gray-600 mb-1 text-sm font-inter">Category: {project.category}</p>
                <p className="text-gray-600 mb-4 text-sm font-inter">Duration: {project.duration}</p>
                <button className="text-orange-400 hover:text-orange-500 transition-colors font-medium font-montserrat">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="flex justify-center mb-16">
          <button className="bg-orange-400 text-white px-8 py-2 rounded-md hover:bg-orange-500 transition-colors font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Read More
          </button>
        </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;