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
import "../styles/rtp.css";
import { useRTP } from "../context/RTPContext";

export default function RTP() {
  const { rtps, createRTP, removeRTP, editRTP, loading, error } = useRTP();
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

  // ✅ Add new RTP (to backend)
  const handleAddRTP = async () => {
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
      await createRTP(uploadData);
      setFormData({
        year: "",
        attempt: "",
        subject: "",
        file: null,
        fileName: "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error adding RTP:", err);
      alert("Failed to upload. Check server connection.");
    }
  };

  // 🗑️ Delete RTP (backend + local)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this RTP?")) return;
    try {
      await removeRTP(id);
    } catch (err) {
      console.error("Error deleting RTP:", err);
    }
  };

  // ✏️ Edit RTP details
  const handleEdit = async (rtp) => {
    const newSubject = prompt("Edit subject:", rtp.subject);
    const newYear = prompt("Edit year:", rtp.year);
    const newAttempt = prompt("Edit attempt:", rtp.attempt);
    if (!newSubject || !newYear || !newAttempt) return;

    try {
      await editRTP(rtp._id, {
        subject: newSubject,
        year: newYear,
        attempt: newAttempt,
      });
    } catch (err) {
      console.error("Error updating RTP:", err);
    }
  };

  // 🔍 Filtering (same logic)
  const filteredRTPs = rtps.filter((rtp) => {
    const subject = rtp.subject || "";
    const year = rtp.year || "";
    const attempt = rtp.attempt || "";
    const fileName = rtp.fileName || "";

    const matchesSearch =
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fileName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = filterYear === "All" || year === filterYear;
    const matchesSubject = filterSubject === "All" || subject === filterSubject;

    return matchesSearch && matchesYear && matchesSubject;
  });

  const years = Array.from(new Set(rtps.map((p) => p.year)));
  const subjects = Array.from(new Set(rtps.map((p) => p.subject)));

  // 🧩 Handle loading/error
  if (loading) return <p className="text-center mt-5">Loading RTPs...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <LayoutWrapper
      title="🎓 RTP - Revision Test Papers"
      subtitle="Manage and review revision test papers"
    >
      <div className="content-page rtp-page container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-black">Revision Test Papers (RTP)</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            ➕ Add RTP
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
        {filteredRTPs.length === 0 ? (
          <div className="text-center mt-5">
            <div style={{ width: "300px", margin: "0 auto" }}>
              <Lottie animationData={emptyAnimation} loop={true} />
            </div>
            <h5 className="text-muted mt-3">
              No matching RTPs found. Try adding or searching differently 👇
            </h5>
          </div>
        ) : (
          // 🗂️ Grid Layout
          <div className="rtp-grid mt-3">
            <AnimatePresence>
              {filteredRTPs.map((rtp) => (
                <motion.div
                  key={rtp._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="rtp-card shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="fw-bold mb-1">{rtp.subject}</h5>
                          <p className="mb-1">
                            {rtp.year} — <em>{rtp.attempt}</em>
                          </p>
                          <p className="text-secondary small mb-2">
                            {rtp.fileName}
                          </p>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `${process.env.REACT_APP_API_URL}${rtp.fileUrl}`,
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
                            onClick={() => handleEdit(rtp)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(rtp._id)}
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

        {/* ➕ Add RTP Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add RTP</Modal.Title>
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
            <Button variant="primary" onClick={handleAddRTP}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </LayoutWrapper>
  );
}
