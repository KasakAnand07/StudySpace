import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getRTPs = async () => {
  const { data } = await axios.get(`${BASE_URL}/rtp`);
  return data;
};

export const addRTP = async (formData) => {
  const { data } = await axios.post(`${BASE_URL}/rtp`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteRTP = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/rtp/${id}`);
  return data;
};

export const updateRTP = async (id, formData) => {
  const { data } = await axios.put(`${BASE_URL}/rtp/${id}`, formData);
  return data;
};
