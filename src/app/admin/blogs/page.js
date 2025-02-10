"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, Clock, Calendar } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import RichTextEditor from "@/components/RichTextEditor";

export default function BlogAdmin() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState(selectedBlog?.content || "");

  useEffect(() => {
    // Check authentication
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    };
    checkUser();

    // Fetch blogs
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs_amrapali")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      const sanitizedFileName = sanitizeFileName(file.name);
      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(`blog/${sanitizedFileName}`, file, {
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
      let imageUrl = e.target.featured_image.value;
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile);
        if (uploadedImageUrl) imageUrl = uploadedImageUrl;
      }

      const title = e.target.title.value;
      const blogData = {
        title,
        slug: selectedBlog?.slug || generateSlug(title),
        content: content,
        featured_image: imageUrl,
        meta_description: e.target.meta_description.value,
        read_time: parseInt(e.target.read_time.value) || 0,
        published_at: e.target.published_at.value || new Date().toISOString(),
      };

      let result;
      if (selectedBlog) {
        // Update existing blog
        result = await supabase
          .from("blogs_amrapali")
          .update(blogData)
          .eq("id", selectedBlog.id);
      } else {
        // Create new blog
        result = await supabase.from("blogs_amrapali").insert(blogData);
      }

      if (result.error) throw result.error;

      fetchBlogs();
      setIsModalOpen(false);
      setSelectedBlog(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Error saving blog. Please try again.");
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
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const { error } = await supabase
          .from("blogs_amrapali")
          .delete()
          .eq("id", id);

        if (error) throw error;
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <button
            onClick={() => {
              setSelectedBlog(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="mr-2" /> Add New Blog
          </button>
        </div>

        {/* Blog Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Published</th>
                <th className="px-6 py-3 text-left">Read Time</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b">
                  <td className="px-6 py-4">
                    <div className="font-medium">{blog.title}</div>
                    <div className="text-sm text-gray-500">{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    {blog.featured_image && (
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">{formatDate(blog.published_at)}</td>
                  <td className="px-6 py-4">{blog.read_time} min</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(blog)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
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

        {/* Modal for Add/Edit Blog */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">
                {selectedBlog ? "Edit Blog Post" : "Add New Blog Post"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedBlog?.title || ""}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    name="featured_image"
                    defaultValue={selectedBlog?.featured_image || ""}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Featured Image
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Published At
                    </label>
                    <input
                      type="datetime-local"
                      name="published_at"
                      defaultValue={
                        selectedBlog?.published_at
                          ? new Date(selectedBlog.published_at)
                              .toISOString()
                              .slice(0, 16)
                          : new Date().toISOString().slice(0, 16)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Read Time (minutes)
                    </label>
                    <input
                      type="number"
                      name="read_time"
                      defaultValue={selectedBlog?.read_time || ""}
                      min="1"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <textarea
                    name="meta_description"
                    defaultValue={selectedBlog?.meta_description || ""}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <RichTextEditor
                    content={selectedBlog?.content || ""}
                    onChange={(newContent) => setContent(newContent)}
                  />
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
                    {selectedBlog ? "Update" : "Create"} Blog Post
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
