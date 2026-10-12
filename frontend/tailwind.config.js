/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        moss: { 50: "#F1F7EC", 100: "#E1EED7", 200: "#C3DCB0", 500: "#4F8A4B", 700: "#2F5D3A", 900: "#1B3524" },
        bark: "#3B2F2A",
        sun: "#F2C14E",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        body: ["Figtree", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
