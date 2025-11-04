import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LayoutWrapper from "../components/LayoutWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

export default function SubjectStudyMaterial() {
  const { id } = useParams(); // subject ID from URL
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subjectName, setSubjectName] = useState("");

  // 🔹 Fetch subject info + materials
  const fetchMaterials = async () => {
    try {
      console.log("Fetching subject and materials for:", id);

      const [subRes, matRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/subjects/${id}`),
        axios.get(`http://localhost:5000/api/materials/subject/${id}`),
      ]);

      console.log("✅ Subject:", subRes.data);
      console.log("✅ Materials:", matRes.data);

      setSubjectName(subRes.data.name);
      setMaterials(matRes.data);
    } catch (error) {
      console.error("❌ Fetch Error:", error.response?.data || error.message);
      toast.error("Failed to load materials");
    }
  };

  useEffect(() => {
    if (!id) {
      console.warn("⚠️ No subject ID — skipping fetch.");
      return;
    }
    fetchMaterials();
  }, [id]);

  // 🔹 Add new material
  const handleAdd = async () => {
    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    try {
      setLoading(true);
      let fileUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        fileUrl = uploadRes.data.filePath;
      }

      await axios.post("http://localhost:5000/api/materials", {
        title,
        description,
        subjectId: id, // link to subject
        fileUrl,
      });

      toast.success("Material added successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      fetchMaterials();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add material");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete material
  const handleDelete = async (matId) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/materials/${matId}`);
      setMaterials(materials.filter((m) => m._id !== matId));
      toast.success("Material deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete material");
    }
  };

  if (!id) {
    return (
      <div className="text-center mt-5 text-muted">
        ⚠️ Please select a subject from the sidebar to view study materials.
      </div>
    );
  }

  return (
    <LayoutWrapper title={`📘 ${subjectName} — Study Materials`} subtitle={`Manage your study materials for ${subjectName}.`}>
    <div className="container mt-4">
      {/* <motion.h2
        className="mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📘 {subjectName} — Study Materials
      </motion.h2> */}

      {/* ➕ Add Material */}
      <motion.div
        className="card p-4 mb-4 shadow-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <h5 className="mb-3">➕ Add New Material</h5>
        <div className="row">
          <div className="col-md-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Material Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>
        <textarea
          className="form-control my-2"
          rows="2"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Material"}
        </button>
      </motion.div>

      {/* 📂 Display Materials */}
      {materials.length === 0 ? (
        <motion.div
          className="text-center text-muted mt-5"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h5>✨ No materials added yet</h5>
          <p>Start adding PDFs, notes, or links for {subjectName} 📚</p>
        </motion.div>
      ) : (
        <div className="row">
          <AnimatePresence>
            {materials.map((mat) => (
              <motion.div
                key={mat._id}
                className="col-md-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="card p-3 shadow-sm h-100 position-relative"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* 🗑️ Delete Icon */}
                  <motion.div
                    className="position-absolute top-0 end-0 m-2 text-danger"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(mat._id)}
                    title="Delete material"
                  >
                    <Trash2 size={20} />
                  </motion.div>

                  <h5 className="text-primary">{mat.title}</h5>
                  <p>{mat.description || "No description provided"}</p>

                  {mat.fileUrl && (
                    <a
                      href={`http://localhost:5000${mat.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm mt-auto"
                    >
                      View File
                    </a>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
    </LayoutWrapper>
  );
}
