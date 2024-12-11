import React from "react";

const Header = () => {
    return (
        <header className=" shadow-md border-b border-gray-300">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                    <img
                        src="/logo2.png"
                        alt="Sutra Logo"
                        className="h-10 w-18"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    <a
                        href="/"
                        className="text-gray-700 hover:text-gray-900 font-medium transition"
                    >
                        HOME
                    </a>
                    <a
                        href="/buildcontract"
                        className="text-gray-700 hover:text-gray-900 font-medium transition"
                    >
                        BUILD
                    </a>
                    <a
                        href="/template"
                        className="text-gray-700 hover:text-gray-900 font-medium transition"
                    >
                        TEMPLATES
                    </a>

                    <a
                        href="#features"
                        className="text-gray-700 hover:text-gray-900 font-medium transition"
                    >
                        FEATURES
                    </a>
                    <a
                        href="/docs"
                        className="text-gray-700 hover:text-gray-900 font-medium transition"
                    >
                        DOCS
                    </a>
                    <div className="relative group">
                        <a
                            href="#"
                            className="text-gray-700 hover:text-gray-900 font-medium transition"
                        >
                            HELP
                        </a>
                        <div className="absolute mt-2 bg-white shadow-lg rounded-lg py-2 w-48 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200">
                            <a
                                href="/help/tutorials"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Tutorials
                            </a>
                            <a
                                href="/help/faq"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                FAQs
                            </a>
                            <a
                                href="/help/contact"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition">
                        Deploy
                    </button>
                    <button className="text-gray-700 hover:text-gray-900 font-medium transition">
                        Sign In/Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
