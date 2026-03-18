import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/app"; // hard reload — App.jsx re-reads token fresh
      } else {
        alert(data.error || "Login failed");
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a", color:"white" }}>
      <div style={{ padding:"2rem", background:"#111827", borderRadius:"10px", width:"300px" }}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width:"100%", marginBottom:"10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width:"100%", marginBottom:"10px" }}
        />
        <button onClick={handleLogin} style={{ width:"100%" }}>Login</button>

        <p style={{ marginTop:"10px", fontSize:"0.8rem" }}>
          Don't have an account?{" "}
          <span style={{ color:"#3b82f6", cursor:"pointer" }} onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;