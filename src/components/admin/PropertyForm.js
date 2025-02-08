"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Link as LinkIcon,
  Palette,
  Highlighter,
  Type,
  Undo,
  Redo,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  if (!editor) {
    return null;
  }

  const colors = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
  ];

  const fontSizes = [
    "8px",
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
  ];

  const setLink = () => {
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-300 p-2">
      <div className="flex flex-wrap gap-2">
        {/* Text Style Controls */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("underline") ? "bg-gray-200" : ""
            }`}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
        </div>

        {/* Alignment Controls */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
            }`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
            }`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
            }`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>

        {/* List Controls */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        {/* Format Controls */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
            }`}
            title="Heading"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("blockquote") ? "bg-gray-200" : ""
            }`}
            title="Quote"
          >
            <Quote size={16} />
          </button>
        </div>

        {/* Color Controls */}
        <div className="flex gap-1 border-r pr-2 relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-gray-100"
            title="Text Color"
          >
            <Palette size={16} />
          </button>
          <button
            type="button"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            className="p-2 rounded hover:bg-gray-100"
            title="Highlight Color"
          >
            <Highlighter size={16} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white shadow-lg rounded-lg z-10 grid grid-cols-10 gap-1">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white shadow-lg rounded-lg z-10 grid grid-cols-10 gap-1">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setHighlight({ color }).run();
                    setShowHighlightPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Font Size Control
        <div className="flex gap-1 border-r pr-2 relative">
          <button
            type="button"
            onClick={() => setShowFontSize(!showFontSize)}
            className="p-2 rounded hover:bg-gray-100"
            title="Font Size"
          >
            <Type size={16} />
          </button>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white shadow-lg rounded-lg z-10">
              {fontSizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    editor.chain().focus().setFontSize(size).run();
                    setShowFontSize(false);
                  }}
                >
                  <span style={{ fontSize: size }}>{size}</span>
                </button>
              ))}
            </div>
          )}
        </div> */}

        {/* Link Control */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("link") ? "bg-gray-200" : ""
            }`}
            title="Add Link"
          >
            <LinkIcon size={16} />
          </button>
        </div>

        {/* Undo/Redo Controls */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="rich-text-editor border border-gray-300 rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
    </div>
  );
};

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
