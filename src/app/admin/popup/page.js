"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

export default function PopupAdmin() {
  const router = useRouter();
  const [popups, setPopups] = useState([]);
  const [selectedPopup, setSelectedPopup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check authentication
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    };
    checkUser();

    // Fetch popups
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const { data, error } = await supabase
        .from("popup_amrapali")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPopups(data || []);
    } catch (error) {
      console.error("Error fetching popups:", error);
    }
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      const sanitizedFileName = sanitizeFileName(file.name);
      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(`public/${sanitizedFileName}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const publicURL = supabase.storage
        .from("property-images")
        .getPublicUrl(data.path).data.publicUrl;

      return publicURL;
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Error uploading image. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Upload image if a new file is selected
      let imageUrl = e.target.image.value;
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile);
        if (uploadedImageUrl) imageUrl = uploadedImageUrl;
      }

      const popupData = {
        title: e.target.title.value,
        text: e.target.text.value,
        image: imageUrl,
        link: e.target.link.value,
        is_enabled: e.target.is_enabled.checked,
      };

      let result;
      if (selectedPopup) {
        // Update existing popup
        result = await supabase
          .from("popup_amrapali")
          .update(popupData)
          .eq("id", selectedPopup.id);
      } else {
        // Create new popup
        result = await supabase.from("popup_amrapali").insert(popupData);
      }

      if (result.error) throw result.error;

      fetchPopups();
      setIsModalOpen(false);
      setSelectedPopup(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error saving popup:", error);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this popup?")) {
      try {
        const { error } = await supabase
          .from("popup_amrapali")
          .delete()
          .eq("id", id);

        if (error) throw error;
        fetchPopups();
      } catch (error) {
        console.error("Error deleting popup:", error);
      }
    }
  };

  const openEditModal = (popup) => {
    setSelectedPopup(popup);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Popup Management</h1>
          <button
            onClick={() => {
              setSelectedPopup(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="mr-2" /> Add New Popup
          </button>
        </div>

        {/* Popup Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Link</th>
                <th className="px-6 py-3 text-left">Enabled</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {popups.map((popup) => (
                <tr key={popup.id} className="border-b">
                  <td className="px-6 py-4">{popup.title}</td>
                  <td className="px-6 py-4">
                    <img
                      src={popup.image}
                      alt={popup.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">{popup.link}</td>
                  <td className="px-6 py-4">
                    {popup.is_enabled ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(popup)}
                      className="text-blue-600 hovered:text-blue-800 mr-4"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(popup.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Add/Edit Popup */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-6">
                {selectedPopup ? "Edit Popup" : "Add New Popup"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedPopup?.title || ""}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    defaultValue={selectedPopup?.image || ""}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image (Should be of ratio 16:9)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {isUploading && (
                    <div className="flex items-center justify-center mt-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
                      <span className="ml-2 text-blue-500">
                        Uploading image...
                      </span>
                    </div>
                  )}
                  {imageFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected file: {imageFile.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Link
                  </label>
                  <input
                    type="text"
                    name="link"
                    defaultValue={selectedPopup?.link || ""}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Text
                  </label>
                  <textarea
                    name="text"
                    defaultValue={selectedPopup?.text || ""}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="is_enabled"
                      defaultChecked={selectedPopup?.is_enabled ?? true}
                      className="mr-2 rounded border-gray-300"
                    />
                    Enable Popup
                  </label>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setImageFile(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {selectedPopup ? "Update" : "Create"} Popup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
