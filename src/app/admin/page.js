'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

const EditProperty = () => {
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
        images: ''
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            contact: formData.contact.split(',').map(item => item.trim()),
            images: formData.images.split(',').map(item => item.trim())
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

    const handleAddProperty = async (e) => {
        e.preventDefault();
        const newProperty = {
            ...formData,
            contact: formData.contact.split(',').map(item => item.trim()),
            images: formData.images.split(',').map(item => item.trim())
        };
        const { error } = await supabase.from('properties').insert([newProperty]);
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
            images: ''
        });
    };

    return (
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
            <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={selectedProperty ? handleSubmit : handleAddProperty}>
                <h2 className="text-xl font-semibold mb-4">{selectedProperty ? `Edit Property: ${formData.title}` : 'Add New Property'}</h2>
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Location"
                        required
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="beds"
                        type="number"
                        value={formData.beds}
                        onChange={handleChange}
                        placeholder="Beds"
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="baths"
                        type="number"
                        value={formData.baths}
                        onChange={handleChange}
                        placeholder="Baths"
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Area"
                        required
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price"
                        required
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="rating"
                        type="number"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        placeholder="Rating"
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Type"
                        required
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    <input
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Contact (comma separated)"
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        placeholder="Images (comma separated)"
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
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
            </form>
        </div>
    );
};

export default EditProperty;