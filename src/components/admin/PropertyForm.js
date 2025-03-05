"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import RichTextEditor from "../RichTextEditor";

export default function PropertyForm({
  property,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(
    property || {
      title: "",
      resale_id: "",
      beds: null,
      baths: null,
      cars: null,
      project_name: "",
      floor: null,
      description: "",
      price: null,
      type: "",
      location: "",
      link: "",
      images: [],
    }
  );

  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("title, type, location"); // Fetch project title, type, and location

        if (error) throw error;

        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedImageUrls = await uploadImages();
    const newProperty = {
      ...formData,
      images: uploadedImageUrls,
    };
    onSubmit(newProperty);
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_"); // Replace invalid characters with underscores
  };

  const uploadImages = async () => {
    setIsUploading(true);
    const imageUrls = [];
    try {
      for (const file of imageFiles) {
        const sanitizedFileName = sanitizeFileName(file.name);
        const { data, error } = await supabase.storage
          .from("property-images")
          .upload(`public/${sanitizedFileName}`, file, {
            cacheControl: "3600",
            upsert: true, // Overwrite if the file already exists
          });

        if (error) {
          console.error("Error uploading image:", error.message);
          return []; // Exit the function if there's an error
        }

        const publicURL = supabase.storage
          .from("property-images")
          .getPublicUrl(data.path).data.publicUrl;
        imageUrls.push(publicURL);
      }
      return imageUrls;
    } catch (error) {
      console.error("Upload failed:", error);
      return [];
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageFiles([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resale ID
          </label>
          <input
            type="text"
            required
            value={formData.resale_id}
            onChange={(e) =>
              setFormData({ ...formData, resale_id: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Beds
          </label>
          <input
            type="number"
            value={formData.beds || ""}
            onChange={(e) =>
              setFormData({ ...formData, beds: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Baths
          </label>
          <input
            type="number"
            value={formData.baths || ""}
            onChange={(e) =>
              setFormData({ ...formData, baths: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cars
          </label>
          <input
            type="number"
            value={formData.cars || ""}
            onChange={(e) =>
              setFormData({ ...formData, cars: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <select
            required
            value={formData.project_name}
            onChange={(e) => {
              const selectedProject = projects.find(
                (project) => project.title === e.target.value
              );
              setFormData({
                ...formData,
                project_name: e.target.value,
                type: selectedProject ? selectedProject.type : "",
                location: selectedProject ? selectedProject.location : "",
              });
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.title} value={project.title}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Floor
          </label>
          <input
            type="number"
            value={formData.floor || ""}
            onChange={(e) =>
              setFormData({ ...formData, floor: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <RichTextEditor
            content={formData.description}
            onChange={(newContent) =>
              setFormData({ ...formData, description: newContent })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={"http://localhost:3000/properties"}
              className="mt-1 w-full block rounded-md border border-gray-300 px-3 py-2 cursor-not-allowed"
              editable={false}
            />
            <input
              type="text"
              value={formData.link || ""}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Images (comma separated)
          </label>
          <input
            type="text"
            value={formData.images.join(",")}
            onChange={(e) =>
              setFormData({ ...formData, images: e.target.value.split(",") })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter image URLs separated by commas"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Images (Could be of any ratio)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {isUploading && (
          <div className="flex items-center justify-center mt-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
            <span className="ml-2 text-blue-500">Uploading images...</span>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {property ? "Update" : "Create"} Property
        </button>
      </div>
    </form>
  );
}
