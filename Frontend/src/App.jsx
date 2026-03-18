import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Header from './components/Header'
import QueryInput from './components/QueryInput'
import WelcomeMsg from './components/WelcomeMsg'
import Dashboard from './components/Dashboard'
import IntroScreen from './components/Introscreen'
import LandingPage from './components/Landingpage'

function App() {
  const [charts, setCharts] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState("home");

  const BASE_URL = "http://localhost:5000";  // he can change this
  const ENDPOINT = "/ask"; // he can change this
  const handleQuery = async (query) => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // 🔥 supports BOTH formats (your backend + his backend)
        body: JSON.stringify({
          prompt: query,
          query: query
        })
      });

      const result = await response.json();

      // 🛑 Safety
      if (!result) {
        console.error("Empty response");
        return;
      }

      // 🔥 Flexible data handling
      const rawData = result.data || result.result || result.output || [];

      const formattedData = rawData.map(row => {
        const keys = Object.keys(row);

        return {
          name: row[keys[0]],
          value: row[keys[1]]
        };
      });

      const chart = {
        type: result.chart || result.type || "bar",
        title: query,
        data: formattedData
      };

      setCharts(prev => [...prev, chart]);

    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isVisible = !showIntro && !showLanding;

  const AILoader = () => (
    <div style={{
      textAlign: "center", padding: "1.5rem",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.8rem", letterSpacing: "0.18em",
      textTransform: "uppercase", color: "#c9a84c",
    }}>
      <span style={{ display: "inline-block", animation: "pulse-dot 1.2s infinite", marginRight: "0.5rem" }}>◆</span>
      Analysing data with AI...
    </div>
  );

  return (
    <>
      {/* 1. Intro */}
      {showIntro && <IntroScreen onDone={() => setShowIntro(false)} />}

      {/* 2. Landing */}
      {!showIntro && showLanding && (
        <LandingPage onEnter={() => setShowLanding(false)} />
      )}

      {/* 3. Main App */}
      <div style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s cubic-bezier(0.23,1,0.32,1)",
        pointerEvents: isVisible ? "auto" : "none",
      }}>

        <Header
          isLoggedIn={isLoggedIn}
          activeView={activeView}
          onViewChange={setActiveView}
          username="Dhruba"
        />

        <div className="container-fluid">

          {/* ── HOME ── */}
          {activeView === "home" && (
            <>
              {charts.length === 0 && <WelcomeMsg />}
              {loading && <AILoader />}
              <QueryInput handleQuery={handleQuery} hasCharts={charts.length > 0} />
              <Dashboard charts={charts} />
            </>
          )}

          {/* ── 2D VIEW ── */}
          {activeView === "2d" && (
            <>
              {loading && <AILoader />}
              <QueryInput handleQuery={handleQuery} hasCharts={charts.length > 0} />
              <Dashboard charts={charts} />
            </>
          )}

          {/* ── 3D VIEW — replace comment with friend's component ── */}
          {activeView === "3d" && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: "70vh", flexDirection: "column", gap: "1rem",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem", color: "#c9a84c",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>3D Visualisation</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.22em", color: "#8a8580", textTransform: "uppercase" }}>
                Waiting for 3D module
              </div>
              {/* 👇 Uncomment and replace when your friend's component is ready */}
              {/* <ThreeDChart charts={charts} /> */}
            </div>
          )}

          {/* ── SEE ALL ── */}
          {activeView === "seeall" && (
            <>
              {charts.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "5rem 1rem",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.5rem", color: "#8a8580",
                  letterSpacing: "0.08em",
                }}>
                  No charts yet — ask a question to generate one.
                </div>
              ) : (
                <Dashboard charts={charts} />
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default App;