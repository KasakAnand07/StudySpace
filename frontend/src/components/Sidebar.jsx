import React, { useState } from "react";
import { Nav, Button, Modal, Form, Spinner, Collapse } from "react-bootstrap";
import { useSubjects } from "../context/SubjectContext";
import axios from "axios";

export default function Sidebar() {
  const { fetchSubjects } = useSubjects();
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [adding, setAdding] = useState(false);
  const [openResources, setOpenResources] = useState(false); // for collapsible Study Resources

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return alert("Please enter a subject name");

    setAdding(true);
    try {
      await axios.post("http://localhost:5000/api/subjects", {
        name: newSubject.trim(),
      });

      await fetchSubjects(); // ✅ refresh dashboard instantly
      setNewSubject("");
      setShowModal(false);
    } catch (err) {
      console.error("Error adding subject:", err);
      alert("Failed to add subject!");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="sidebar p-3 vh-100 d-flex flex-column justify-content-between">
      {/* ✅ Navigation Links */}
      <div>
        <h4 className="fw-bold mb-3 text-center">📚 StudySpace</h4>
        <Nav className="flex-column mb-4">
          <Nav.Link href="/" className="nav-link sidebar-item">
            🏠 Dashboard
          </Nav.Link>
          <Nav.Link href="/subjects" className="nav-link sidebar-item">
            📘 Subjects
          </Nav.Link>

          {/* 📂 Collapsible Study Resources Section */}
          <div className="mt-2">
            <div
              onClick={() => setOpenResources(!openResources)}
              className="nav-link d-flex justify-content-between align-items-center fw-semibold resource-toggle"
              style={{
                cursor: "pointer",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                transition: "background 0.3s, color 0.3s",
              }}
            >
              <span>🎓 Study Resources</span>
              <span>{openResources ? "▲" : "▼"}</span>
            </div>

            <Collapse in={openResources}>
              <div id="resources-collapse">
                <Nav className="flex-column ms-3">
                  {/* <Nav.Link
                    href="/study-material"
                    className="nav-link sidebar-item"
                  >
                    📄 Study Material
                  </Nav.Link> */}
                  <Nav.Link href="/pyq" className="nav-link sidebar-item">
                    📑 PYQs
                  </Nav.Link>
                  <Nav.Link href="/mtp" className="nav-link sidebar-item">
                    🧾 MTPs
                  </Nav.Link>
                  <Nav.Link href="/rtp" className="nav-link sidebar-item">
                    🗂️ RTPs
                  </Nav.Link>
                  <Nav.Link href="/qa" className="nav-link sidebar-item">
                    💬 Q&A
                  </Nav.Link>
                  <Nav.Link
                    href="/flashcards"
                    className="nav-link sidebar-item"
                  >
                    🎴 Flashcards
                  </Nav.Link>
                </Nav>
              </div>
            </Collapse>
          </div>

          {/* <Nav.Link href="/progress" className="nav-link sidebar-item mt-2">
            📈 Progress
          </Nav.Link> */}
        </Nav>
      </div>

      {/* ✅ Add Subject Button */}
      <div className="text-center mt-auto">
        <Button
          variant="success"
          className="w-100"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Subject
        </Button>
      </div>

      {/* ✅ Add Subject Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubject}>
            <Form.Group>
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject name"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </Form.Group>
            <div className="text-end mt-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={adding}>
                {adding ? (
                  <>
                    <Spinner size="sm" animation="border" /> Adding...
                  </>
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
