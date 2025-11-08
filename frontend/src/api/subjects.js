import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API_URL = `${baseURL}/subjects`;

export const getSubjects = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const addSubject = async (subject) => {
  const { data } = await axios.post(API_URL, subject);
  return data;
};

export const deleteSubject = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

export const updateSubject = async (id, updatedData) => {
  const { data } = await axios.put(`${API_URL}/${id}`, updatedData);
  return data;
};
