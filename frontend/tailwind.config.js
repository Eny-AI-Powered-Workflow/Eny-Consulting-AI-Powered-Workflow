module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2d0f46",
        paper: "#f6f0ff",
        brass: "#9f7aea",
        plum: "#7c3aed",
        lavender: "#c4b5fd",
        violet: "#8b5cf6",
        slate: {
          DEFAULT: "#475569",
          10: "#f8fafc",
          20: "#e2e8f0",
          30: "#cbd5e1",
          50: "#64748b",
          60: "#475569",
        },
        signal: {
          green: "#16a34a",
          red: "#dc2626",
        },
      },
      boxShadow: {
        glow: "0 20px 60px rgba(124, 58, 237, 0.12)",
      },
    },
  },
  plugins: [],
};
