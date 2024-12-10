import React from "react";


const Footer = () => {
  return (
    <footer className="bg-white border-t shadow-sm">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left Section */}
        <div className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Sutra. All rights reserved.
        </div>

        {/* Middle Section */}
        <div className="flex space-x-6">
          <a
            href="/terms"
            className="text-gray-600 hover:text-gray-800 text-sm transition"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            className="text-gray-600 hover:text-gray-800 text-sm transition"
          >
            Privacy Policy
          </a>
          <a
            href="/contact"
            className="text-gray-600 hover:text-gray-800 text-sm transition"
          >
            Contact Us
          </a>
        </div>

        {/* Right Section */}
        <div className="flex space-x-4">
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-500 transition"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://github.com/yourrepo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 transition"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-700 transition"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
