"use client";
import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  Share2,
  Image as ImageIcon,
  Send,
  MapPin,
  Home,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

const BlogPost = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const routeParams = use(params);

  // Auto-scroll carousel
  useEffect(() => {
    let interval;
    if (!isCarouselPaused && relatedBlogs.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % relatedBlogs.length);
      }, 3000); // Change slide every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isCarouselPaused, relatedBlogs.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main blog
        const { data: blogData } = await supabase
          .from("blogs_amrapali")
          .select("*")
          .eq("slug", routeParams.slug)
          .single();

        // Fetch related blogs
        const { data: relatedData } = await supabase
          .from("blogs_amrapali")
          .select("*")
          .neq("slug", routeParams.slug)
          .limit(5);

        // Fetch projects
        const { data: projectsData } = await supabase
          .from("projects")
          .select("*")
          .limit(3);

        setBlog(blogData);
        setRelatedBlogs(relatedData || []);
        setProjects(projectsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (routeParams.slug) {
      fetchData();
    }
  }, [routeParams.slug]);

  const handleImageError = () => setImageError(true);

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await supabase.from("contacts").insert([
        {
          ...contactForm,
          url: window.location.href,
        },
      ]);
      setContactForm({ name: "", email: "", mobile: "", message: "" });
      alert("Thank you for contacting us!");
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800" />
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

      <div className="max-w-7xl mx-auto px-4 py-20 pt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <motion.article
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-[40vh]">
              {!imageError && blog.featured_image ? (
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
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

            {/* Blog Content */}
            <div className="p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              <div className="mt-8 pt-8 border-t">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-btn-800 text-white rounded-full hover:bg-btn-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Sidebar - Right Side */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Related Blogs Carousel */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
              <div
                className="relative"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
              >
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {relatedBlogs.map((relatedBlog) => (
                      <div
                        key={relatedBlog.id}
                        className="w-full flex-shrink-0 p-2"
                      >
                        <a
                          href={`/blogs/${relatedBlog.slug}`}
                          className="block group"
                        >
                          <div className="aspect-video relative rounded-lg overflow-hidden mb-2">
                            {relatedBlog.featured_image ? (
                              <img
                                src={relatedBlog.featured_image}
                                alt={relatedBlog.title}
                                className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-btn-800 transition-colors">
                            {relatedBlog.title}
                          </h3>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {relatedBlogs.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentSlide === idx
                          ? "bg-btn-800"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={() => {
                        setCurrentSlide(idx);
                        setIsCarouselPaused(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Projects */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <a
                    key={project.id}
                    href={`/projects${project.link}`}
                    className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        {project.images?.[0] ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Home className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {project.title}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {project.location}
                        </div>
                        <div className="text-btn-800 font-medium mt-1">
                          ₹{project.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-btn-800"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-btn-800"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={contactForm.mobile}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, mobile: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-btn-800"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-btn-800 h-32 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-btn-800 text-white rounded-lg hover:bg-btn-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
