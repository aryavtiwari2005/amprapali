"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import LocationTable from "@/components/admin/LocationTable";

export default function LocationPage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLocation, setNewLocation] = useState({
    city: "",
    location: "",
  });

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
    fetchLocations();
  }, []);

  async function fetchLocations() {
    try {
      const { data, error } = await supabase
        .from("location_amrapali")
        .select("*");
      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this location?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("location_amrapali")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("Error deleting location. Please try again.");
    }
  }

  async function handleAddLocation() {
    if (!newLocation.city.trim() || !newLocation.location.trim()) {
      alert("City and Location cannot be empty.");
      return;
    }

    try {
      const { error } = await supabase
        .from("location_amrapali")
        .insert([{ city: newLocation.city, location: newLocation.location }]);

      if (error) throw error;
      setNewLocation({ city: "", location: "" });
      await fetchLocations();
    } catch (error) {
      console.error("Error adding location:", error);
      alert("Error adding location. Please try again.");
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
          <h1 className="text-2xl font-bold">Locations</h1>
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
            value={newLocation.city}
            onChange={(e) =>
              setNewLocation({ ...newLocation, city: e.target.value })
            }
            placeholder="Enter City"
            className="px-4 py-2 border rounded-md mr-2"
          />
          <input
            type="text"
            value={newLocation.location}
            onChange={(e) =>
              setNewLocation({ ...newLocation, location: e.target.value })
            }
            placeholder="Enter Location"
            className="px-4 py-2 border rounded-md mr-2"
          />
          <button
            onClick={handleAddLocation}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Location
          </button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <LocationTable locations={locations} onDelete={handleDelete} />
          </div>
        )}
      </main>
    </div>
  );
}
