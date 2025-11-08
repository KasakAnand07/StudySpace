import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import SubjectForm from "../components/SubjectForm";
import SubjectCard from "../components/SubjectCard";
import LayoutWrapper from "../components/LayoutWrapper";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Subjects ---
  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/subjects`);
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // --- Add / Delete / Update ---
  const handleSubjectAdded = (newSubject) =>
    setSubjects((prev) => [newSubject, ...prev]);

  const handleSubjectDelete = (id) =>
    setSubjects((prev) => prev.filter((s) => s._id !== id));

  const handleSubjectUpdate = (updatedSubject) =>
    setSubjects((prev) =>
      prev.map((s) => (s._id === updatedSubject._id ? updatedSubject : s))
    );

  return (
    <LayoutWrapper
      title="📚 My Subjects"
      subtitle="Manage your subjects and study materials."
    >
      <div className="subjects-page">
        {/* <h3 className="fw-bold mb-4 text-center">📚 My Subjects</h3> */}

        <SubjectForm onSubjectAdded={handleSubjectAdded} />

        {loading ? (
          <div className="d-flex justify-content-center mt-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center mt-5 text-muted">
            <h5>No subjects added yet 😴</h5>
            <p>Add your first subject using the form above!</p>
          </div>
        ) : (
          <Container className="mt-4">
            <Row className="g-4 justify-content-center">
              {subjects.map((subject) => (
                <Col key={subject._id} xs={12} sm={6} md={4} lg={3}>
                  <SubjectCard
                    subject={subject}
                    onDelete={handleSubjectDelete}
                    onUpdate={handleSubjectUpdate}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        )}
      </div>
    </LayoutWrapper>
  );
}
