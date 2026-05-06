import axios from "axios";

export const analyzeResumeWithAI = async (payload) => {
  const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, payload);
  return response.data;
};