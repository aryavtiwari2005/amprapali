"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export default function ManageProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  // Featured projects state
  const [selectedProject1, setSelectedProject1] = useState("");
  const [selectedProject2, setSelectedProject2] = useState("");
  // Under construction projects state
  const [underConstruction1, setUnderConstruction1] = useState("");
  const [underConstruction2, setUnderConstruction2] = useState("");
  const [underConstruction3, setUnderConstruction3] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      }
    };
    checkUser();
    fetchProjects();
    fetchFeaturedProjects();
    fetchUnderConstructionProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchFeaturedProjects() {
    try {
      const { data, error } = await supabase
        .from("featured_projects_amrapali")
        .select("project_id")
        .eq("type", "featured")
        .order("id", { ascending: true });

      if (error) throw error;

      if (data.length >= 1) setSelectedProject1(data[0].project_id);
      if (data.length >= 2) setSelectedProject2(data[1].project_id);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
    }
  }

  async function fetchUnderConstructionProjects() {
    try {
      const { data, error } = await supabase
        .from("featured_projects_amrapali")
        .select("project_id")
        .eq("type", "under_construction")
        .order("id", { ascending: true });

      if (error) throw error;

      if (data.length >= 1) setUnderConstruction1(data[0].project_id);
      if (data.length >= 2) setUnderConstruction2(data[1].project_id);
      if (data.length >= 3) setUnderConstruction3(data[2].project_id);
    } catch (error) {
      console.error("Error fetching under construction projects:", error);
    }
  }

  async function handleSaveFeaturedProjects() {
    if (!selectedProject1 || !selectedProject2) {
      alert("Please select both featured projects.");
      return;
    }

    try {
      // Delete existing featured projects
      const { error: deleteError } = await supabase
        .from("featured_projects_amrapali")
        .delete()
        .neq("project_id", null)
        .eq("type", "featured");

      if (deleteError) throw deleteError;

      // Insert new featured projects
      const { error: insertError } = await supabase
        .from("featured_projects_amrapali")
        .insert([
          { project_id: selectedProject1, type: "featured" },
          { project_id: selectedProject2, type: "featured" },
        ]);

      if (insertError) throw insertError;

      alert("Featured projects updated successfully!");
    } catch (error) {
      console.error("Error updating featured projects:", error);
      alert("Error updating featured projects. Please try again.");
    }
  }

  async function handleSaveUnderConstruction() {
    if (!underConstruction1 || !underConstruction2 || !underConstruction3) {
      alert("Please select all three under construction projects.");
      return;
    }

    // Check for duplicate selections
    const selections = [
      underConstruction1,
      underConstruction2,
      underConstruction3,
    ];
    if (new Set(selections).size !== selections.length) {
      alert("Please select different projects for each position.");
      return;
    }

    try {
      // Delete existing under construction projects
      const { error: deleteError } = await supabase
        .from("featured_projects_amrapali")
        .delete()
        .neq("project_id", null)
        .eq("type", "under_construction");

      if (deleteError) throw deleteError;

      // Insert new under construction projects
      const { error: insertError } = await supabase
        .from("featured_projects_amrapali")
        .insert([
          { project_id: underConstruction1, type: "under_construction" },
          { project_id: underConstruction2, type: "under_construction" },
          { project_id: underConstruction3, type: "under_construction" },
        ]);

      if (insertError) throw insertError;

      alert("Under construction projects updated successfully!");
    } catch (error) {
      console.error("Error updating under construction projects:", error);
      alert("Error updating under construction projects. Please try again.");
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Projects</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Featured Projects Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select First Featured Project
              </label>
              <select
                value={selectedProject1}
                onChange={(e) => setSelectedProject1(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Second Featured Project
              </label>
              <select
                value={selectedProject2}
                onChange={(e) => setSelectedProject2(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSaveFeaturedProjects}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Featured Projects
          </button>
        </div>

        {/* Under Construction Projects Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Under Construction Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select First Project
              </label>
              <select
                value={underConstruction1}
                onChange={(e) => setUnderConstruction1(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Second Project
              </label>
              <select
                value={underConstruction2}
                onChange={(e) => setUnderConstruction2(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Third Project
              </label>
              <select
                value={underConstruction3}
                onChange={(e) => setUnderConstruction3(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSaveUnderConstruction}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Under Construction Projects
          </button>
        </div>

        {isLoading && <div className="mt-4">Loading...</div>}
      </main>
    </div>
  );
}
