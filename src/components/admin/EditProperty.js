"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const PropertyAnalytics = ({ properties }) => {
    // Property Type Distribution
    const propertyTypeData = {
        labels: ['Lowrise Apartment', 'Flat', 'Villa'],
        datasets: [{
            data: [
                properties.filter(p => p.type.toLowerCase() === 'lowrise apartment').length,
                properties.filter(p => p.type.toLowerCase() === 'flat').length,
                properties.filter(p => p.type.toLowerCase() === 'villa').length,
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)'
            ]
        }]
    };

    // Price Range Distribution
    const priceRangeData = {
        labels: ['0-1cr', '1cr-2cr', '2cr-3cr', '3cr+'],
        datasets: [{
            label: 'Property Prices',
            data: [
                properties.filter(p => parseFloat(p.price) < 10000000).length,
                properties.filter(p => parseFloat(p.price) >= 10000000 && parseFloat(p.price) < 20000000).length,
                properties.filter(p => parseFloat(p.price) >= 20000000 && parseFloat(p.price) < 30000000).length,
                properties.filter(p => parseFloat(p.price) >= 30000000).length
            ],
            backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }]
    };

    // Location Distribution
    const locationData = {
        labels: [...new Set(properties.map(p => p.location))].slice(0, 5),
        datasets: [{
            label: 'Properties by Location',
            data: [...new Set(properties.map(p => p.location))]
                .slice(0, 5)
                .map(location => properties.filter(p => p.location === location).length),
            backgroundColor: 'rgba(255, 159, 64, 0.6)'
        }]
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Property Type Distribution</h3>
                <Pie data={propertyTypeData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Price Range Distribution</h3>
                <Bar data={priceRangeData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Properties by Location</h3>
                <Doughnut data={locationData} />
            </div>
        </div>
    );
};

const EditProperty = () => {
    const [user, setUser ] = useState(null);
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        beds: '',
        baths: '',
        area: '',
        price: '',
        rating: 4.5,
        type: '',
        description: '',
        contact: '',
        images: []
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const formatPrice = (price) => {
        const priceNum = parseFloat(price);
        
        if (priceNum >= 10000000) {
            return `₹${(priceNum / 10000000).toFixed(2)} Cr`;
        } else if (priceNum >= 100000) {
            return `₹${(priceNum / 100000).toFixed(2)} Lakhs`;
        } else {
            return `₹${priceNum.toLocaleString()}`;
        }
    };

    useEffect(() => {
        const checkUser  = async () => {
            const { data: { user } } = await supabase.auth.getUser ();
            if (!user) {
                router.push('/login');
            } else {
                setUser (user);
            }
        };
        checkUser ();
    }, [router]);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        const { data, error } = await supabase.from('properties').select('*');
        if (error) console.error(error);
        else setProperties(data);
    };

    const handleEdit = (property) => {
        setSelectedProperty(property);
        setFormData({
            ...property,
            contact: Array.isArray(property.contact) ? property.contact.join(', ') : '',
            images: Array.isArray(property.images) ? property.images.join(', ') : ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setImageFiles(Array.from(e.target.files));
    };

    const sanitizeFileName = (fileName) => {
        return fileName.replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace invalid characters with underscores
    };

    const uploadImages = async () => {
        setIsUploading(true);
        const imageUrls = [];
        try {
            for (const file of imageFiles) {
                const sanitizedFileName = sanitizeFileName(file.name); // Sanitize the file name
                console.log('Uploading file:', sanitizedFileName); // Log the sanitized file name
                const { data, error } = await supabase.storage
                    .from('property-images')
                    .upload(`public/${sanitizedFileName}`, file, {
                        cacheControl: '3600',
                        upsert: true // Overwrite if the file already exists
                    });

                if (error) {
                    console.error('Error uploading image:', error.message); // Log the error message
                    return; // Exit the function if there's an error
                }

                const publicURL = supabase.storage.from('property-images').getPublicUrl(data.path).data.publicUrl;
                console.log('Public URL:', publicURL); // Log the public URL
                imageUrls.push(publicURL); // Push the public URL to the array
            }
            return imageUrls;
        } catch (error) {
            console.error('Upload failed:', error);
            return [];
        } finally {
            setIsUploading(false);
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setImageFiles([]);
        }
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        const uploadedImageUrls = await uploadImages();
        const newProperty = {
            ...formData,
            contact: formData.contact.split(',').map(item => item.trim()),
            images: uploadedImageUrls // Use uploaded image URLs
        };
        const { error } = await supabase.from('properties').insert([newProperty]);
        if (error) console.error(error);
        else {
            fetchProperties();
            resetForm();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uploadedImageUrls = await uploadImages();
        const updatedData = {
            ...formData,
            contact: formData.contact.split(',').map(item => item.trim()),
            images: uploadedImageUrls // Use uploaded image URLs
        };
        const { error } = await supabase
            .from('properties')
            .update(updatedData)
            .eq('id', selectedProperty.id);
        if (error) console.error(error);
        else {
            fetchProperties();
            resetForm();
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (error) console.error(error);
        else fetchProperties();
    };

    const resetForm = () => {
        setSelectedProperty(null);
        setFormData({
            title: '',
            location: '',
            beds: '',
            baths: '',
            area: '',
            price: '',
            rating: 4.5,
            type: '',
            description: '',
            contact: '',
            images: []
        });
        setImageFiles([]);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login'); // Redirect to login after logout
    };

    // Analytics data
    const totalProperties = properties.length;
    const averagePrice = properties.length > 0 ? (properties.reduce((acc, property) => acc + parseFloat(property.price), 0) / totalProperties).toFixed(2) : 0;
    const averageRating = properties.length > 0 ? (properties.reduce((acc, property) => acc + property.rating, 0) / totalProperties).toFixed(1) : 0;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Property Management Dashboard</h1>
            
            {/* Analytics Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Analytics Overview</h2>
                <PropertyAnalytics properties={properties} />
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Properties</h3>
                    <p className="text-3xl font-bold text-blue-600">{properties.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Average Property Price</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {formatPrice((properties.reduce((sum, p) => sum + parseFloat(p.price), 0) / properties.length).toFixed(2))}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Highest Rated Property</h3>
                    <p className="text-3xl font-bold text-yellow-600">
                        {properties.length > 0 ? 
                            properties.reduce((max, p) => p.rating > max.rating ? p : max).title 
                            : 'N/A'}
                    </p>
                </div>
            </div>

            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Edit Properties</h1>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Available Properties</h2>
                    <ul className="space-y-2">
                        {properties.map(property => (
                            <li key={property.id} className="flex justify-between items-center p-4 border rounded-lg shadow hover:shadow-lg transition">
                                <span className="text-lg">{property.title}</span>
                                <div>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                                        onClick={() => handleEdit(property)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                        onClick={() => handleDelete(property.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={selectedProperty ? handleSubmit : handleAddProperty}>
                <h2 className="text-xl font-semibold mb-4">{selectedProperty ? `Edit Property: ${formData.title}` : 'Add New Property'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(formData).map((key) => (
                        key !== 'contact' && key !== 'images' ? (
                            <input
                                key={key}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                required={key !== 'description' || key !== 'contact'}
                                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <textarea
                                key={key}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1) + ' (comma separated)'}
                                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )
                    ))}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="mt-4 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isUploading && (
                    <div className="flex items-center justify-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
                        <span className="ml-2 text-blue-500">Uploading images...</span>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isUploading}
                    className={`mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {selectedProperty ? 'Update Property' : 'Add Property'}
                </button>
                {selectedProperty && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="mt-4 ml-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                    >
                        Add New Property
                    </button>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mx-4"
                >
                    Logout
                </button>
            </form>
        </div>
    );
};

export default EditProperty;