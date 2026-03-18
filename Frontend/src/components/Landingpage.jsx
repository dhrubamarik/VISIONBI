import { useEffect, useRef, useState } from "react";
import { AiOutlineSlack, AiOutlineArrowRight } from "react-icons/ai";

const LandingPage = ({ onEnter }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  /* ── mouse track ── */
  useEffect(() => {
    const move = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ── canvas orb animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    let raf, t = 0;

    /* vertical light-bar refraction strips — like the reference image */
    const STRIPS = 38;

    /* floating orb particles */
    const ORB_PARTS = 180;
    const orbParts = Array.from({ length: ORB_PARTS }, (_, i) => {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      return { theta, phi, r: 130 + Math.random() * 30, speed: (Math.random() - 0.5) * 0.004, opacity: Math.random() };
    });

    /* background star field */
    const STARS = 80;
    const stars = Array.from({ length: STARS }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1,
      o: Math.random() * 0.4 + 0.05,
    }));

    function tick() {
      t += 0.012;
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      /* mouse parallax offset */
      const mx = (mouseRef.current.x / window.innerWidth  - 0.5) * 40;
      const my = (mouseRef.current.y / window.innerHeight - 0.5) * 40;

      /* stars */
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${s.o})`;
        ctx.fill();
      });

      /* ── CORE ORB ── */
      const ox = cx + mx * 0.6, oy = cy + my * 0.6;
      const orbR = Math.min(W, H) * 0.22;

      /* deep outer glow layers */
      [
        { r: orbR * 2.8, a: 0.04 },
        { r: orbR * 2.0, a: 0.07 },
        { r: orbR * 1.5, a: 0.10 },
      ].forEach(({ r, a }) => {
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        g.addColorStop(0,   `rgba(201,168,76,${a})`);
        g.addColorStop(0.5, `rgba(124,111,205,${a * 0.5})`);
        g.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      /* main orb body */
      const bodyGrad = ctx.createRadialGradient(ox - orbR * 0.3, oy - orbR * 0.3, orbR * 0.05, ox, oy, orbR);
      bodyGrad.addColorStop(0,   "#e8c97a");
      bodyGrad.addColorStop(0.3, "#c9a84c");
      bodyGrad.addColorStop(0.65, "#7a5e2a");
      bodyGrad.addColorStop(0.85, "#3a2e14");
      bodyGrad.addColorStop(1,   "#0a0a0f");
      ctx.beginPath();
      ctx.arc(ox, oy, orbR, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      /* specular highlight */
      const specGrad = ctx.createRadialGradient(
        ox - orbR * 0.35, oy - orbR * 0.38, 0,
        ox - orbR * 0.2,  oy - orbR * 0.2,  orbR * 0.55
      );
      specGrad.addColorStop(0,   "rgba(255,248,210,0.55)");
      specGrad.addColorStop(0.4, "rgba(232,201,122,0.15)");
      specGrad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(ox, oy, orbR, 0, Math.PI * 2);
      ctx.fillStyle = specGrad;
      ctx.fill();

      /* secondary rim light (amethyst) */
      const rimGrad = ctx.createRadialGradient(ox + orbR * 0.5, oy + orbR * 0.4, 0, ox + orbR * 0.5, oy + orbR * 0.4, orbR * 0.7);
      rimGrad.addColorStop(0,   "rgba(124,111,205,0.35)");
      rimGrad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(ox, oy, orbR, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();

      /* clip to orb for interior effects */
      ctx.save();
      ctx.beginPath();
      ctx.arc(ox, oy, orbR - 1, 0, Math.PI * 2);
      ctx.clip();

      /* internal animated energy veins */
      for (let i = 0; i < 6; i++) {
        const angle  = t * 0.4 + (i / 6) * Math.PI * 2;
        const sweep  = Math.PI * 0.6 + Math.sin(t + i) * 0.3;
        const vx1 = ox + Math.cos(angle) * orbR * 0.1;
        const vy1 = oy + Math.sin(angle) * orbR * 0.1;
        const vx2 = ox + Math.cos(angle + sweep) * orbR * 0.9;
        const vy2 = oy + Math.sin(angle + sweep) * orbR * 0.9;
        const vg = ctx.createLinearGradient(vx1, vy1, vx2, vy2);
        vg.addColorStop(0,   "transparent");
        vg.addColorStop(0.4, `rgba(201,168,76,${0.12 + 0.06 * Math.sin(t * 2 + i)})`);
        vg.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.moveTo(vx1, vy1);
        ctx.lineTo(vx2, vy2);
        ctx.strokeStyle = vg;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      /* ── VERTICAL REFRACTION STRIPS (the signature effect) ── */
      ctx.save();
      for (let i = 0; i < STRIPS; i++) {
        const frac   = i / STRIPS;
        const stripX = ox - orbR + frac * orbR * 2;
        /* how close to orb center horizontally */
        const dx     = (stripX - ox) / orbR;
        const insideR = Math.sqrt(Math.max(0, 1 - dx * dx));

        if (insideR < 0.01) continue;

        const topY    = oy - insideR * orbR;
        const botY    = oy + insideR * orbR;
        const stripH  = botY - topY;
        const wave    = Math.sin(t * 1.8 + frac * Math.PI * 4) * 0.18;
        const bright  = (0.5 - Math.abs(dx)) * 2;
        const alpha   = bright * (0.25 + 0.12 * Math.abs(Math.sin(t * 2 + i * 0.4)));

        /* offset each strip vertically to create refraction warp */
        const offsetY = Math.sin(t * 1.2 + frac * Math.PI * 3) * stripH * 0.22;

        ctx.beginPath();
        ctx.rect(stripX, topY + offsetY - stripH * 0.05, orbR * 2 / STRIPS + 0.5, stripH * 1.1);
        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx.fill();

        /* teal accent strip every ~5 */
        if (i % 5 === 2) {
          ctx.beginPath();
          ctx.rect(stripX, topY + offsetY, orbR * 2 / STRIPS * 0.4, stripH);
          ctx.fillStyle = `rgba(78,168,160,${alpha * 0.6})`;
          ctx.fill();
        }
      }
      ctx.restore();

      /* orb edge ring */
      ctx.beginPath();
      ctx.arc(ox, oy, orbR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,168,76,0.3)`;
      ctx.lineWidth = 1;
      ctx.shadowColor = "#c9a84c";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      /* orbiting particles (3D projection) */
      orbParts.forEach(p => {
        p.theta += p.speed;
        const sx = Math.sin(p.phi) * Math.cos(p.theta + t * 0.1);
        const sy = Math.sin(p.phi) * Math.sin(p.theta + t * 0.1);
        const sz = Math.cos(p.phi);
        /* tilt the sphere */
        const tiltX = sx;
        const tiltY = sy * Math.cos(0.4) - sz * Math.sin(0.4);
        const tiltZ = sy * Math.sin(0.4) + sz * Math.cos(0.4);
        const scale = 1 / (1 + tiltZ * 0.3);
        const px = ox + tiltX * p.r * scale + mx * 0.3;
        const py = oy + tiltY * p.r * scale + my * 0.3;
        const alpha = (0.3 + tiltZ * 0.5) * p.opacity * 0.7;
        if (alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(px, py, 1.2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx.fill();
      });

      /* bottom reflection / shadow on floor */
      const shadowGrad = ctx.createRadialGradient(ox, oy + orbR * 0.9, 0, ox, oy + orbR * 0.9, orbR * 1.2);
      shadowGrad.addColorStop(0,   "rgba(201,168,76,0.12)");
      shadowGrad.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.ellipse(ox, oy + orbR * 0.95, orbR * 1.1, orbR * 0.18, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    setTimeout(() => setLoaded(true), 200);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9000,
      background: "#0a0a0f",
      display: "flex",
      alignItems: "stretch",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: "0 0 48%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2.5rem 3rem 3rem",
        position: "relative",
        zIndex: 2,
      }}>

        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(-12px)",
          transition: "all 0.8s cubic-bezier(0.23,1,0.32,1) 0.1s",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: "linear-gradient(135deg,#c9a84c,#e8c97a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0a0a0f", fontSize: "1.15rem",
            boxShadow: "0 4px 16px rgba(201,168,76,0.4)",
          }}>
            <AiOutlineSlack />
          </div>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.1rem", fontWeight: 600,
              letterSpacing: "0.1em", color: "#f0ece0",
              textTransform: "uppercase",
            }}>
              Vision<span style={{ color: "#c9a84c" }}>BI</span>
            </div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "#8a8580", textTransform: "uppercase" }}>
              Data Analytics Platform
            </div>
          </div>
        </div>

        {/* Main copy */}
        <div style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.23,1,0.32,1) 0.3s",
        }}>
          <p style={{
            fontSize: "0.7rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#c9a84c",
            marginBottom: "1.2rem",
          }}>
            ◆ AI-Powered Intelligence
          </p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.8rem, 4.5vw, 4.2rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: "0.02em",
            color: "#f0ece0",
            marginBottom: "1.5rem",
          }}>
            Illuminate<br />
            Your Business<br />
            <span style={{ color: "#c9a84c", fontWeight: 600 }}>Intelligence.</span>
          </h1>

          <p style={{
            fontSize: "1rem",
            fontWeight: 300,
            color: "#8a8580",
            lineHeight: 1.75,
            maxWidth: 400,
            marginBottom: "2.8rem",
          }}>
            Elevate your decisions with AI-driven analytics.
            Ask questions in plain English — get instant, beautiful insights.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={onEnter}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.85rem 2rem",
                background: "linear-gradient(135deg,#c9a84c,#e8c97a)",
                border: "none", borderRadius: "999px",
                color: "#0a0a0f",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem", fontWeight: 500,
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(201,168,76,0.45)",
                transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(201,168,76,0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,168,76,0.45)";
              }}
            >
              Explore VisionBI
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(0,0,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem",
              }}>
                <AiOutlineArrowRight />
              </span>
            </button>

            <button
              style={{
                padding: "0.85rem 1.8rem",
                background: "transparent",
                border: "1px solid rgba(201,168,76,0.25)",
                borderRadius: "999px",
                color: "#f0ece0",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem", fontWeight: 300,
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)";
                e.currentTarget.style.background = "rgba(201,168,76,0.06)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: "2rem",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.9s cubic-bezier(0.23,1,0.32,1) 0.6s",
        }}>
          {[
            { n: "10x", label: "Faster Insights" },
            { n: "99%", label: "Accuracy" },
            { n: "∞",   label: "Queries" },
          ].map(({ n, label }) => (
            <div key={label}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.8rem", fontWeight: 600,
                color: "#c9a84c", lineHeight: 1,
              }}>{n}</div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "#8a8580", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — canvas orb ── */}
      <div style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* vertical separator line */}
        <div style={{
          position: "absolute", left: 0, top: "10%", bottom: "10%",
          width: 1,
          background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.25), transparent)",
        }} />

        <canvas ref={canvasRef} style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
        }} />

        {/* "press to interact" hint */}
        <div style={{
          position: "absolute", bottom: "2.5rem", left: "50%",
          transform: "translateX(-50%)",
          padding: "0.5rem 1.2rem",
          background: "rgba(10,10,15,0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(201,168,76,0.15)",
          borderRadius: 999,
          fontSize: "0.68rem", letterSpacing: "0.18em",
          color: "#8a8580", textTransform: "uppercase",
          whiteSpace: "nowrap",
          opacity: loaded ? 0.8 : 0,
          transition: "opacity 1s ease 1s",
        }}>
          Move cursor to interact
        </div>
      </div>

      {/* thin gold top border */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
      }} />
    </div>
  );
};

export default LandingPage;