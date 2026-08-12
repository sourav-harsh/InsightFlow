/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff", 100: "#d9ebff", 200: "#bcdcff", 300: "#8ec6ff",
          400: "#59a5ff", 500: "#2f83fb", 600: "#1763ef", 700: "#124fdb",
          800: "#1541b1", 900: "#173a8b",
        },
        ink: { 900: "#0b1220", 800: "#111a2b", 700: "#18233a", 600: "#22304c" },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { card: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.1)" },
    },
  },
  plugins: [],
};
