import { createContext, useContext, useState, useEffect } from "react";
import { getPYQs, addPYQ, deletePYQ, updatePYQ } from "../api/pyqService";

const PYQContext = createContext();

export const PYQProvider = ({ children }) => {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all PYQs from backend
  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = async () => {
    try {
      setLoading(true);
      const data = await getPYQs();
      setPyqs(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching PYQs:", err);
      setError("Failed to load PYQs.");
    } finally {
      setLoading(false);
    }
  };

  // Add new PYQ
  const createPYQ = async (formData) => {
    try {
      console.log("Submitting PYQ form data:", formData); // <-- log it
      const newItem = await addPYQ(formData);
      setPyqs((prev) => [...prev, newItem]);
    } catch (err) {
      console.error("Error adding PYQ:", err);
      throw err;
    }
  };

  // Delete PYQ
  const removePYQ = async (id) => {
    try {
      await deletePYQ(id);
      setPyqs((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting PYQ:", err);
    }
  };

  // Update PYQ
  const editPYQ = async (id, updatedData) => {
    try {
      const updated = await updatePYQ(id, updatedData);
      setPyqs((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Error updating PYQ:", err);
    }
  };

  return (
    <PYQContext.Provider
      value={{
        pyqs,
        loading,
        error,
        fetchPYQs,
        createPYQ,
        removePYQ,
        editPYQ,
      }}
    >
      {children}
    </PYQContext.Provider>
  );
};

export const usePYQ = () => useContext(PYQContext);
