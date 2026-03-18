import { useEffect, useRef, useState } from "react";
import { AiOutlineSlack } from "react-icons/ai";

const IntroScreen = ({ onDone }) => {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0); // 0=canvas, 1=text, 2=fading
  const [visible, setVisible] = useState(true);

  /* ── Three.js scene ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const cx = W / 2, cy = H / 2;
    const ctx = canvas.getContext("2d");

    let raf;
    let t = 0;

    /* particles */
    const PARTS = 120;
    const parts = Array.from({ length: PARTS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    /* orbital ring config */
    const rings = [
      { rx: 160, ry: 55,  tilt: 0.38, speed: 0.012, color: "#c9a84c", width: 1.5 },
      { rx: 200, ry: 65,  tilt: -0.55, speed: -0.009, color: "#7c6fcd", width: 1 },
      { rx: 130, ry: 45,  tilt: 1.1,  speed: 0.018, color: "#4ea8a0", width: 0.8 },
    ];

    /* orbiting dots on each ring */
    const dots = rings.map(r => ({ angle: Math.random() * Math.PI * 2, ring: r }));

    function drawEllipse3D(rx, ry, tilt, alpha, color, lineW) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = lineW;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();
    }

    function drawDot(angle, ring, alpha) {
      const x = Math.cos(angle) * ring.rx;
      const y = Math.sin(angle) * ring.ry;
      // rotate by tilt
      const rx2 = x * Math.cos(ring.tilt) - y * Math.sin(ring.tilt);
      const ry2 = x * Math.sin(ring.tilt) + y * Math.cos(ring.tilt);
      ctx.save();
      ctx.translate(cx + rx2, cy + ry2);
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = ring.color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
    }

    function drawLogo(alpha) {
      // gold square bg
      const size = 52;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = alpha;

      // rounded rect
      const r = 10;
      ctx.beginPath();
      ctx.moveTo(-size/2 + r, -size/2);
      ctx.lineTo( size/2 - r, -size/2);
      ctx.quadraticCurveTo( size/2, -size/2,  size/2, -size/2 + r);
      ctx.lineTo( size/2,  size/2 - r);
      ctx.quadraticCurveTo( size/2,  size/2,  size/2 - r,  size/2);
      ctx.lineTo(-size/2 + r,  size/2);
      ctx.quadraticCurveTo(-size/2,  size/2, -size/2,  size/2 - r);
      ctx.lineTo(-size/2, -size/2 + r);
      ctx.quadraticCurveTo(-size/2, -size/2, -size/2 + r, -size/2);
      ctx.closePath();

      // gold gradient fill
      const grd = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
      grd.addColorStop(0, "#c9a84c");
      grd.addColorStop(1, "#e8c97a");
      ctx.fillStyle = grd;
      ctx.shadowColor = "#c9a84c";
      ctx.shadowBlur = 30;
      ctx.fill();

      // grid icon (4 squares)
      ctx.fillStyle = "#0a0a0f";
      ctx.shadowBlur = 0;
      const g = 7, gs = 8;
      [[-g,-g],[g,-g],[-g,g],[g,g]].forEach(([dx,dy]) => {
        ctx.fillRect(dx - gs/2 + 1, dy - gs/2 + 1, gs - 2, gs - 2);
      });

      ctx.restore();
    }

    function drawDataLines(alpha) {
      // animated data-stream lines radiating outward
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t * 0.3;
        const len = 60 + Math.sin(t * 2 + i) * 20;
        const startR = 35;
        ctx.save();
        ctx.globalAlpha = alpha * (0.3 + 0.2 * Math.sin(t * 3 + i));
        ctx.strokeStyle = i % 2 === 0 ? "#c9a84c" : "#7c6fcd";
        ctx.lineWidth = 1;
        ctx.shadowColor = i % 2 === 0 ? "#c9a84c" : "#7c6fcd";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR);
        ctx.lineTo(cx + Math.cos(angle) * (startR + len), cy + Math.sin(angle) * (startR + len));
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawScanLine(alpha) {
      const y = cy + Math.sin(t * 1.2) * 180;
      const grad = ctx.createLinearGradient(cx - 220, 0, cx + 220, 0);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, `rgba(201,168,76,${0.12 * alpha})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - 220, y - 1, 440, 2);
    }

    function tick() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      // fade-in progress over first 0.8s (~48 frames)
      const fadeIn = Math.min(t / 0.8, 1);

      // background grid dots (particles)
      parts.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = H;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#c9a84c";
        ctx.globalAlpha = p.opacity * fadeIn * 0.6;
        ctx.fill();
        ctx.restore();
      });

      // scan line
      drawScanLine(fadeIn);

      // 3D rings
      rings.forEach(r => {
        drawEllipse3D(r.rx, r.ry, r.tilt, fadeIn * 0.55, r.color, r.width);
      });

      // orbiting dots
      dots.forEach(d => {
        d.angle += d.ring.speed;
        drawDot(d.angle, d.ring, fadeIn * 0.9);
      });

      // data stream lines
      drawDataLines(fadeIn);

      // center logo
      drawLogo(fadeIn);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    // trigger text phase
    const textTimer = setTimeout(() => setPhase(1), 900);
    // trigger fade out
    const fadeTimer = setTimeout(() => setPhase(2), 3200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  // unmount
  useEffect(() => {
    if (phase === 2) {
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 900);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: phase === 2 ? "opacity 0.9s cubic-bezier(0.23,1,0.32,1)" : "none",
      opacity: phase === 2 ? 0 : 1,
    }}>

      {/* Canvas for 3D engine */}
      <canvas ref={canvasRef} style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }} />

      {/* Text overlay */}
      <div style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        marginTop: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.6rem",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.9s cubic-bezier(0.23,1,0.32,1), transform 0.9s cubic-bezier(0.23,1,0.32,1)",
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
          fontWeight: 300,
          letterSpacing: "0.18em",
          color: "#f0ece0",
          textTransform: "uppercase",
          margin: 0,
          lineHeight: 1.1,
        }}>
          VISION <span style={{ color: "#c9a84c", fontWeight: 600 }}>BI</span> 
        </h1>

        <p style={{
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "#8a8580",
          margin: 0,
        }}>
          Data · Insight · Action
        </p>

        <div style={{
          width: phase >= 1 ? "180px" : "0px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
          transition: "width 1s cubic-bezier(0.23,1,0.32,1) 0.3s",
          marginTop: "0.4rem",
        }} />
      </div>

    </div>
  );
};

export default IntroScreen;