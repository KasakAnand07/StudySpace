import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/subjectPage.css";

export default function SubjectPage() {
  const { name } = useParams();
  const subjectName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="subject-page">
      <h1>{subjectName}</h1>
      <p className="subtitle">Choose what you want to explore:</p>

      <div className="resource-grid">
        <Link to={`/subject/${name}/study-material`} className="resource-card">📘 Study Material</Link>
        <Link to={`/subject/${name}/qa`} className="resource-card">💬 Q&A</Link>
        <Link to={`/subject/${name}/progress`} className="resource-card">📊 Progress Tracker</Link>
      </div>
    </div>
  );
}
