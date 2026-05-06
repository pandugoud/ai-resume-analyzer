import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const Dashboard = ({ user, onLogout }) => {
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [filterScore, setFilterScore] = useState("all");

  const fetchStats = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        API.get("/resume/stats"),
        API.get("/resume/all")
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
      setResult(data);
      setSelectedAnalysis(data);
      setResume(null);
      setJobDescription("");
      fetchStats();
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        item.candidateName?.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.fileName?.toLowerCase().includes(historySearch.toLowerCase());

      let matchesScore = true;
      if (filterScore === "high") matchesScore = item.score >= 70;
      if (filterScore === "medium") matchesScore = item.score >= 40 && item.score < 70;
      if (filterScore === "low") matchesScore = item.score < 40;

      return matchesSearch && matchesScore;
    });
  }, [history, historySearch, filterScore]);

  const currentView = selectedAnalysis || result;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-logo">AI</div>
          <div>
            <h1 className="brand-title">AI Resume Analyzer</h1>
            <p className="brand-subtitle">
              Upload resumes, match jobs, score candidates, and review insights
            </p>
          </div>
        </div>

        <div className="topbar-actions">
          <div className="user-chip">
            <span>{user?.name || "Demo User"}</span>
            <small>{user?.email || "demo@example.com"}</small>
          </div>
          <button className="ghost-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-shell">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">AI + Resume Parsing + Job Matching</span>
            <h2>Find stronger candidate-job matches with instant AI analysis.</h2>
            <p>
              Upload a PDF resume, paste the job description, and get extracted skills,
              match score, missing keywords, resume suggestions, and analytics in one place.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-box">
              <span>Total Analyses</span>
              <strong>{stats?.totalAnalyses || 0}</strong>
            </div>
            <div className="stat-box">
              <span>Average Score</span>
              <strong>{stats?.averageScore || 0}%</strong>
            </div>
            <div className="stat-box">
              <span>High Matches</span>
              <strong>{stats?.highMatches || 0}</strong>
            </div>
            <div className="stat-box">
              <span>Low Matches</span>
              <strong>{stats?.lowMatches || 0}</strong>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="card form-card">
            <div className="section-head">
              <h3>Upload Resume</h3>
              <p>Select a PDF resume and paste a target job description.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Resume PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
              />

              <label>Job Description</label>
              <textarea
                rows="8"
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <button type="submit" className="btn-primary">
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="section-head">
              <h3>Latest Result</h3>
              <p>Current selected report summary.</p>
            </div>

            {currentView ? (
              <>
                <div className="score-circle">{Math.round(currentView.score)}%</div>

                <div className="summary-list">
                  <div className="summary-row">
                    <span>Candidate</span>
                    <strong>{currentView.candidateName || "Unknown Candidate"}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Resume File</span>
                    <strong>{currentView.fileName}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Matched Skills</span>
                    <strong>{currentView.matchedSkills?.length || 0}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Missing Skills</span>
                    <strong>{currentView.missingSkills?.length || 0}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Skill Match</span>
                    <strong>{currentView.analytics?.skillMatchPercent || 0}%</strong>
                  </div>
                </div>
              </>
            ) : (
              <p className="empty-text">
                No analysis selected yet. Upload a resume to see score, skills, and suggestions.
              </p>
            )}
          </div>
        </section>

        <section className="analytics-grid">
          <div className="card chart-card">
            <div className="section-head">
              <h3>Top Skills</h3>
              <p>Most frequently extracted skills from analyzed resumes.</p>
            </div>

            {stats?.topSkills?.length ? (
              <div className="tags">
                {stats.topSkills.map((item, idx) => (
                  <span className="tag" key={idx}>
                    {item.skill} ({item.count})
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-text">No skill analytics yet.</p>
            )}
          </div>

          <div className="card chart-card">
            <div className="section-head">
              <h3>Current Match Snapshot</h3>
              <p>Quick overview from selected analysis.</p>
            </div>

            {currentView ? (
              <div className="details-grid">
                <div className="detail-box">
                  <span>Resume Words</span>
                  <strong>{currentView.analytics?.resumeWordCount || 0}</strong>
                </div>
                <div className="detail-box">
                  <span>JD Words</span>
                  <strong>{currentView.analytics?.jdWordCount || 0}</strong>
                </div>
                <div className="detail-box">
                  <span>Matched</span>
                  <strong>{currentView.analytics?.matchedSkillsCount || 0}</strong>
                </div>
                <div className="detail-box">
                  <span>Missing</span>
                  <strong>{currentView.analytics?.missingSkillsCount || 0}</strong>
                </div>
              </div>
            ) : (
              <p className="empty-text">No selected analysis to display.</p>
            )}
          </div>
        </section>

        <section className="card full-panel mt-24">
          <div className="history-toolbar">
            <div className="section-head">
              <h3>Recent Analyses</h3>
              <p>Browse previous resume analysis reports and open details.</p>
            </div>

            <div className="history-actions">
              <input
                className="history-search"
                type="text"
                placeholder="Search candidate or file..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />

              <select
                className="history-select"
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
              >
                <option value="all">All Scores</option>
                <option value="high">High (70%+)</option>
                <option value="medium">Medium (40% - 69%)</option>
                <option value="low">Low (Below 40%)</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>File</th>
                  <th>Score</th>
                  <th>Matched Skills</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length ? (
                  filteredHistory.map((item) => (
                    <tr
                      key={item._id}
                      className={selectedAnalysis?._id === item._id ? "active-row" : ""}
                    >
                      <td>{item.candidateName || "Unknown Candidate"}</td>
                      <td>{item.fileName}</td>
                      <td>{Math.round(item.score)}%</td>
                      <td>{item.matchedSkills?.length || 0}</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          type="button"
                          className="table-btn"
                          onClick={() => setSelectedAnalysis(item)}
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-text">
                      No analyses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {currentView && (
          <section className="card full-panel mt-24">
            <div className="section-head">
              <h3>Selected Analysis Report</h3>
              <p>Detailed insights, extracted skills, missing skills, and suggestions.</p>
            </div>

            <div className="report-grid">
              <div className="report-panel">
                <h4>Extracted Skills</h4>
                <div className="tags">
                  {currentView.extractedSkills?.length ? (
                    currentView.extractedSkills.map((skill, idx) => (
                      <span className="tag" key={idx}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="empty-text">No skills extracted.</p>
                  )}
                </div>
              </div>

              <div className="report-panel">
                <h4>Matched Skills</h4>
                <div className="tags">
                  {currentView.matchedSkills?.length ? (
                    currentView.matchedSkills.map((skill, idx) => (
                      <span className="tag success" key={idx}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="empty-text">No matched skills.</p>
                  )}
                </div>
              </div>

              <div className="report-panel">
                <h4>Missing Skills</h4>
                <div className="tags">
                  {currentView.missingSkills?.length ? (
                    currentView.missingSkills.map((skill, idx) => (
                      <span className="tag danger" key={idx}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="empty-text">No missing skills identified.</p>
                  )}
                </div>
              </div>

              <div className="report-panel">
                <h4>Suggestions</h4>
                {currentView.suggestions?.length ? (
                  <ul>
                    {currentView.suggestions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-text">No suggestions available.</p>
                )}
              </div>

              <div className="report-panel full-width">
                <h4>Resume Text</h4>
                <p className="report-text">
                  {currentView.resumeText || "Resume text not available."}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;