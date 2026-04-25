import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import WelcomeMsg from './components/WelcomeMsg';
import Dashboard from './components/Dashboard';
import IntroScreen from './components/Introscreen';
import LandingPage from './components/Landingpage';
// ADD THIS WHOLE BLOCK above function App()
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
function App() {
  const navigate = useNavigate();

  const [charts, setCharts] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const username = localStorage.getItem("username");
  const BASE_URL = "http://127.0.0.1:8000";
  const ENDPOINT = "/api/ask/";
  const token = localStorage.getItem("token");
  // 🔥 MAIN QUERY FUNCTION
  // FIXED
  const handleQuery = async (query, file_id) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: query,
          file_id: file_id
        })
      });

      // ADD THIS BLOCK - handle 401 specifically
      if (response.status === 401) {
        // Token expired - clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        localStorage.removeItem("file_id");
        alert("Session expired - please login again");
        navigate("/login");
        return;
      }

      const result = await response.json();

      if (result.error) {
        alert("Error: " + result.error);
        return;
      }

      const rawData = result.data || [];

      if (rawData.error) {
        alert("Query error: " + rawData.error);
        return;
      }

      const formattedData = rawData.map(row => {
        const keys = Object.keys(row);
        return {
          name: row[keys[0]],
          value: row[keys[1]]
        };
      });

      const chart = {
        type: result.chart || "bar",
        title: query,
        data: formattedData,
        // Read active filename from localStorage
        // This was saved when user uploaded OR selected from See All
        filename: localStorage.getItem("active_filename") ||
          localStorage.getItem("filename") ||
          "unknown.csv"
      };

      setCharts(prev => [...prev, chart]);

    } catch (error) {
      console.error("API error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const isVisible = !showIntro && !showLanding;

  // 🔥 LOADER
  const AILoader = () => (
    <div style={{
      textAlign: "center",
      padding: "1.5rem",
      color: "#c9a84c"
    }}>
      Analysing data with AI...
    </div>
  );
  //Delete function 
  const handleDeleteChart = (indexToDelete) => {
    // Filter out the chart at that index
    // WHY: We never mutate state directly
    // We create NEW array without that item
    setCharts(prev => prev.filter((_, index) => index !== indexToDelete));
  };
  return (
    <Routes>

      {/* ROUTE 1: Home - Intro + Landing */}
      <Route path="/" element={
        <>
          {showIntro && (
            <IntroScreen onDone={() => setShowIntro(false)} />
          )}

          {!showIntro && (
            <LandingPage
              onEnter={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  navigate("/login");
                } else {
                  navigate("/app");
                }
              }}
            />
          )}
        </>
      } />

      {/* ROUTE 2: Login */}
      <Route path="/login" element={<Login />} />

      {/* ROUTE 3: Signup */}
      <Route path="/signup" element={<Signup />} />

      {/* ROUTE 4: Protected App - needs token */}
      <Route path="/app" element={
        <ProtectedRoute>
          <div>
            <Header
              isLoggedIn={true}
              activeView={activeView}
              onViewChange={setActiveView}
              username={localStorage.getItem("username")}
              onLogout={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                localStorage.removeItem("username");
                setCharts([]);
                navigate("/");
              }}
            />
            <div className="container-fluid">
              {activeView === "home" && (
                <>
                  {charts.length === 0 && <WelcomeMsg />}
                  {loading && <AILoader />}
                  <QueryInput handleQuery={handleQuery} />
                  <Dashboard charts={charts} onDeleteChart={handleDeleteChart} />
                </>
              )}
            </div>
          </div>
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;