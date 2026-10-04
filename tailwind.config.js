/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#11151F",
        panel: "#1B212D",
        panel2: "#222A38",
        border: "#2E3747",
        border2: "#3A4557",
        ink: "#F5F7FA",
        muted: "#9AA5B5",
        accent: "#5B9DFF",
        accent2: "#9B7CFF",
        success: "#34D399",
        friction: "#FBBF24",
        blocker: "#F87171",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}