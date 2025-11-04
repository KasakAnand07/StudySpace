import React, { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

export default function SubjectCard({ subject, onDelete, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(subject.name);
  const [editDescription, setEditDescription] = useState(subject.description || "");
  const [loading, setLoading] = useState(false);

  // --- Delete Subject ---
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${subject.name}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/subjects/${subject._id}`);
        toast.success("Subject deleted successfully!");
        onDelete(subject._id);
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete subject.");
      }
    }
  };

  // --- Update Subject ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.warn("Subject name cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `http://localhost:5000/api/subjects/${subject._id}`,
        { name: editName, description: editDescription }
      );
      onUpdate(data);
      toast.success("Subject updated successfully!");
      setShowEdit(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm border-0 subject-card h-100 hover-effect">
        <Card.Body>
          <Card.Title className="fw-semibold text-primary mb-2">
            {subject.name}
          </Card.Title>

          <Card.Text className="text-muted small mb-3">
            {subject.description || "No description provided."}
          </Card.Text>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowEdit(true)}
            >
              ✏️ Edit
            </Button>

            <Button variant="outline-danger" size="sm" onClick={handleDelete}>
              🗑️ Delete
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* --- Edit Modal --- */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
