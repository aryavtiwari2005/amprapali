"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import ProjectTable from "@/components/admin/ProjectsTable";
import ProjectForm from "@/components/admin/ProjectForm";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication check
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      }
    };
    checkUser();
  }, []);

  // Fetch projects
  useEffect(() => {
    if (!showForm) {
      fetchProjects();
    }
  }, [showForm]);

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

  async function handleSubmit(formData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (selectedProject) {
        const { error } = await supabase
          .from("projects")
          .update({
            ...formData,
          })
          .eq("id", selectedProject.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      }

      // Only close form and reset after successful submission
      setShowForm(false);
      setSelectedProject(null);
      await fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
      await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project. Please try again.");
    }
  }

  const handleCancel = (e) => {
    if (e) {
      e.preventDefault();
    }
    setShowForm(false);
    setSelectedProject(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Projects</h1>
            {!showForm && (
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Add Project
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
            </div>
          ) : showForm ? (
            <div className="bg-white rounded-lg shadow p-6">
              <ProjectForm
                project={selectedProject}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            </div>
          ) : (
            <ProjectTable
              projects={projects}
              onEdit={(project) => {
                setSelectedProject(project);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
