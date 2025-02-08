"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        // Fetch featured projects
        const { data: featuredData, error: featuredError } = await supabase
          .from("featured_projects_amrapali")
          .select("project_id")
          .eq("type", "featured")
          .order("id", { ascending: true }); // Ensure consistent order

        if (featuredError) throw featuredError;

        // Fetch project details for featured projects
        const projectIds = featuredData.map((item) => item.project_id);
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .in("id", projectIds);

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Error fetching featured projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-gray-800"></div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="text-center text-gray-600">
        No featured projects found.
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto py-12 px-6"
    >
      <div className="text-center mb-10 font-roboto">
        <motion.h2 className="text-4xl font-roboto font-bold mb-4 text-gray-800 tracking-tight">
          Our Projects
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="relative overflow-hidden rounded-lg"
          >
            <img
              src={project.images[0] || "/default-project.jpg"}
              alt={project.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-white text-2xl font-bold mb-2">
                {project.title}
              </h3>
              <p className="text-white mb-4">{project.location}</p>
              <button
                className="bg-white text-black px-6 py-2 rounded-full"
                onClick={
                  project.link
                    ? () => window.open(`/projects${project.link}`, "_blank")
                    : null
                }
              >
                Learn More
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;
