import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api";

function TrackerPage() {
  const [input, setInput] = useState({ weight: 60, blood_pressure: "120/80", sugar_level: 110, symptoms: "" });
  const [logs, setLogs] = useState([]);
  const [recommendations, setRecommendations] = useState({ warnings: [], diet_plan: [], exercises: [] });

  const fetchLogs = () => api.get("/health/logs").then((res) => setLogs(res.data));
  useEffect(() => {
    fetchLogs();
  }, []);

  const chartData = useMemo(
    () => logs.map((log) => ({ date: new Date(log.created_at).toLocaleDateString(), weight: log.weight, sugar: log.sugar_level })),
    [logs]
  );

  const save = async () => {
    await api.post("/health/log", { ...input, weight: Number(input.weight), sugar_level: Number(input.sugar_level) });
    await fetchLogs();
    const rec = await api.post("/recommendations", { ...input, weight: Number(input.weight), sugar_level: Number(input.sugar_level) });
    setRecommendations(rec.data);
  };

  return (
    <section>
      <h1>Health Tracker & Trends</h1>
      <div className="card-soft form-grid">
        <input placeholder="Weight (kg)" onChange={(e) => setInput({ ...input, weight: e.target.value })} />
        <input placeholder="Blood Pressure (120/80)" onChange={(e) => setInput({ ...input, blood_pressure: e.target.value })} />
        <input placeholder="Sugar Level" onChange={(e) => setInput({ ...input, sugar_level: e.target.value })} />
        <input placeholder="Symptoms" onChange={(e) => setInput({ ...input, symptoms: e.target.value })} />
        <button onClick={save}>Save Health Log</button>
      </div>
      <div className="card-soft">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#ec4899" />
            <Line type="monotone" dataKey="sugar" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {!!recommendations.warnings.length && <p className="warning">{recommendations.warnings.join(" | ")}</p>}
    </section>
  );
}

export default TrackerPage;
