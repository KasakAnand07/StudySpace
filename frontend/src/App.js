import React from "react";
import Subjects from "./pages/Subjects";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SubjectPage from "./pages/SubjectPage";
import StudyMaterial from "./pages/StudyMaterial";
import PYQ from "./pages/PYQ";
import MTP from "./pages/MTP";
import RTP from "./pages/RTP";
import QA from "./pages/QA";
import Flashcards from "./pages/Flashcards";
import { SubjectProvider } from "./context/SubjectContext"; // ✅ Import Context Provider
import "./styles/layout.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <SubjectProvider>
      <Router>
        <div className="app-layout">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Section */}
          <div className="main-content">
            {/* <Navbar /> */}
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* Future routes */}
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/subject/:name" element={<SubjectPage />} />
                <Route path="/study-material/:id" element={<StudyMaterial />} />

                {/* Testing routes */}
                <Route path="/pyq" element={<PYQ />} />
                <Route path="/mtp" element={<MTP />} />
                <Route path="/rtp" element={<RTP />} />
                <Route path="/qa" element={<QA />} />
                <Route path="/flashcards" element={<Flashcards />} />

                {/* Subject-based routes */}
                <Route path="/pyq/:subjectId" element={<PYQ />} />
                <Route path="/mtp/:subjectId" element={<MTP />} />
                <Route path="/rtp/:subjectId" element={<RTP />} />
                <Route path="/qa/:subjectId" element={<QA />} />
                <Route path="/flashcards/:subjectId" element={<Flashcards />} />
              </Routes>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={2000} />
      </Router>
    </SubjectProvider>
  );
}

export default App;
