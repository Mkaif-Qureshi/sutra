import React from "react";
import { FaCog, FaBolt, FaGlobe, FaRegFileAlt, FaBook, FaBrain } from "react-icons/fa";

import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-gray-100 text-gray-900">
            {/* Hero Section */}
            <section className=" bg-gradient-to-r from-gray-400 to-gray-600 py-20 border-b border-gray-400">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-extrabold text-white tracking-wide mb-6">
                        Design. Deploy. Dominate.
                    </h1>
                    <p className="text-xl text-gray-200 leading-relaxed mb-8">
                        Sutra (सूत्र) - [noun]: A new formula for contract code generation, simplifies the creation of intelligent smart contracts with precision and clarity.
                    </p>
                    <Link to="/buildcontract">
                        <button className="px-8 py-3 text-gray-900 text-lg font-semibold rounded-ss-lg rounded-ee-lg shadow transition transform hover:scale-105 hero-background">
                            Start Building Today
                        </button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                        Core Capabilities
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Feature Card 1 */}
                        <div className="bg-gray-100 p-6 rounded-ss-lg rounded-ee-lg shadow-md hover:shadow-md transition transform hover:scale-105">
                            <div className="flex items-center mb-4">
                                <FaCog className="h-8 w-8 text-yellow-500 mr-4" />
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    Precision Builder
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                Design and refine your smart contracts effortlessly with tools made for perfection.
                            </p>
                        </div>
                        {/* Feature Card 2 */}
                        <div className="bg-gray-100 p-6 rounded-ss-lg rounded-ee-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
                            <div className="flex items-center mb-4">
                                <FaBolt className="h-8 w-8 text-yellow-500 mr-4" />
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    AI Code Optimizer
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                Harness AI to detect vulnerabilities, optimize performance, and ensure compliance.
                            </p>
                        </div>
                        {/* Feature Card 3 */}
                        <div className="bg-gray-100 p-6 rounded-ss-lg rounded-ee-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
                            <div className="flex items-center mb-4">
                                <FaGlobe className="h-8 w-8 text-yellow-500 mr-4" />
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    Real-time Deployment
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                Deploy your contracts on multiple networks with a single click, saving time and effort.
                            </p>
                        </div>
                        {/* Feature Card 4: Prebuilt Templates */}
                        <div className="bg-gray-100 p-6 rounded-ss-lg rounded-ee-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
                            <div className="flex items-center mb-4">
                                <FaRegFileAlt className="h-8 w-8 text-yellow-500 mr-4" />
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    Prebuilt Templates
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                Start your journey with a library of prebuilt templates tailored for various use cases.
                            </p>
                        </div>
                        {/* Feature Card 5: Blockchain Resources */}
                        <div className="bg-gray-100 p-6 rounded-ss-lg rounded-ee-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
                            <div className="flex items-center mb-4">
                                <FaBook className="h-8 w-8 text-yellow-500 mr-4" />
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    Blockchain Resources
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                Access curated resources to deepen your understanding of blockchain technology.
                            </p>
                        </div>
                        {/* Feature Card 6: Learning with AI (Mindmaps) */}
                        <div className="bg-gray-100 p-6 rounded-ss-lg rounded-ee-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
                            <div className="flex items-center mb-4">
                                <FaBrain className="h-8 w-8 text-yellow-500 mr-4" />
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    Learning with AI (Mindmaps)
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                Visualize and explore blockchain concepts with interactive AI-generated mindmaps.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Why Sutra Section */}
            <section className="bg-gray-50 py-20 border-t border-b border-gray-300">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 items-center gap-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Why Choose Sutra?
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Trusted by developers and businesses alike, Sutra provides unparalleled speed, security,
                                and scalability for creating decentralized applications.
                            </p>
                            <Link to="/templates">
                                <button className="p-4 bg-gray-700 text-white font-medium  hover:bg-gray-800 transition rounded-ss-lg rounded-ee-lg">
                                    Explore Templates
                                </button>
                            </Link>

                        </div>
                        <div className="bg-gray-200 h-64 w-full rounded-lg shadow-lg flex items-center justify-center">
                            {/* Video element */}
                            <video
                                className="w-full h-auto rounded-lg"
                                autoPlay
                                muted
                                loop
                                poster="/path-to-placeholder-image.jpg"
                            >
                                <source src="/video.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
