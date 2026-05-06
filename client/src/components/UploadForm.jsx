import { useState } from "react";
import API from "../services/api";

const UploadForm = ({ onAnalysisComplete }) => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume || !jobDescription.trim()) {
      alert("Please upload resume and enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      const { data } = await API.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onAnalysisComplete(data);
      setResume(null);
      setJobDescription("");
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h3>Upload Resume</h3>

      <label>Resume PDF</label>
      <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />

      <label>Job Description</label>
      <textarea
        rows="8"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </form>
  );
};

export default UploadForm;