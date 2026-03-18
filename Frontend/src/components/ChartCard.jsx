import {
  BarChart, LineChart, Line, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  Bar, ResponsiveContainer
} from "recharts";

import {
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlinePieChart,
  AiOutlineFund
} from "react-icons/ai";

/* ── Luxury palette ── */
const COLORS = [
  "#c9a84c", "#7c6fcd", "#4ea8a0", "#c96c4c",
  "#7cb87c", "#c94c7c", "#4c8cc9", "#a07c4c",
];

/* Custom bar shape */
const ColoredBar = (props) => {
  const { x, y, width, height, index } = props;
  const color = COLORS[index % COLORS.length];
  return (
    <g>
      <defs>
        <linearGradient id={`bar-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity={0.95} />
          <stop offset="100%" stopColor={color} stopOpacity={0.45} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={width} height={height}
        fill={`url(#bar-grad-${index})`} rx={4} ry={4} />
    </g>
  );
};

/* Custom tooltip */
const LuxTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const color = payload[0]?.payload?._color || COLORS[0];
  return (
    <div style={{
      background: "rgba(16,16,26,0.95)",
      border: `1px solid ${color}55`,
      borderRadius: 4, padding: "0.6rem 1rem",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.8rem", color: "#f0ece0",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      {label && <p style={{ color: "#8a8580", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.7rem", marginBottom: 4 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

/* Custom pie label */
const PieLabel = ({ cx, cy, midAngle, outerRadius, name, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill={COLORS[index % COLORS.length]}
      textAnchor={x > cx ? "start" : "end"} dominantBaseline="central"
      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.04em" }}>
      {name}: {(percent * 100).toFixed(0)}%
    </text>
  );
};

/* ── Metric Card ── */
const MetricDisplay = ({ chart }) => {
  const item = chart.data?.[0];
  const raw  = item?.value ?? item?.name ?? "—";

  /* format: if numeric add commas, prefix $ if title hints at revenue/sales */
  const isRevenue = /revenue|sales|profit|amount|total/i.test(chart.title);
  const isNumeric = !isNaN(parseFloat(raw));
  const formatted = isNumeric
    ? (isRevenue ? "$" : "") + Number(raw).toLocaleString()
    : String(raw);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "260px", gap: "1.2rem",
      position: "relative",
    }}>
      {/* outer glow ring */}
      <div style={{
        position: "absolute",
        width: 180, height: 180,
        borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.15)",
        boxShadow: "0 0 60px rgba(201,168,76,0.08)",
      }} />
      <div style={{
        position: "absolute",
        width: 140, height: 140,
        borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.25)",
      }} />

      {/* value */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
        fontWeight: 600,
        color: "#c9a84c",
        letterSpacing: "0.04em",
        lineHeight: 1,
        textShadow: "0 0 40px rgba(201,168,76,0.4)",
        zIndex: 1,
        textAlign: "center",
      }}>
        {formatted}
      </div>

      {/* label */}
      {item?.name && item.name !== raw && (
        <div style={{
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#8a8580",
          zIndex: 1,
        }}>
          {item.name}
        </div>
      )}

      {/* animated gold underline */}
      <div style={{
        width: 60, height: 1,
        background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        zIndex: 1,
        animation: "metricLine 1.2s cubic-bezier(0.23,1,0.32,1) both",
      }} />

      <style>{`
        @keyframes metricLine {
          from { width: 0; opacity: 0; }
          to   { width: 60px; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const ChartCard = ({ chart }) => {
  return (
    <div className="body card dashboard-card glass-card h-100">
      <div className="card-body p-4">

        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <span className="me-2 text-secondary">
            {chart.type === "bar"    && <AiOutlineBarChart  size={20} />}
            {chart.type === "line"   && <AiOutlineLineChart size={20} />}
            {chart.type === "pie"    && <AiOutlinePieChart  size={20} />}
            {chart.type === "metric" && <AiOutlineFund      size={20} />}
          </span>
          <h5 className="mb-0 fw-semibold text-capitalize text-dark">
            {chart.title}
          </h5>
        </div>

        <hr className="my-3" />

        {/* Chart / Metric */}
        <div style={{ width: "100%", height: "320px", minHeight: "320px" }}>

          {/* ── METRIC ── */}
          {chart.type === "metric" && <MetricDisplay chart={chart} />}

          {/* ── BAR ── */}
          {chart.type === "bar" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.08)" />
                <XAxis dataKey="name" tick={{ fill: "#8a8580", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8580", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<LuxTooltip />} cursor={{ fill: "rgba(201,168,76,0.06)" }} />
                <Legend wrapperStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8a8580" }} />
                <Bar dataKey="value" shape={<ColoredBar />} animationDuration={1200} radius={[6,6,0,0]}>
                  {chart.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* ── LINE ── */}
          {chart.type === "line" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart.data}>
                <defs>
                  <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#c9a84c" />
                    <stop offset="50%"  stopColor="#7c6fcd" />
                    <stop offset="100%" stopColor="#4ea8a0" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.08)" />
                <XAxis dataKey="name" tick={{ fill: "#8a8580", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8580", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<LuxTooltip />} cursor={{ stroke: "rgba(201,168,76,0.2)" }} />
                <Legend wrapperStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8a8580" }} />
                <Line
                  type="monotone" dataKey="value"
                  stroke="url(#line-grad)" strokeWidth={3}
                  dot={{ fill: "#c9a84c", stroke: "#0a0a0f", strokeWidth: 2, r: 5 }}
                  activeDot={{ fill: "#e8c97a", r: 7, stroke: "#0a0a0f", strokeWidth: 2 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* ── PIE ── */}
          {chart.type === "pie" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chart.data} dataKey="value"
                  cx="50%" cy="50%"
                  outerRadius={95} innerRadius={38}
                  paddingAngle={3}
                  isAnimationActive animationDuration={1200}
                  labelLine={{ stroke: "rgba(201,168,76,0.3)", strokeWidth: 1 }}
                  label={<PieLabel />}
                >
                  {chart.data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]}
                      stroke="rgba(10,10,15,0.6)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<LuxTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChartCard;