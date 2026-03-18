import { useState, useEffect, useRef } from "react";
import {
  AiOutlineSlack,
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineAppstore,
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineUpload,
  AiOutlineFileText,
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";

/* ── Manual Upload Form Modal ── */
const ManualForm = ({ onClose }) => {
  const fields = ["Product / Category", "Period (e.g. Jan 2024)", "Value", "Region", "Notes"];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#16161f",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: 12,
        padding: "2rem 2.5rem",
        width: "min(480px, 92vw)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 40px rgba(201,168,76,0.08)",
        position: "relative",
      }} onClick={e => e.stopPropagation()}>

        {/* top gold line */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg,transparent,#c9a84c,transparent)",
        }} />

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.6rem" }}>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem", fontWeight: 600,
              letterSpacing: "0.08em", color: "#f0ece0",
              textTransform: "uppercase",
            }}>Manual Entry</div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8a8580", textTransform: "uppercase", marginTop: 2 }}>
              Add a new data record
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 6, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#8a8580", cursor: "pointer", fontSize: "1rem",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f0ece0"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#8a8580"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; }}
          ><AiOutlineClose /></button>
        </div>

        {/* form fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {fields.map(label => (
            <div key={label}>
              <label style={{
                display: "block", fontSize: "0.65rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#8a8580", marginBottom: "0.4rem",
              }}>{label}</label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}...`}
                style={{
                  width: "100%",
                  background: "#1a1a25",
                  border: "1px solid rgba(201,168,76,0.15)",
                  borderRadius: 6,
                  padding: "0.6rem 0.9rem",
                  color: "#f0ece0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.15)"}
              />
            </div>
          ))}
        </div>

        {/* submit */}
        <button style={{
          marginTop: "1.8rem", width: "100%",
          padding: "0.75rem",
          background: "linear-gradient(135deg,#c9a84c,#e8c97a)",
          border: "none", borderRadius: 6,
          color: "#0a0a0f",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.82rem", fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(201,168,76,0.35)",
          transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(201,168,76,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,168,76,0.35)"; }}
        >
          Submit Entry
        </button>
      </div>
    </div>
  );
};

