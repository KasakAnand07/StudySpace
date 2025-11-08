import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import Lottie from "lottie-react";
import emptyAnimation from "../assets/empty.json"; // 👈 Ensure path is correct
import LayoutWrapper from "../components/LayoutWrapper";
import "../styles/Flashcards.css";

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({
    subject: "",
    question: "",
    answer: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // --- Fetch flashcards ---
  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/flashcards`
      );
      setFlashcards(data);
      setFilteredFlashcards(data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  // --- Add new flashcard ---
  const handleAddFlashcard = async () => {
    if (
      !newFlashcard.subject ||
      !newFlashcard.question ||
      !newFlashcard.answer
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/flashcards`,
        newFlashcard
      );
      setFlashcards((prev) => [data, ...prev]);
      setFilteredFlashcards((prev) => [data, ...prev]);
      setNewFlashcard({ subject: "", question: "", answer: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding flashcard:", error);
    }
  };

  // --- Delete flashcard ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/flashcards/${id}`);
      setFlashcards((prev) => prev.filter((f) => f._id !== id));
      setFilteredFlashcards((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  // --- Filter flashcards based on search ---
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = flashcards.filter(
      (card) =>
        card.subject.toLowerCase().includes(lowerSearch) ||
        card.question.toLowerCase().includes(lowerSearch) ||
        card.answer.toLowerCase().includes(lowerSearch)
    );
    setFilteredFlashcards(filtered);
  }, [searchTerm, flashcards]);

  return (
    <LayoutWrapper
      title="🎴Flashcards"
      subtitle="Review key concepts and definitions interactively."
    >
      <div className="flashcards-page">
        {/* Header + Add Button + Search */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <h3 className="fw-bold text-primary">💡 My Flashcards</h3>

          <InputGroup className="search-bar" style={{ maxWidth: "250px" }}>
            <Form.Control
              type="text"
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Button variant="success" onClick={() => setShowModal(true)}>
            ➕ Add Flashcard
          </Button>
        </div>

        {/* No Flashcards */}
        {filteredFlashcards.length === 0 ? (
          <div className="text-center mt-5">
            <Lottie
              animationData={emptyAnimation}
              loop
              style={{ height: 220 }}
            />
            <h5 className="text-muted mt-3">No flashcards found 😴</h5>
            <p>Try adding one or search differently.</p>
          </div>
        ) : (
          <Container>
            <Row className="g-4 justify-content-center">
              {filteredFlashcards.map((card) => (
                <Col key={card._id} xs={12} sm={6} md={4} lg={3}>
                  <div className="flashcard">
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <h6 className="text-primary text-center">
                          {card.subject}
                        </h6>
                        <p className="fw-semibold">{card.question}</p>
                      </div>
                      <div className="flashcard-back">
                        <p>{card.answer}</p>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(card._id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        )}

        {/* Add Flashcard Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Flashcard</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subject"
                  value={newFlashcard.subject}
                  onChange={(e) =>
                    setNewFlashcard({
                      ...newFlashcard,
                      subject: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter question"
                  value={newFlashcard.question}
                  onChange={(e) =>
                    setNewFlashcard({
                      ...newFlashcard,
                      question: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter answer"
                  value={newFlashcard.answer}
                  onChange={(e) =>
                    setNewFlashcard({ ...newFlashcard, answer: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddFlashcard}>
              Save Flashcard
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </LayoutWrapper>
  );
}
