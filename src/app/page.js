"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Homepage from "../components/Homepage";
import Footer from "../components/Footer";
import ImagePopup from "@/components/ImagePopup";

const BuilderWebsite = () => {
  return (
    <div className="min-h-screen bg-white">
      <ImagePopup />
      <Navbar />
      <Homepage />
      <Footer />
    </div>
  );
};

export default BuilderWebsite;
