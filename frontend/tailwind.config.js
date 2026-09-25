/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wa: {
          bg: "#0b141a",
          panel: "#111b21",
          header: "#202c33",
          hover: "#202c33",
          active: "#2a3942",
          out: "#005c4b",
          inn: "#202c33",
          accent: "#00a884",
          text: "#e9edef",
          muted: "#8696a0",
          icon: "#aebac1",
          border: "#2a3942",
          input: "#2a3942",
          danger: "#f15c6d",
        },
      },
      boxShadow: {
        bubble: "0 1px 0.5px rgba(11, 20, 26, 0.13)",
      },
    },
  },
  plugins: [],
};
