// app/projects/[id]/page.js
"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import ProjectDetail from "@/components/ProjectDetail";

export default function ProjectPage({ params }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const routeParams = use(params);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("link", `/${routeParams.link}`);

        if (error) throw error;
        setProject(data[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project:", err);
        setLoading(false);
      }
    };

    fetchProject();
  }, [routeParams.link]);

  return (
    <ProjectDetail
      project={project}
      loading={loading}
      router={router}
      backLink="/projects"
    />
  );
}
