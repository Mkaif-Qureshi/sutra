import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import '@fortawesome/fontawesome-free/css/all.css';
import './App.css';

// Pages
import Home from "./pages/index";
// import Templates from "./pages/templates";
// import Features from "./pages/features";
// import Docs from "./pages/docs";
// import FAQ from "./pages/help/faq";
// import Tutorials from "./pages/help/tutorials";
// import Contact from "./pages/help/contact";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/templates" element={<Templates />} />
            <Route path="/features" element={<Features />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/help/faq" element={<FAQ />} />
            <Route path="/help/tutorials" element={<Tutorials />} />
            <Route path="/help/contact" element={<Contact />} /> */}
          </Routes>
        </Router>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
