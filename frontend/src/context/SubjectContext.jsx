import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch subjects from backend
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/subjects`);
      setSubjects(data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete subject (instant UI update)
  const deleteSubject = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s._id !== id)); // instant update
    } catch (err) {
      console.error("Error deleting subject:", err);
      throw err;
    }
  };

  // ✅ Fetch subjects when component mounts
  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        loading,
        fetchSubjects,
        deleteSubject,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => useContext(SubjectContext);
