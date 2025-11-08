import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";
import { useSubjects } from "../context/SubjectContext";
import axios from "axios";
import LayoutWrapper from "../components/LayoutWrapper";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { subjects, loading, fetchSubjects, deleteSubject } = useSubjects();
  const [deletingId, setDeletingId] = useState(null);
  const [remarks, setRemarks] = useState({});
  const debounceTimers = useRef({}); // store debounce timers per subject
  const navigate = useNavigate();
  const timersRef = debounceTimers.current;

  const handleOpenResources = (subjectId) => {
    navigate(`/study-material/${subjectId}`);
  };
  // 🗑️ Delete subject
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;
    setDeletingId(id);
    try {
      await deleteSubject(id);
    } catch (error) {
      alert("Failed to delete subject. Try again!");
    } finally {
      setDeletingId(null);
    }
  };

  // ✏️ Edit subject name
  const handleEdit = async (subject) => {
    const newName = prompt("Enter new name for this subject:", subject.name);
    if (!newName || newName === subject.name) return;

    try {
      await axios.put(`http://localhost:5000/api/subjects/${subject._id}`, {
        name: newName,
      });
      await fetchSubjects();
    } catch (error) {
      console.error("Error editing subject:", error);
      alert("Failed to edit subject. Try again!");
    }
  };

  // 📝 Debounced remarks handler
  const handleRemarksChange = (id, newRemarks) => {
    // update UI instantly
    setRemarks((prev) => ({ ...prev, [id]: newRemarks }));

    // clear previous timer if exists
    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);

    // set new debounce timer
    debounceTimers.current[id] = setTimeout(async () => {
      try {
        await axios.put(`http://localhost:5000/api/subjects/${id}`, {
          remarks: newRemarks,
        });
        await fetchSubjects();
      } catch (error) {
        console.error("Error saving remarks:", error);
      }
    }, 1500); // wait 1.5 seconds after user stops typing
  };

  // 🧹 Clear timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timersRef);
    };
  }, []);

  if (loading)
    return (
      <div className="loading-screen">
        <Spinner animation="border" variant="primary" />
        <p>Loading your dashboard...</p>
      </div>
    );

  return (
    <LayoutWrapper title="📚 Dashboard" subtitle="Your Subjects Overview">
      <div className="dashboard-container">
        {subjects.length === 0 ? (
          <motion.div
            className="empty-state d-flex flex-column align-items-center justify-content-center text-center p-5"
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              minHeight: "70vh",
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ fontSize: "4rem" }}
            >
              📘
            </motion.div>
            <h2 className="mt-3 fw-bold text-dark">
              Welcome to Your StudySpace!
            </h2>
            <p className="text-secondary mt-2">
              Looks like your dashboard is waiting for action.
              <br />
              <strong>Start by adding subjects from the sidebar!</strong>
            </p>
          </motion.div>
        ) : (
          <div className="subjects-grid">
            <AnimatePresence>
              {subjects.map((subject) => (
                <motion.div
                  key={subject._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="subject-card shadow-sm">
                    <Card.Body>
                      {/* Header with subject name + edit/delete */}
                      <div className="subject-header">
                        <h5 className="subject-name">{subject.name}</h5>
                        <div className="subject-actions">
                          <Button
                            className="edit-btn"
                            onClick={() => handleEdit(subject)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            className="delete-btn"
                            onClick={() => handleDelete(subject._id)}
                            disabled={deletingId === subject._id}
                          >
                            {deletingId === subject._id ? (
                              <Spinner size="sm" animation="border" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </div>
                      </div>

                      <p className="subject-level">
                        Level: {subject.level || "Intermediate / Final"}
                      </p>

                      {/* Remarks section */}
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Add personal notes or remarks..."
                        value={remarks[subject._id] ?? subject.remarks ?? ""}
                        onChange={(e) =>
                          handleRemarksChange(subject._id, e.target.value)
                        }
                        className="remarks-box"
                      />

                      {/* Footer action */}
                      <div className="card-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleOpenResources(subject._id)}
                        >
                          Open Resources
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
