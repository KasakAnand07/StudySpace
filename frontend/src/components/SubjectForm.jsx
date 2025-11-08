import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";

export default function SubjectForm({ onSubjectAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warn("Please enter a subject name!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/subjects`, {
        name,
        description,
      });

      onSubjectAdded(data); // Update UI instantly
      toast.success("Subject added successfully!");
      setName("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to add subject!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="subject-form mb-4 p-3 shadow-sm bg-white rounded">
      <h5 className="fw-semibold mb-3">➕ Add New Subject</h5>

      <Form.Group className="mb-3" controlId="subjectName">
        <Form.Label>Subject Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="subjectDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Enter short description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Subject"}
      </Button>
    </Form>
  );
}
