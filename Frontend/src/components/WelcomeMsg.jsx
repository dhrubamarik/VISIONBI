import { AiOutlineBarChart, AiOutlineLineChart, AiOutlinePieChart } from "react-icons/ai";

const suggestions = [
  { icon: <AiOutlineLineChart />, label: "Sales Trend",         query: "sales trend" },
  { icon: <AiOutlinePieChart />,  label: "Market Share",        query: "market share" },
  { icon: <AiOutlineBarChart />,  label: "Revenue by Category", query: "revenue by category" },
];

const WelcomeMsg = () => {
  return (
    <div style={{
      minHeight: "38vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1rem 1rem",
      textAlign: "center",
      animation: "fadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) both",
    }}>

      {/* Decorative ring */}
      <div style={{
        width: 64, height: 64,
        borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "1.5rem",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: -8,
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.1)",
        }} />
        <span style={{ fontSize: "1.6rem", color: "#c9a84c" }}>
          <AiOutlineBarChart />
        </span>
      </div>

      {/* Heading */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
        fontWeight: 300,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#f0ece0",
        marginBottom: "0.4rem",
        lineHeight: 1.2,
      }}>
        Ask questions about <span style={{ color: "#c9a84c", fontWeight: 600 }}>your data</span>
      </h2>

      {/* Gold rule */}
      <div style={{
        width: 50, height: 1,
        background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        margin: "1rem auto 1.2rem",
      }} />

      {/* Subtext */}
      <p style={{
        fontSize: "0.75rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#8a8580",
        marginBottom: "2.2rem",
      }}>
        Generate insights instantly — try a query below
      </p>

      {/* Suggestion chips */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        justifyContent: "center",
      }}>
        {suggestions.map(({ icon, label, query }) => (
          <button
            key={query}
            onClick={() => {
              const input = document.querySelector(".search-input");
              if (input) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype, "value"
                ).set;
                nativeInputValueSetter.call(input, query);
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.focus();
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.2rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "4px",
              color: "#f0ece0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(201,168,76,0.08)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ color: "#c9a84c", fontSize: "1rem" }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

    </div>
  );
};

export default WelcomeMsg;