/* ── CSV Upload Modal ── */
const CsvModal = ({ onClose }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#16161f",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: 12,
        padding: "2rem 2.5rem",
        width: "min(440px, 92vw)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 40px rgba(201,168,76,0.08)",
        position: "relative",
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg,transparent,#c9a84c,transparent)",
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.6rem" }}>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem", fontWeight: 600,
              letterSpacing: "0.08em", color: "#f0ece0", textTransform: "uppercase",
            }}>Upload CSV</div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8a8580", textTransform: "uppercase", marginTop: 2 }}>
              Drag & drop or browse
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 6, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#8a8580", cursor: "pointer", fontSize: "1rem",
          }}><AiOutlineClose /></button>
        </div>

        {/* drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#c9a84c" : "rgba(201,168,76,0.25)"}`,
            borderRadius: 10,
            padding: "2.5rem 1rem",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.02)",
            transition: "all 0.25s",
          }}
        >
          <div style={{ fontSize: "2rem", color: "#c9a84c", marginBottom: "0.75rem" }}>
            <AiOutlineUpload />
          </div>
          {file ? (
            <div>
              <div style={{ color: "#c9a84c", fontWeight: 500, fontSize: "0.9rem" }}>{file.name}</div>
              <div style={{ color: "#8a8580", fontSize: "0.75rem", marginTop: 4 }}>
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          ) : (
            <>
              <div style={{ color: "#f0ece0", fontSize: "0.88rem", marginBottom: 4 }}>
                Drop your CSV file here
              </div>
              <div style={{ color: "#8a8580", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                or click to browse
              </div>
            </>
          )}
          <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }}
            onChange={e => setFile(e.target.files[0])} />
        </div>

        <button style={{
          marginTop: "1.5rem", width: "100%", padding: "0.75rem",
          background: file ? "linear-gradient(135deg,#c9a84c,#e8c97a)" : "rgba(255,255,255,0.05)",
          border: file ? "none" : "1px solid rgba(201,168,76,0.2)",
          borderRadius: 6,
          color: file ? "#0a0a0f" : "#8a8580",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.82rem", fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase",
          cursor: file ? "pointer" : "not-allowed",
          transition: "all 0.3s",
          boxShadow: file ? "0 4px 20px rgba(201,168,76,0.35)" : "none",
        }}>
          {file ? "Upload & Process" : "Select a file first"}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN HEADER
══════════════════════════════════════════ */
function Header({ isLoggedIn = true, activeView, onViewChange, username = "Dhruba" }) {
  const [scrolled,     setScrolled]     = useState(false);
  const [time,         setTime]         = useState(new Date());
  const [newOpen,      setNewOpen]      = useState(false);
  const [userOpen,     setUserOpen]     = useState(false);
  const [showCsv,      setShowCsv]      = useState(false);
  const [showManual,   setShowManual]   = useState(false);
  const newRef  = useRef();
  const userRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (newRef.current  && !newRef.current.contains(e.target))  setNewOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  /* nav items (shown when logged in) */
  const navItems = [
    { key: "home",   label: "Home",    icon: <AiOutlineHome /> },
    { key: "2d",     label: "2D View", icon: <AiOutlineBarChart /> },
    { key: "3d",     label: "3D View", icon: <AiOutlineAppstore /> },
    { key: "seeall", label: "See All", icon: <AiOutlineUnorderedList /> },
  ];

  const navStyle = (key) => ({
    display: "flex", alignItems: "center", gap: "0.4rem",
    padding: "0.45rem 0.9rem",
    borderRadius: 6,
    background: activeView === key ? "rgba(201,168,76,0.12)" : "transparent",
    border: activeView === key ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent",
    color: activeView === key ? "#c9a84c" : "#8a8580",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.78rem", fontWeight: 400,
    letterSpacing: "0.08em", textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
    whiteSpace: "nowrap",
  });

  const dropItem = (icon, label, onClick) => (
    <button key={label} onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "0.65rem",
      width: "100%", padding: "0.65rem 1rem",
      background: "transparent", border: "none",
      color: "#f0ece0",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.82rem", letterSpacing: "0.06em",
      cursor: "pointer", textAlign: "left",
      borderRadius: 6,
      transition: "background 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <span style={{ color: "#c9a84c", fontSize: "1rem" }}>{icon}</span>
      {label}
    </button>
  );

  const dropDivider = () => (
    <div style={{ height: 1, background: "rgba(201,168,76,0.1)", margin: "0.3rem 0" }} />
  );

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 200,
        background: scrolled ? "rgba(10,10,15,0.97)" : "rgba(10,10,15,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${scrolled ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.12)"}`,
        padding: "0.7rem 0",
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
      }}>
        <div className="container-fluid px-4">
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>

            {/* ── Logo ── */}
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 7,
                background: "linear-gradient(135deg,#c9a84c,#e8c97a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#0a0a0f", fontSize: "1.05rem",
                boxShadow: "0 4px 16px rgba(201,168,76,0.35)",
              }}>
                <AiOutlineSlack />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.05rem", fontWeight: 600,
                  letterSpacing: "0.1em", color: "#f0ece0",
                  textTransform: "uppercase", lineHeight: 1.1,
                }}>
                  Vision<span style={{ color: "#c9a84c" }}>BI</span>
                </div>
                <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "#8a8580", textTransform: "uppercase" }}>
                  Analytics Platform
                </div>
              </div>
            </a>

            {/* ── Nav items (logged in only) ── */}
            {isLoggedIn && (
              <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1 }}>
                {navItems.map(({ key, label, icon }) => (
                  <button key={key}
                    style={navStyle(key)}
                    onClick={() => onViewChange?.(key)}
                    onMouseEnter={e => { if (activeView !== key) { e.currentTarget.style.color = "#f0ece0"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
                    onMouseLeave={e => { if (activeView !== key) { e.currentTarget.style.color = "#8a8580"; e.currentTarget.style.background = "transparent"; } }}
                  >
                    <span style={{ fontSize: "0.95rem" }}>{icon}</span>
                    {label}
                  </button>
                ))}

                {/* ── NEW dropdown ── */}
                <div ref={newRef} style={{ position: "relative" }}>
                  <button
                    style={{
                      ...navStyle("new"),
                      background: newOpen ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.3)",
                      color: "#c9a84c",
                    }}
                    onClick={() => setNewOpen(o => !o)}
                  >
                    <span style={{ fontSize: "0.95rem" }}><AiOutlinePlus /></span>
                    New
                    <span style={{
                      fontSize: "0.6rem", marginLeft: 2,
                      transform: newOpen ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s",
                      display: "inline-block",
                    }}>▼</span>
                  </button>

                  {/* dropdown panel */}
                  {newOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 10px)", left: 0,
                      minWidth: 210,
                      background: "#16161f",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: 10,
                      padding: "0.5rem",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(201,168,76,0.06)",
                      zIndex: 300,
                      animation: "dropIn 0.2s cubic-bezier(0.23,1,0.32,1)",
                    }}>
                      {/* top gold accent */}
                      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", marginBottom: "0.4rem" }} />

                      <div style={{ padding: "0.2rem 0.8rem 0.5rem", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#8a8580", textTransform: "uppercase" }}>
                        Upload Data
                      </div>

                      {dropItem(<AiOutlineFileText />, "Upload CSV", () => { setShowCsv(true); setNewOpen(false); })}
                      {dropItem(<AiOutlineEdit />, "Manual Entry", () => { setShowManual(true); setNewOpen(false); })}

                      {dropDivider()}

                      <div style={{ padding: "0.2rem 0.8rem 0.5rem", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#8a8580", textTransform: "uppercase" }}>
                        Create
                      </div>
                      {dropItem(<AiOutlineBarChart />, "New 2D Chart", () => { onViewChange?.("2d"); setNewOpen(false); })}
                      {dropItem(<AiOutlineAppstore />, "New 3D View",  () => { onViewChange?.("3d"); setNewOpen(false); })}
                    </div>
                  )}
                </div>
              </nav>
            )}

            {/* spacer */}
            <div style={{ flex: isLoggedIn ? 0 : 1 }} />

            {/* ── Clock (center, non-logged guests see it) ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.25rem", fontWeight: 300,
                color: "#c9a84c", letterSpacing: "0.12em", lineHeight: 1.1,
              }}>{timeStr}</span>
              <span style={{ fontSize: "0.58rem", letterSpacing: "0.18em", color: "#8a8580", textTransform: "uppercase" }}>{dateStr}</span>
            </div>

            {/* ── Right side ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
              {/* live dot */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 8px rgba(74,222,128,0.7)",
                  display: "inline-block",
                  animation: "pulse-dot 2s infinite",
                }} />
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#8a8580", textTransform: "uppercase" }}>Live</span>
              </div>

              {isLoggedIn ? (
                /* ── User avatar dropdown ── */
                <div ref={userRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setUserOpen(o => !o)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.4rem 0.8rem 0.4rem 0.4rem",
                      background: "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: 999,
                      cursor: "pointer",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "linear-gradient(135deg,#c9a84c,#e8c97a)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#0a0a0f", fontSize: "0.85rem",
                    }}><AiOutlineUser /></div>
                    <span style={{ fontSize: "0.78rem", color: "#f0ece0", fontFamily: "'DM Sans', sans-serif" }}>{username}</span>
                    <span style={{ fontSize: "0.55rem", color: "#8a8580", transform: userOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
                  </button>

                  {userOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 10px)", right: 0,
                      minWidth: 170,
                      background: "#16161f",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: 10,
                      padding: "0.5rem",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                      zIndex: 300,
                      animation: "dropIn 0.2s cubic-bezier(0.23,1,0.32,1)",
                    }}>
                      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", marginBottom: "0.4rem" }} />
                      {dropItem(<AiOutlineUser />, "Profile", () => setUserOpen(false))}
                      {dropDivider()}
                      {dropItem(<AiOutlineLogout />, "Logout", () => setUserOpen(false))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Modals ── */}
      {showCsv    && <CsvModal    onClose={() => setShowCsv(false)} />}
      {showManual && <ManualForm  onClose={() => setShowManual(false)} />}

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.8); }
        }
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </>
  );
}

export default Header;