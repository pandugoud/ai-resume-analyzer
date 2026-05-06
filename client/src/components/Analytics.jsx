import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const Analytics = ({ stats, result }) => {
  if (!stats) return null;

  const pieData = [
    { name: "High Matches", value: stats.highMatches || 0 },
    { name: "Low Matches", value: stats.lowMatches || 0 }
  ];

  const scoreData = result
    ? [
        { name: "Match", value: result.analytics?.skillMatchPercent || 0 },
        { name: "Missing", value: 100 - (result.analytics?.skillMatchPercent || 0) }
      ]
    : [];

  return (
    <div className="analytics-grid">
      <div className="card chart-card">
        <h3>Top Skills</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topSkills}>
            <XAxis dataKey="skill" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card chart-card">
        <h3>Match Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {result && (
        <div className="card chart-card full-width">
          <h3>Current Resume Skill Match</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={scoreData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;