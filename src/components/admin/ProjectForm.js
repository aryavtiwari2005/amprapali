import { useState, useRef, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import RichTextEditor from "../RichTextEditor";

const ProjectForm = ({ project, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(
    project
      ? {
          ...project,
          faq_questions: project.faq_questions.join(","), // Convert array to string
          faq_answers: project.faq_answers.join(","), // Convert array to string
        }
      : {
          title: "",
          location: "",
          price: "",
          type: "",
          description: "",
          images: [],
          link: "",
          master_plan: "",
          location_map: "",
          floor_map: [],
          faq_questions: "", // Initialize as string
          faq_answers: "", // Initialize as string
          rera: "",
          rera_qr: "",
        }
  );

  const [floorMapFiles, setFloorMapFiles] = useState([]);
  const [masterPlanFiles, setMasterPlanFiles] = useState([]);
  const [locationMapFiles, setLocationMapFiles] = useState([]);
  const [reraQrFiles, setReraQrFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const floorMapInputRef = useRef(null);
  const masterPlanInputRef = useRef(null);
  const locationMapInputRef = useRef(null);
  const reraQrInputRef = useRef(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  // Prevent form submission while uploading images
  const isProcessing = isUploading || isSubmitting;

  // Fetch locations from Supabase
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from("location_amrapali")
          .select("*"); // Fetch all columns

        if (error) throw error;

        // Set the fetched data to state
        setLocations(data || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from("property_type_amrapali")
          .select("property_type"); // Fetch only the `property_type` column

        if (error) throw error;

        // Set the fetched data to state
        setPropertyTypes(data);
      } catch (error) {
        console.error("Error fetching property types:", error);
      }
    };

    fetchPropertyTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsUploading(true);
    try {
      const uploadedImageUrls = await uploadImages(imageFiles);
      const uploadedFloorMapUrls = await uploadImages(floorMapFiles);
      const uploadedMasterPlanUrl = await uploadImages(masterPlanFiles);
      const uploadedLocationMapUrl = await uploadImages(locationMapFiles);
      const uploadedReraQrUrl = await uploadImages(reraQrFiles);
      const newProject = {
        ...formData,
        faq_questions: formData.faq_questions.split(","),
        faq_answers: formData.faq_answers.split(","),
        images: [...(formData.images || []), ...uploadedImageUrls],
        floor_map: [...(formData.floor_map || []), ...uploadedFloorMapUrls],
        master_plan: uploadedMasterPlanUrl[0],
        location_map: uploadedLocationMapUrl[0],
        rera_qr: uploadedReraQrUrl[0],
      };

      await onSubmit(newProject);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleFloorMapChange = (e) => {
    setFloorMapFiles(Array.from(e.target.files));
  };

  const handleMasterPlanChange = (e) => {
    setMasterPlanFiles(Array.from(e.target.files));
  };

  const handleLocationMapChange = (e) => {
    setLocationMapFiles(Array.from(e.target.files));
  };

  const handleReraQrChange = (e) => {
    setReraQrFiles(Array.from(e.target.files));
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  };

  const uploadImages = async (files) => {
    if (!files.length) return [];

    const imageUrls = [];
    try {
      for (const file of files) {
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
        imageUrls.push(publicURL);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Error uploading images. Please try again.");
    }
    return imageUrls;
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
          <select
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select Location</option>
            {/* Dynamically render options from the fetched data */}
            {locations.map((location) => (
              <option
                key={location.id}
                value={`${location.location}, ${location.city}`}
              >
                {location.location}, {location.city}
              </option>
            ))}
          </select>
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
            {propertyTypes.map((propertyType) => (
              <option
                key={propertyType.property_type}
                value={propertyType.property_type}
              >
                {propertyType.property_type}
              </option>
            ))}
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
            RERA
          </label>
          <input
            type="text"
            required
            value={formData.rera}
            onChange={(e) => setFormData({ ...formData, rera: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload RERA QR Code
          </label>
          <input
            ref={reraQrInputRef}
            type="file"
            onChange={handleReraQrChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">URL</label>
          <input
            type="text"
            required
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
            FAQ Questions (Comma Seperated)
          </label>
          <input
            type="text"
            value={formData.faq_questions}
            onChange={(e) =>
              setFormData({ ...formData, faq_questions: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter faq questions separated by comma"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            FAQ Answers (Comma Seperated)
          </label>
          <input
            type="text"
            value={formData.faq_answers}
            onChange={(e) =>
              setFormData({ ...formData, faq_answers: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter faq answers separated by commma"
          />
        </div>

        <div className="col-span-2">
          <div className="col-span-2 mt-6">
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

        <div className="col-span-2">
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

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Floor map (comma separated)
          </label>
          <input
            type="text"
            value={formData.floor_map}
            onChange={(e) =>
              setFormData({ ...formData, floor_map: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter images separated by commas"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Floor Map &nbsp;
            <b>
              Make sure to upload images in this certain file format eg,
              "3BHK+2T+3S-1200SqFt.jpg" or "2BHK+2Study+3S-1215SqFt.jpg"
            </b>
          </label>
          <input
            ref={floorMapInputRef}
            type="file"
            multiple
            onChange={handleFloorMapChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {isUploading && (
            <div className="flex items-center justify-center mt-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
              <span className="ml-2 text-blue-500">Uploading images...</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Master Plan
          </label>
          <input
            type="text"
            value={formData.master_plan}
            onChange={(e) =>
              setFormData({ ...formData, master_plan: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter images separated by commas"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Master Plan
          </label>
          <input
            ref={masterPlanInputRef}
            type="file"
            multiple
            onChange={handleMasterPlanChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {isUploading && (
            <div className="flex items-center justify-center mt-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
              <span className="ml-2 text-blue-500">Uploading images...</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location Map
          </label>
          <input
            type="text"
            value={formData.location_map}
            onChange={(e) =>
              setFormData({ ...formData, location_map: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter images separated by commas"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Location Map
          </label>
          <input
            ref={locationMapInputRef}
            type="file"
            multiple
            onChange={handleLocationMapChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {isUploading && (
            <div className="flex items-center justify-center mt-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
              <span className="ml-2 text-blue-500">Uploading images...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
              Processing...
            </span>
          ) : project ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
