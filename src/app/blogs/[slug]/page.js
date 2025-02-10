"use client";
import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Share2, Image as ImageIcon } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabaseClient";

const BlogPost = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const routeParams = use(params);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs_amrapali")
          .select("*")
          .eq("slug", routeParams.slug)
          .single();

        if (error) throw error;
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (routeParams.slug) {
      fetchBlog();
    }
  }, [routeParams.slug]);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderHeroImage = () => {
    if (imageError || !blog.featured_image) {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-gray-400" />
        </div>
      );
    }

    return (
      <img
        src={blog.featured_image}
        alt={blog.title}
        onError={handleImageError}
        className="w-full h-full object-cover"
      />
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.meta_description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Blog post not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 py-20 pt-24 font-montserrat">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="relative h-[50vh] mb-8 rounded-2xl overflow-hidden shadow-xl">
            {renderHeroImage()}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {blog.title}
              </h1>
              <div className="flex gap-4 text-white/90">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(blog.published_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {blog.read_time} min read
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="
                  prose-headings:text-gray-800 
                  prose-headings:font-bold 
                  prose-p:text-gray-600 
                  prose-p:leading-relaxed
                  prose-a:text-btn-800 
                  prose-a:no-underline 
                  prose-a:font-medium
                  prose-blockquote:border-l-4 
                  prose-blockquote:border-btn-800
                  prose-blockquote:pl-4 
                  prose-code:bg-gray-100 
                  prose-code:rounded 
                  prose-code:px-1
                  prose-ul:list-disc 
                  prose-ol:list-decimal
                "
              />
            </div>

            <div className="mt-8 pt-8 border-t flex justify-between items-center">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-btn-800 text-white rounded-full hover:bg-btn-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share Article
              </button>
            </div>
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
