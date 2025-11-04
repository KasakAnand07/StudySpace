import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import trophyAnimation from "../assets/trophy.json";
import fireAnimation from "../assets/fire.json";
import LayoutWrapper from "../components/LayoutWrapper";

export default function Progress() {
  const [stats, setStats] = useState({
    subjects: 0,
    flashcards: 0,
    completionRate: 0,
    studyStreak: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [accuracyData, setAccuracyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showTrophy, setShowTrophy] = useState(false);

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"];

  // --- Fetch all stats ---
  const fetchStats = async () => {
    try {
      const [subRes, flashRes, timeRes] = await Promise.all([
        axios.get("http://localhost:5000/api/subjects"),
        axios.get("http://localhost:5000/api/flashcards"),
        axios.get("http://localhost:5000/api/study-sessions/summary"),
      ]);

      const subjects = subRes.data || [];
      const flashcards = flashRes.data || [];
      const timeSummary = timeRes.data || {};

      const totalSubjects = subjects.length;
      const totalFlashcards = flashcards.length;
      const completionRate = Math.min(
        ((totalFlashcards / (totalSubjects * 10)) * 100).toFixed(1),
        100
      );

      const barData = subjects.map((s) => ({
        name: s.name,
        flashcards: flashcards.filter((f) => f.subject === s.name).length,
      }));

      const pieData = subjects.map((s) => ({
        name: s.name,
        time: timeSummary[s.name] ? (timeSummary[s.name] / 60).toFixed(1) : 0, // hrs
      }));

      const accData = subjects.map((s) => ({
        name: s.name,
        accuracy: Math.floor(Math.random() * 40) + 60,
      }));

      // --- Realistic streak ---
      const today = new Date().toDateString();
      const lastActiveDate = localStorage.getItem("lastActiveDate");
      let streak = parseInt(localStorage.getItem("studyStreak")) || 0;

      if (lastActiveDate !== today) {
        if (lastActiveDate) {
          const diffDays =
            (new Date(today) - new Date(lastActiveDate)) / (1000 * 3600 * 24);
          if (diffDays <= 1) streak += 1;
          else streak = 1;
        } else streak = 1;
      }

      localStorage.setItem("studyStreak", streak);
      localStorage.setItem("lastActiveDate", today);

      setStats({
        subjects: totalSubjects,
        flashcards: totalFlashcards,
        completionRate,
        studyStreak: streak,
      });

      setChartData(barData);
      setTimeData(pieData);
      setAccuracyData(accData);

      // --- Weekly progress chart (simulated for now) ---
      const weekly = Array.from({ length: 7 }, (_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        hours: Math.floor(Math.random() * 3) + 1,
      }));
      setWeeklyData(weekly);

      if (completionRate >= 100) {
        setShowTrophy(true);
        setTimeout(() => setShowTrophy(false), 4000);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // auto refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // --- Study session handlers ---
  const startSession = async () => {
    if (!selectedSubject) {
      alert("Please select a subject first!");
      return;
    }
    const { data } = await axios.post("http://localhost:5000/api/study-sessions/start", {
      subject: selectedSubject,
    });
    setActiveSession(data);
  };

  const stopSession = async () => {
    if (!activeSession) return;
    await axios.post(`http://localhost:5000/api/study-sessions/stop/${activeSession._id}`);
    setActiveSession(null);
    fetchStats();
  };

  const resetProgress = () => {
    localStorage.removeItem("studyStreak");
    localStorage.removeItem("lastActiveDate");
    setStats((prev) => ({ ...prev, studyStreak: 0 }));
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <LayoutWrapper
      title="My Progress"
      subtitle="Visualize your study sessions and performance trends"
    >
      <Container className="mt-4 mb-5">
        {/* Study Session Controls */}
        <Card className="p-3 mb-4 shadow-sm">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {chartData.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {activeSession ? (
              <Button variant="danger" onClick={stopSession}>
                ⏹️ Stop Session
              </Button>
            ) : (
              <Button variant="success" onClick={startSession}>
                ▶️ Start Study Session
              </Button>
            )}
          </div>
        </Card>

        {/* Summary Cards */}
        <Row className="g-4 mb-4">
          {[
            { label: "📚 Subjects", value: stats.subjects, color: "primary" },
            { label: "💡 Flashcards", value: stats.flashcards, color: "success" },
            { label: "📈 Completion", value: `${stats.completionRate}%`, color: "warning" },
            { label: "🔥 Streak", value: `${stats.studyStreak} days`, color: "danger" },
          ].map((item, idx) => (
            <Col md={3} key={idx}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className={`shadow-sm text-center p-3 border-${item.color}`}>
                  <h5>{item.label}</h5>
                  <h3 className={`text-${item.color}`}>{item.value}</h3>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Charts */}
        <Card className="p-4 shadow-sm mb-4">
          <h5 className="text-center mb-3">Flashcards per Subject</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="flashcards" fill="#007bff" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 shadow-sm mb-4">
          <h5 className="text-center mb-3">Time Spent (Hours)</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={timeData} dataKey="time" nameKey="name" outerRadius={100} label>
                {timeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 shadow-sm mb-4">
          <h5 className="text-center mb-3">Accuracy by Subject</h5>
          {accuracyData.map((a, i) => (
            <div key={i} className="mb-3">
              <div className="d-flex justify-content-between">
                <strong>{a.name}</strong>
                <span>{a.accuracy}%</span>
              </div>
              <ProgressBar
                now={a.accuracy}
                animated
                variant={
                  a.accuracy > 85 ? "success" : a.accuracy > 70 ? "warning" : "danger"
                }
              />
            </div>
          ))}
        </Card>

        <Card className="p-4 shadow-sm mb-4">
          <h5 className="text-center mb-3">📅 Weekly Study Hours</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#17a2b8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {showTrophy && (
          <div className="text-center mt-5">
            <Lottie animationData={trophyAnimation} loop={false} style={{ height: 200 }} />
            <h4 className="text-success fw-bold mt-3">
              🎉 Congratulations! You’ve completed all your goals!
            </h4>
          </div>
        )}

        <div className="text-center mt-4">
          <Button variant="outline-secondary" onClick={resetProgress}>
            ♻️ Reset Progress
          </Button>
        </div>
      </Container>
    </LayoutWrapper>
  );
}
