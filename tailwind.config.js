/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0E14",
        panel: "#12161F",
        border: "#1F2530",
        ink: "#E4E7EC",
        muted: "#8B93A3",
        accent: "#3B82F6",
        success: "#22C55E",
        friction: "#EAB308",
        blocker: "#EF4444",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
