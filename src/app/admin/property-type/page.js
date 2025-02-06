"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import PropertyTypeTable from "@/components/admin/PropertyTypeTable";

export default function PropertyTypePage() {
  const router = useRouter();
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPropertyType, setNewPropertyType] = useState("");

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
    fetchPropertyTypes();
  }, []);

  async function fetchPropertyTypes() {
    try {
      const { data, error } = await supabase
        .from("property_type_amrapali")
        .select("*");
      if (error) throw error;
      setPropertyTypes(data || []);
    } catch (error) {
      console.error("Error fetching property types:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm("Are you sure you want to delete this property type?")
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("property_type_amrapali")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchPropertyTypes();
    } catch (error) {
      console.error("Error deleting property type:", error);
      alert("Error deleting property type. Please try again.");
    }
  }

  async function handleAddPropertyType() {
    if (!newPropertyType.trim()) {
      alert("Property type cannot be empty.");
      return;
    }

    try {
      const { error } = await supabase
        .from("property_type_amrapali")
        .insert([{ property_type: newPropertyType }]);

      if (error) throw error;
      setNewPropertyType("");
      await fetchPropertyTypes();
    } catch (error) {
      console.error("Error adding property type:", error);
      alert("Error adding property type. Please try again.");
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
          <h1 className="text-2xl font-bold">Property Types</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={newPropertyType}
            onChange={(e) => setNewPropertyType(e.target.value)}
            placeholder="Enter new property type"
            className="px-4 py-2 border rounded-md mr-2"
          />
          <button
            onClick={handleAddPropertyType}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Property Type
          </button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <PropertyTypeTable
              propertyTypes={propertyTypes}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </div>
  );
}
