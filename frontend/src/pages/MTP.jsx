import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import LayoutWrapper from "../components/LayoutWrapper";
import Lottie from "lottie-react";
import emptyAnimation from "../assets/empty.json";

export default function MTP() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [filterSubject, setFilterSubject] = useState("All");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mtp_questions")) || [];
    setQuestions(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("mtp_questions", JSON.stringify(questions));
  }, [questions]);

  const addQuestion = () => {
    if (!subject || !question || !answer) return alert("Please fill all fields!");
    const newQuestion = {
      id: Date.now(),
      subject,
      question,
      answer,
      status: "Pending",
    };
    setQuestions([...questions, newQuestion]);
    setSubject("");
    setQuestion("");
    setAnswer("");
  };

  const toggleStatus = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: q.status === "Pending" ? "Attempted" : "Pending" } : q
      )
    );
  };

  const deleteQuestion = (id) => {
    if (window.confirm("Delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const filteredQuestions =
    filterSubject === "All"
      ? questions
      : questions.filter((q) => q.subject === filterSubject);

  return (
    <LayoutWrapper
      title="Mock Test Papers (MTP)"
      subtitle="Add, review, and track your subject-wise mock test questions."
    >
      <Container fluid>
        <Card className="p-3 shadow-sm mb-4 bg-white">
          <h5 className="fw-bold mb-3">Add New Question</h5>
          <Row className="g-2">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </Col>
          </Row>
          <div className="text-end mt-3">
            <Button variant="primary" onClick={addQuestion}>
              Add Question
            </Button>
          </div>
        </Card>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>All Questions</h5>
          <Form.Select
            style={{ width: "200px" }}
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {[...new Set(questions.map((q) => q.subject))].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </Form.Select>
        </div>

        {filteredQuestions.length > 0 ? (
          <Row className="g-3">
            {filteredQuestions.map((q) => (
              <Col md={6} lg={4} key={q.id}>
                <Card
                  className={`p-3 shadow-sm border-${
                    q.status === "Attempted" ? "success" : "warning"
                  }`}
                >
                  <h6 className="fw-bold text-primary">{q.subject}</h6>
                  <p>
                    <strong>Q:</strong> {q.question}
                  </p>
                  <p>
                    <strong>Ans:</strong> {q.answer}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant={
                        q.status === "Attempted" ? "outline-success" : "outline-warning"
                      }
                      size="sm"
                      onClick={() => toggleStatus(q.id)}
                    >
                      {q.status === "Attempted" ? "Mark Pending" : "Mark Attempted"}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteQuestion(q.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center mt-5">
            <Lottie animationData={emptyAnimation} style={{ height: 250 }} />
            <p className="text-muted mt-2">No questions added yet. Add your first mock!</p>
          </div>
        )}
      </Container>
    </LayoutWrapper>
  );
}
