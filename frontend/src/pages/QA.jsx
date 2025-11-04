import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import LayoutWrapper from "../components/LayoutWrapper";
import Lottie from "lottie-react";
import emptyAnimation from "../assets/empty.json";

export default function QA() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [qaList, setQaList] = useState([]);
  const [filterSubject, setFilterSubject] = useState("All");

  // ✅ Load saved Q&A
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("qa_data")) || [];
    setQaList(saved);
  }, []);

  // ✅ Save Q&A
  useEffect(() => {
    localStorage.setItem("qa_data", JSON.stringify(qaList));
  }, [qaList]);

  // ➕ Add new Q&A
  const addQA = () => {
    if (!subject || !question || !answer)
      return alert("Please fill all fields!");
    const newEntry = {
      id: Date.now(),
      subject,
      question,
      answer,
      status: "Pending",
    };
    setQaList([...qaList, newEntry]);
    setSubject("");
    setQuestion("");
    setAnswer("");
  };

  // 🔄 Toggle status
  const toggleStatus = (id) => {
    setQaList((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: q.status === "Pending" ? "Reviewed" : "Pending" }
          : q
      )
    );
  };

  // ❌ Delete Q&A
  const deleteQA = (id) => {
    if (window.confirm("Delete this question and answer?")) {
      setQaList(qaList.filter((q) => q.id !== id));
    }
  };

  // 🎯 Filter by subject
  const filteredQA =
    filterSubject === "All"
      ? qaList
      : qaList.filter((q) => q.subject === filterSubject);

  return (
    <LayoutWrapper
      title="💬 Q&A - Questions & Answers"
      subtitle="Add, manage, and review your own custom Q&A notes for better self-study."
    >
      <Container fluid>
        {/* ✏️ Add Section */}
        <Card className="p-3 shadow-sm mb-4 bg-white">
          <h5 className="fw-bold mb-3">Add New Q&A</h5>
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
            <Button variant="primary" onClick={addQA}>
              Add Q&A
            </Button>
          </div>
        </Card>

        {/* 📋 Filter & List */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>All Q&A Entries</h5>
          <Form.Select
            style={{ width: "200px" }}
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {[...new Set(qaList.map((q) => q.subject))].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </Form.Select>
        </div>

        {filteredQA.length > 0 ? (
          <Row className="g-3">
            {filteredQA.map((q) => (
              <Col md={6} lg={4} key={q.id}>
                <Card
                  className={`p-3 shadow-sm border-${
                    q.status === "Reviewed" ? "success" : "warning"
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
                        q.status === "Reviewed"
                          ? "outline-success"
                          : "outline-warning"
                      }
                      size="sm"
                      onClick={() => toggleStatus(q.id)}
                    >
                      {q.status === "Reviewed"
                        ? "Mark Pending"
                        : "Mark Reviewed"}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteQA(q.id)}
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
            <p className="text-muted mt-2">
              No Q&A added yet. Start building your personalized revision notes 💡
            </p>
          </div>
        )}
      </Container>
    </LayoutWrapper>
  );
}
