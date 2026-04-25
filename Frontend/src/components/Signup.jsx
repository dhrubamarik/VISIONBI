import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineSlack,
  AiOutlineCheckCircle,
} from "react-icons/ai";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");

    // Validation 1 - empty fields
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    // Validation 2 - username too short
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    // Validation 3 - password too short
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validation 4 - passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.message) {
        // Show success state briefly then redirect
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Cannot connect to server. Is Django running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  // Password strength checker
  const getPasswordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: "Weak", color: "#ef4444", width: "30%" };
    if (password.length < 10) return { label: "Medium", color: "#f59e0b", width: "60%" };
    return { label: "Strong", color: "#4ade80", width: "100%" };
  };

  const strength = getPasswordStrength();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0f",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background glow effects */}
      <div style={{
        position: "absolute",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: 300, height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(78,168,160,0.08) 0%, transparent 70%)",
        bottom: "20%", right: "20%",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "min(420px, 92vw)",
        background: "rgba(16,16,26,0.95)",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: 16,
        padding: "2.5rem",
        position: "relative",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.05)",
      }}>

        {/* Top gold line */}
        <div style={{
          position: "absolute",
          top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        }} />

        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.65rem",
          marginBottom: "2rem",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 9,
            background: "linear-gradient(135deg,#c9a84c,#e8c97a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0a0a0f", fontSize: "1.2rem",
            boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
          }}>
            <AiOutlineSlack />
          </div>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.3rem", fontWeight: 600,
              letterSpacing: "0.1em", color: "#f0ece0",
              textTransform: "uppercase", lineHeight: 1.1,
            }}>
              Vision<span style={{ color: "#c9a84c" }}>BI</span>
            </div>
            <div style={{
              fontSize: "0.55rem", letterSpacing: "0.2em",
              color: "#8a8580", textTransform: "uppercase",
            }}>
              Analytics Platform
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "1.8rem", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.8rem", fontWeight: 600,
            color: "#f0ece0", letterSpacing: "0.05em", margin: 0,
          }}>
            Create Account
          </h2>
          <p style={{
            color: "#8a8580", fontSize: "0.78rem",
            letterSpacing: "0.1em", marginTop: "0.4rem",
            textTransform: "uppercase",
          }}>
            Join VisionBI today
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div style={{
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: 8,
            padding: "0.7rem 1rem",
            marginBottom: "1.2rem",
            color: "#4ade80",
            fontSize: "0.8rem",
            letterSpacing: "0.03em",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}>
            <AiOutlineCheckCircle size={16} />
            Account created! Redirecting to login...
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            padding: "0.7rem 1rem",
            marginBottom: "1.2rem",
            color: "#ef4444",
            fontSize: "0.8rem",
            letterSpacing: "0.03em",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Username field */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{
            display: "block", fontSize: "0.65rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#8a8580", marginBottom: "0.5rem",
          }}>
            Username
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "0.9rem",
              top: "50%", transform: "translateY(-50%)",
              color: "#c9a84c", fontSize: "1rem", pointerEvents: "none",
            }}>
              <AiOutlineUser />
            </span>
            <input
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                background: "#1a1a25",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: 8,
                padding: "0.75rem 0.9rem 0.75rem 2.6rem",
                color: "#f0ece0",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.15)")}
            />
          </div>
        </div>

        {/* Password field */}
        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{
            display: "block", fontSize: "0.65rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#8a8580", marginBottom: "0.5rem",
          }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "0.9rem",
              top: "50%", transform: "translateY(-50%)",
              color: "#c9a84c", fontSize: "1rem", pointerEvents: "none",
            }}>
              <AiOutlineLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                background: "#1a1a25",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: 8,
                padding: "0.75rem 2.6rem 0.75rem 2.6rem",
                color: "#f0ece0",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.15)")}
            />
            <button
              onClick={() => setShowPassword((p) => !p)}
              style={{
                position: "absolute", right: "0.9rem",
                top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#8a8580", cursor: "pointer",
                fontSize: "1rem", padding: 0,
                display: "flex", alignItems: "center",
              }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Password strength bar */}
        {strength && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: strength.width,
                background: strength.color,
                borderRadius: 2,
                transition: "all 0.3s",
              }} />
            </div>
            <div style={{
              fontSize: "0.62rem",
              color: strength.color,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: "0.3rem",
              textAlign: "right",
            }}>
              {strength.label}
            </div>
          </div>
        )}

        {/* Confirm Password field */}
        <div style={{ marginBottom: "1.6rem" }}>
          <label style={{
            display: "block", fontSize: "0.65rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#8a8580", marginBottom: "0.5rem",
          }}>
            Confirm Password
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "0.9rem",
              top: "50%", transform: "translateY(-50%)",
              color: confirmPassword && confirmPassword === password
                ? "#4ade80"
                : "#c9a84c",
              fontSize: "1rem", pointerEvents: "none",
              transition: "color 0.2s",
            }}>
              {/* Green lock if passwords match */}
              <AiOutlineLock />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                background: "#1a1a25",
                border: `1px solid ${
                  confirmPassword && confirmPassword !== password
                    ? "rgba(239,68,68,0.4)"
                    : "rgba(201,168,76,0.15)"
                }`,
                borderRadius: 8,
                padding: "0.75rem 2.6rem 0.75rem 2.6rem",
                color: "#f0ece0",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
              onBlur={(e) => {
                e.target.style.borderColor =
                  confirmPassword && confirmPassword !== password
                    ? "rgba(239,68,68,0.4)"
                    : "rgba(201,168,76,0.15)";
              }}
            />
            <button
              onClick={() => setShowConfirm((p) => !p)}
              style={{
                position: "absolute", right: "0.9rem",
                top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#8a8580", cursor: "pointer",
                fontSize: "1rem", padding: 0,
                display: "flex", alignItems: "center",
              }}
            >
              {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          {/* Passwords match hint */}
          {confirmPassword && (
            <div style={{
              fontSize: "0.65rem",
              color: confirmPassword === password ? "#4ade80" : "#ef4444",
              marginTop: "0.35rem",
              letterSpacing: "0.05em",
            }}>
              {confirmPassword === password
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </div>
          )}
        </div>

        {/* Signup button */}
        <button
          onClick={handleSignup}
          disabled={loading || success}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: loading || success
              ? "rgba(201,168,76,0.4)"
              : "linear-gradient(135deg,#c9a84c,#e8c97a)",
            border: "none",
            borderRadius: 8,
            color: "#0a0a0f",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem", fontWeight: 600,
            letterSpacing: "0.15em", textTransform: "uppercase",
            cursor: loading || success ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            boxShadow: loading || success
              ? "none"
              : "0 4px 20px rgba(201,168,76,0.35)",
          }}
          onMouseEnter={(e) => {
            if (!loading && !success) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(201,168,76,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              loading || success ? "none" : "0 4px 20px rgba(201,168,76,0.35)";
          }}
        >
          {loading ? "Creating Account..." : success ? "Account Created!" : "Create Account"}
        </button>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "1rem", margin: "1.5rem 0",
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(201,168,76,0.1)" }} />
          <span style={{
            color: "#8a8580", fontSize: "0.7rem", letterSpacing: "0.1em",
          }}>
            OR
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(201,168,76,0.1)" }} />
        </div>

        {/* Login link */}
        <p style={{
          textAlign: "center", fontSize: "0.8rem",
          color: "#8a8580", margin: 0,
        }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#c9a84c", cursor: "pointer",
              fontWeight: 500, letterSpacing: "0.05em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c97a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#c9a84c")}
          >
            Sign In
          </span>
        </p>

        {/* Bottom gold line */}
        <div style={{
          position: "absolute",
          bottom: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
        }} />
      </div>
    </div>
  );
}

export default Signup;