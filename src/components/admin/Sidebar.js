"use client";

import { useEffect, useState } from "react";
import {
  Home,
  MapPin,
  Building2,
  FolderOpen,
  RotateCw,
  BookA,
  Image,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function Sidebar() {
  const [counts, setCounts] = useState({
    projects: 0,
    properties: 0,
    property_type: 0,
    location: 0,
    enquiry: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch projects count
      const { count: projectsCount, error: projectsError } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });

      if (projectsError) throw projectsError;

      // Fetch properties count
      const { count: propertiesCount, error: propertiesError } = await supabase
        .from("resale_amrapali")
        .select("*", { count: "exact", head: true });

      if (propertiesError) throw propertiesError;

      const { count: property_type, error: property_type_error } =
        await supabase
          .from("property_type_amrapali")
          .select("*", { count: "exact", head: true });

      if (property_type_error) throw property_type_error;

      const { count: location, error: location_error } = await supabase
        .from("location_amrapali")
        .select("*", { count: "exact", head: true });

      if (location_error) throw location_error;

      const { count: enquiry, error: enquiry_error } = await supabase
        .from("contact-amrapali")
        .select("*", { count: "exact", head: true });

      if (enquiry_error) throw enquiry_error;

      setCounts({
        projects: projectsCount || 0,
        properties: propertiesCount || 0,
        property_type: property_type || 0,
        location: location || 0,
        enquiry: enquiry || 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    {
      icon: MapPin,
      label: "Location",
      href: "/admin/location",
      count: counts.location,
    },
    {
      icon: Building2,
      label: "Property Type",
      href: "/admin/property-type",
      count: counts.property_type,
    },
    {
      icon: FolderOpen,
      label: "Project",
      href: "/admin/project",
      count: counts.projects,
    },
    {
      icon: RotateCw,
      label: "Resale",
      href: "/admin/resale",
      count: counts.properties,
    },
    {
      icon: MessageSquare,
      label: "Enquiry",
      href: "/admin/enquiry",
      count: counts.enquiry,
    },
    {
      icon: BookA,
      label: "Manage Pages",
      href: "/admin/manage",
    },
    {
      icon: Image,
      label: "Popup",
      href: "/admin/popup",
    },
    {
      icon: FileText,
      label: "Blogs",
      href: "/admin/blogs",
    },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Amrapali Admin</h1>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            {typeof item.count === "number" && (
              <span className="ml-auto bg-blue-500 px-2 py-1 rounded-full text-xs">
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
