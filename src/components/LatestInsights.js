"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";

const LatestInsights = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUnderConstructionProjects();
  }, []);

  async function fetchUnderConstructionProjects() {
    try {
      // First get the under construction project IDs
      const { data: featuredData, error: featuredError } = await supabase
        .from("featured_projects_amrapali")
        .select("project_id")
        .eq("type", "under_construction")
        .order("id", { ascending: true });

      if (featuredError) throw featuredError;

      // Then fetch the full project details for these IDs
      if (featuredData && featuredData.length > 0) {
        const projectIds = featuredData.map((fp) => fp.project_id);
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .in("id", projectIds);

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
      }
    } catch (error) {
      console.error("Error fetching under construction projects:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto py-20 px-6"
    >
      <div className="text-center mb-10">
        <motion.h2 className="text-4xl font-bold mb-2 font-roboto tracking-tight text-gray-900">
          Under Construction Projects
        </motion.h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg"
          >
            <div className="relative h-60">
              <img
                src={project.image_url || "/placeholder-project.jpg"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 font-montserrat text-gray-900">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4 font-inter">
                {projects.indexOf(project) === 0
                  ? "Discover the latest amenities and features in our upcoming project..."
                  : projects.indexOf(project) === 1
                  ? "Explore the latest construction updates and project details..."
                  : "Get the latest insights on the upcoming project..."}
              </p>
              <button
                className="text-orange-500 font-medium flex items-center group font-roboto"
                onClick={
                  projects.link
                    ? () => {
                        window.open(`/projects${project.link}`, "_blank");
                      }
                    : null
                }
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default LatestInsights;
