import { createContext, useContext, useState, useEffect } from "react";
import { getRTPs, addRTP, deleteRTP, updateRTP } from "../api/rtpService";

const RTPContext = createContext();

export const RTPProvider = ({ children }) => {
  const [rtps, setRtps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all RTPs from backend
  useEffect(() => {
    fetchRTPs();
  }, []);

  const fetchRTPs = async () => {
    try {
      setLoading(true);
      const data = await getRTPs();
      setRtps(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching RTPs:", err);
      setError("Failed to load RTPs.");
    } finally {
      setLoading(false);
    }
  };

  // Add new RTP
  const createRTP = async (formData) => {
    try {
      console.log("Submitting RTP form data:", formData); // <-- log it
      const newItem = await addRTP(formData);
      setRtps((prev) => [...prev, newItem]);
    } catch (err) {
      console.error("Error adding RTP:", err);
      throw err;
    }
  };

  // Delete RTP
  const removeRTP = async (id) => {
    try {
      await deleteRTP(id);
      setRtps((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting RTP:", err);
    }
  };

  // Update RTP
  const editRTP = async (id, updatedData) => {
    try {
      const updated = await updateRTP(id, updatedData);
      setRtps((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Error updating RTP:", err);
    }
  };

  return (
    <RTPContext.Provider
      value={{
        rtps,
        loading,
        error,
        fetchRTPs,
        createRTP,
        removeRTP,
        editRTP,
      }}
    >
      {children}
    </RTPContext.Provider>
  );
};

export const useRTP = () => useContext(RTPContext);
