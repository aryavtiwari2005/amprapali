"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import PropertyTable from "@/components/admin/PropertyTable";
import PropertyForm from "@/components/admin/PropertyForm";

export default function AddProperty() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
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
      fetchProperties();
    }
  }, [showForm]);

  async function fetchProperties() {
    try {
      const { data, error } = await supabase
        .from("resale_amrapali")
        .select("*");

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(formData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (selectedProperty) {
        const { error } = await supabase
          .from("resale_amrapali")
          .update({
            ...formData,
          })
          .eq("id", selectedProperty.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("resale_amrapali").insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      }

      // Only close form and reset after successful submission
      setShowForm(false);
      setSelectedProperty(null);
      await fetchProperties();
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Error saving property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("resale_amrapali")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchProperties();
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error deleting property. Please try again.");
    }
  }

  const handleCancel = (e) => {
    if (e) {
      e.preventDefault();
    }
    setShowForm(false);
    setSelectedProperty(null);
  };

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
      <main className="flex-1 p-8 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Resale</h1>
          <div className="flex items-center space-x-4">
            {!showForm && (
              <button
                onClick={() => {
                  setSelectedProperty(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Add Property
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : showForm ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <PropertyForm
              property={selectedProperty}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <PropertyTable
              properties={properties}
              onEdit={(property) => {
                setSelectedProperty(property);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </div>
  );
}
