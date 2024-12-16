import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import templates from './smart_contract_templates_updated.json'; // Import the JSON file

const TemplatePage = () => {
    const [templateData] = useState(templates); // Directly set the templates data
    const navigate = useNavigate(); // Updated to useNavigate

    const handleCardClick = (templateName) => {
        // Redirect to the buildcontract page when a card is clicked
        navigate(`/buildcontract?template=${templateName}`); // Use navigate instead of history.push
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Smart Contract Templates</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {templateData.map((template, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-ss-lg rounded-ee-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                            onClick={() => handleCardClick(template.template_name)}
                        >
                            <div className="relative">
                                {/* Add the image later when it's available */}
                                <img
                                    src={template.image_src || '/blockchain.png'} // Placeholder image
                                    alt={template.template_name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-25"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800">{template.template_name}</h3>
                                <p className="text-gray-600 mt-2">{template.description || 'No description available for this template.'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplatePage;
