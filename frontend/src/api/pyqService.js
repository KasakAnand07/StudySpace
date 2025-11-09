import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getPYQs = async () => {
  const { data } = await axios.get(`${BASE_URL}/pyq`);
  return data;
};

export const addPYQ = async (formData) => {
  const { data } = await axios.post(`${BASE_URL}/pyq`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deletePYQ = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/pyq/${id}`);
  return data;
};

export const updatePYQ = async (id, formData) => {
  const { data } = await axios.put(`${BASE_URL}/pyq/${id}`, formData);
  return data;
};
