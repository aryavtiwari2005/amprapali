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
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const { data, error } = await supabase.from("properties").select("*");
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
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
      <main className="flex-1 p-8 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Properties</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setSelectedProperty(null);
                setShowForm(true);
              }}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Property
            </button>
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
              onSubmit={() => {}}
              onCancel={() => {
                setShowForm(false);
                setSelectedProperty(null);
              }}
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
              onDelete={() => {}}
            />
          </div>
        )}
      </main>
    </div>
  );
}
