import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, FileText, Search } from "lucide-react";
import Lottie from "lottie-react";
import LayoutWrapper from "../components/LayoutWrapper";
import emptyAnimation from "../assets/empty.json";
import "../styles/pyq.css";
import { usePYQ } from "../context/PYQContext";

export default function PYQ() {
  const { pyqs, createPYQ, removePYQ, editPYQ, loading, error } = usePYQ();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [formData, setFormData] = useState({
    year: "",
    attempt: "",
    subject: "",
    file: null,
    fileName: "",
  });

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, file, fileName: file.name });
    } else {
      alert("Please upload a valid PDF file!");
    }
  };

  // ✅ Add new PYQ (to backend)
  const handleAddPYQ = async () => {
    if (
      !formData.year ||
      !formData.attempt ||
      !formData.subject ||
      !formData.file
    )
      return alert("Please fill all fields and upload a PDF!");

    const uploadData = new FormData();
    uploadData.append("year", formData.year.trim());
    uploadData.append("attempt", formData.attempt.trim());
    uploadData.append("subject", formData.subject.trim());
    uploadData.append("file", formData.file);

    try {
      await createPYQ(uploadData);
      setFormData({
        year: "",
        attempt: "",
        subject: "",
        file: null,
        fileName: "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error adding PYQ:", err);
      alert("Failed to upload. Check server connection.");
    }
  };

  // 🗑️ Delete PYQ (backend + local)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PYQ?")) return;
    try {
      await removePYQ(id);
    } catch (err) {
      console.error("Error deleting PYQ:", err);
    }
  };

  // ✏️ Edit PYQ details
  const handleEdit = async (pyq) => {
    const newSubject = prompt("Edit subject:", pyq.subject);
    const newYear = prompt("Edit year:", pyq.year);
    const newAttempt = prompt("Edit attempt:", pyq.attempt);
    if (!newSubject || !newYear || !newAttempt) return;

    try {
      await editPYQ(pyq._id, {
        subject: newSubject,
        year: newYear,
        attempt: newAttempt,
      });
    } catch (err) {
      console.error("Error updating PYQ:", err);
    }
  };

  // 🔍 Filtering (same logic)
  const filteredPYQs = pyqs.filter((pyq) => {
    const subject = pyq.subject || "";
    const year = pyq.year || "";
    const attempt = pyq.attempt || "";
    const fileName = pyq.fileName || "";

    const matchesSearch =
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fileName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = filterYear === "All" || year === filterYear;
    const matchesSubject = filterSubject === "All" || subject === filterSubject;

    return matchesSearch && matchesYear && matchesSubject;
  });

  const years = Array.from(new Set(pyqs.map((p) => p.year)));
  const subjects = Array.from(new Set(pyqs.map((p) => p.subject)));

  // 🧩 Handle loading/error
  if (loading) return <p className="text-center mt-5">Loading PYQs...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <LayoutWrapper
      title="🎓 PYQ - Previous Year Questions"
      subtitle="Manage and review previous year question papers"
    >
      <div className="content-page pyq-page container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-black">Previous Year Questions (PYQ)</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            ➕ Add PYQ
          </Button>
        </div>

        {/* 🔍 Search & Filters */}
        <Row className="mb-4">
          <Col md={5}>
            <InputGroup>
              <InputGroup.Text>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by subject, year, or file name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="All">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* 🕳️ Empty State */}
        {filteredPYQs.length === 0 ? (
          <div className="text-center mt-5">
            <div style={{ width: "300px", margin: "0 auto" }}>
              <Lottie animationData={emptyAnimation} loop={true} />
            </div>
            <h5 className="text-muted mt-3">
              No matching PYQs found. Try adding or searching differently 👇
            </h5>
          </div>
        ) : (
          // 🗂️ Grid Layout
          <div className="pyq-grid mt-3">
            <AnimatePresence>
              {filteredPYQs.map((pyq) => (
                <motion.div
                  key={pyq._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="pyq-card shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="fw-bold mb-1">{pyq.subject}</h5>
                          <p className="mb-1">
                            {pyq.year} — <em>{pyq.attempt}</em>
                          </p>
                          <p className="text-secondary small mb-2">
                            {pyq.fileName}
                          </p>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `${process.env.REACT_APP_API_URL}${pyq.fileUrl}`,
                                "_blank"
                              )
                            }
                          >
                            <FileText size={14} className="me-1" /> View PDF
                          </Button>
                        </div>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleEdit(pyq)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(pyq._id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ➕ Add PYQ Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add PYQ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Advanced Accounting"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 2023"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Attempt</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. May / November"
                  value={formData.attempt}
                  onChange={(e) =>
                    setFormData({ ...formData, attempt: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload PDF</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                {formData.fileName && (
                  <div className="mt-2 small text-muted">
                    Selected: {formData.fileName}
                  </div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddPYQ}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </LayoutWrapper>
  );
}
