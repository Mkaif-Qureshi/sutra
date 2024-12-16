import React from "react";
import { useWallet } from "../WalletContext"; // Import the WalletContext

const Header = () => {
    const { walletAddress, connectWallet } = useWallet();

    return (
        <header className="shadow-md border-b border-gray-300">
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
                        href="/templates"
                        className="text-gray-700 hover:text-gray-900 font-medium transition"
                    >
                        TEMPLATES
                    </a>

                    <div className="relative group">
                        <a
                            href="#"
                            className="text-gray-700 hover:text-gray-900 font-medium transition"
                        >
                            LEARN
                        </a>
                        <div className="absolute mt-2 bg-white shadow-lg rounded-lg py-2 w-48 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200">
                            <a
                                href="/help/resources"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Resources
                            </a>
                            <a
                                href="/help/learnwithai"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Learn With AI
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {walletAddress ? (
                        <span className="text-gray-700 font-medium">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </span>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="px-6 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-ss-lg rounded-ee-lg font-semibold shadow-md hover:from-teal-500 hover:to-blue-600 transition-transform transform hover:scale-105 "
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
