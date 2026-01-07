import api from "@/api/axios";

export const createCV = (data) => {
  return api.post("/cv", data);
};

export const getMyCVs = () => {
  return api.get("/cv");
};

export const getCVById = (id) => {
  return api.get(`/cv/${id}`);
};

export const updateCV = (id, data) => {
  return api.put(`/cv/${id}`, data);
};

export const deleteCVById = (id) => {
  return api.delete(`/cv/${id}`);
};

export const setDefaultCV = (id) => {
  return api.put(`/cv/${id}/default`);
};

