import { createContext, useContext, useState, useEffect } from "react";
import { getMTPs, addMTP, deleteMTP, updateMTP } from "../api/mtpService";

const MTPContext = createContext();

export const MTPProvider = ({ children }) => {
  const [mtps, setMtps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all MTPs from backend
  useEffect(() => {
    fetchMTPs();
  }, []);

  const fetchMTPs = async () => {
    try {
      setLoading(true);
      const data = await getMTPs();
      setMtps(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching MTPs:", err);
      setError("Failed to load MTPs.");
    } finally {
      setLoading(false);
    }
  };

  // Add new MTP
  const createMTP = async (formData) => {
    try {
      console.log("Submitting MTP form data:", formData); // <-- log it
      const newItem = await addMTP(formData);
      setMtps((prev) => [...prev, newItem]);
    } catch (err) {
      console.error("Error adding MTP:", err);
      throw err;
    }
  };

  // Delete MTP
  const removeMTP = async (id) => {
    try {
      await deleteMTP(id);
      setMtps((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting MTP:", err);
    }
  };

  // Update MTP
  const editMTP = async (id, updatedData) => {
    try {
      const updated = await updateMTP(id, updatedData);
      setMtps((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Error updating MTP:", err);
    }
  };

  return (
    <MTPContext.Provider
      value={{
        mtps,
        loading,
        error,
        fetchMTPs,
        createMTP,
        removeMTP,
        editMTP,
      }}
    >
      {children}
    </MTPContext.Provider>
  );
};

export const useMTP = () => useContext(MTPContext);
