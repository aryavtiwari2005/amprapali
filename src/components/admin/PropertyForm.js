import { useState, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function PropertyForm({ property, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    property || {
      title: "",
      location: "",
      beds: null,
      baths: null,
      area: "",
      price: 0,
      rating: 4.5,
      type: "",
      description: "",
      contact: "",
      images: [],
    }
  );

  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedImageUrls = await uploadImages();
    const newProperty = {
      ...formData,
      contact:
        typeof formData.contact === "string"
          ? formData.contact.split(",").map((item) => item.trim())
          : formData.contact,
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
            Location
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Area
          </label>
          <input
            type="text"
            required
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Contact (comma separated)
          </label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter contacts separated by commas"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Images (comma separated)
          </label>
          <input
            type="text"
            value={formData.images}
            onChange={(e) =>
              setFormData({ ...formData, images: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter images separated by commas"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Images
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
