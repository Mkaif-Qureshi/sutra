import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './App.css';

// Pages
import Home from "./pages/index";
import ContractBuilderPage from "./pages/ContractBuilderPage"
import TemplatePage from "./pages/TemplatePage";
import ResourcesPage from "./pages/ResourcesPage"
import LearnWithAIPage from "./pages/LearnWithAIpage"
import ContractDeployPage from "./pages/ContractDeployPage";


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
            <Route path="/buildcontract" element={<ContractBuilderPage />} />
            <Route path="/templates" element={<TemplatePage />} />
            <Route path="/help/resources" element={<ResourcesPage />} />
            <Route path="/help/learnwithai" element={<LearnWithAIPage />} />
            <Route path="/deploy" element={<ContractDeployPage />} />

          </Routes>
        </Router>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
