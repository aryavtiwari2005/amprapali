// app/properties/[id]/page.js
"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import ProjectDetail from "@/components/ProjectDetail";

export default function PropertyPage({ params }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const routeParams = use(params);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("link", `/${routeParams.link}`);

        if (error) throw error;
        setProperty(data[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching property:", err);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [routeParams.link]);

  return (
    <ProjectDetail
      project={property}
      loading={loading}
      router={router}
      backLink="/properties"
    />
  );
}
