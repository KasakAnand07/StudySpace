import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getMTPs = async () => {
  const { data } = await axios.get(`${BASE_URL}/mtp`);
  return data;
};

export const addMTP = async (formData) => {
  const { data } = await axios.post(`${BASE_URL}/mtp`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteMTP = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/mtp/${id}`);
  return data;
};

export const updateMTP = async (id, formData) => {
  const { data } = await axios.put(`${BASE_URL}/mtp/${id}`, formData);
  return data;
};
